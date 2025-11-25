import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, DetectionVerdict, MetricEntry } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface LocalMetrics {
  dimensions: string;
  isStandardAIRes: boolean;
  noiseVariance: number;
  fileSize: string;
}

// Helper to query Hugging Face API
async function queryHuggingFace(file: File): Promise<number | null> {
  // Try to get key from process.env (Vite/Next naming conventions)
  const HF_TOKEN = process.env.HUGGING_FACE_API_KEY || process.env.VITE_HUGGING_FACE_API_KEY || process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY;
  
  if (!HF_TOKEN) {
    console.warn("Hugging Face API Key missing. Skipping external expert model.");
    return null;
  }

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/umm-maybe/AI-image-detector",
      {
        headers: { Authorization: `Bearer ${HF_TOKEN}` },
        method: "POST",
        body: file,
      }
    );
    
    if (!response.ok) {
        console.warn("HF API Error:", response.statusText);
        return null;
    }
    
    const result = await response.json();
    // Expected result: [{ label: 'artificial', score: 0.99 }, { label: 'human', score: 0.01 }]
    if (Array.isArray(result) && result.length > 0) {
      // Logic for umm-maybe/AI-image-detector
      const artificial = result.find((r: any) => r.label === 'artificial');
      if (artificial) return artificial.score;
      
      const human = result.find((r: any) => r.label === 'human');
      if (human) return 1 - human.score;
    }
    return null;
  } catch (e) {
    console.error("Hugging Face Analysis Failed:", e);
    return null;
  }
}

export const analyzeImageWithGemini = async (
  file: File,
  base64Image: string,
  localMetrics?: LocalMetrics
): Promise<AnalysisResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please configure process.env.API_KEY.");
  }

  // 1. Query Expert Model (Hugging Face)
  const hfScore = await queryHuggingFace(file);
  const hfConfidenceContext = hfScore !== null 
    ? `EXTERNAL EXPERT AI MODEL SCORE: ${(hfScore * 100).toFixed(1)}% chance of being AI-Generated.` 
    : "EXTERNAL EXPERT MODEL: Unavailable (Network/Auth error).";

  // Parse mimeType and base64 data
  let mimeType = file.type || 'image/jpeg';
  let base64Data = base64Image;
  if (base64Image.startsWith('data:')) {
    const matches = base64Image.match(/^data:([^;]+);base64,(.+)$/);
    if (matches) {
      mimeType = matches[1];
      base64Data = matches[2];
    }
  } else {
    const split = base64Image.split(',');
    if (split.length > 1) base64Data = split[1];
  }

  const model = "gemini-2.5-flash"; 

  // Inject heuristic data
  const heuristicContext = localMetrics ? `
    CLIENT-SIDE METRICS:
    - Dimensions: ${localMetrics.dimensions} ${localMetrics.isStandardAIRes ? '(Matches common AI resolution)' : ''}
    - Noise Variance: ${localMetrics.noiseVariance} (Low < 100 implies synthetic smoothness)
  ` : '';

  const prompt = `
    You are Veritas AI, a specialized forensic engine.
    
    INPUT DATA:
    ${hfConfidenceContext}
    ${heuristicContext}
    
    TASK:
    Analyze the image visually to confirm the external model's score.
    If the External Score is high (>90%), look for the subtle evidence that proves it (perfect symmetry, texture smoothing, logic errors).
    If the External Score is low (<10%), look for evidence of human imperfection (sensor noise, focus errors, organic asymmetry).
    
    CRITICAL: Modern AI (Gemini, Midjourney v6) is extremely realistic. 
    - Do NOT rely solely on "bad hands" or "weird text".
    - Look for "Hyper-Consistency" in lighting and texture.
    - Look for "Digital Sheen" or plastic-like skin.

    Provide 4 distinct forensic metrics (e.g. Texture, Lighting, Anatomy, Consistency) in the "metrics" array. 
    Each with a value 0-100 indicating the degree of AI artifacts found (0=Natural, 100=Artificial).
    
    OUTPUT JSON format only.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          { inlineData: { mimeType: mimeType, data: base64Data } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            verdict: { type: Type.STRING, enum: ["AI-Generated", "Human-Made", "Uncertain"] },
            confidence: { type: Type.NUMBER, description: "Final confidence 0-100" },
            aiProbability: { type: Type.NUMBER, description: "Final probability 0-100" },
            visualArtifacts: { type: Type.ARRAY, items: { type: Type.STRING } },
            reasoning: { type: Type.STRING },
            metrics: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  value: { type: Type.NUMBER }
                }
              }
            }
          },
          required: ["verdict", "confidence", "aiProbability", "visualArtifacts", "reasoning", "metrics"]
        }
      }
    });

    const textResponse = response.text;
    if (!textResponse) throw new Error("No response from Gemini");

    const data = JSON.parse(textResponse);

    // If HF score is very strong, we bias the final result towards it if Gemini was uncertain
    let finalVerdict = DetectionVerdict.UNCERTAIN;
    if (data.verdict === "AI-Generated") finalVerdict = DetectionVerdict.AI;
    if (data.verdict === "Human-Made") finalVerdict = DetectionVerdict.HUMAN;

    // Strong Override logic: If HF is > 98% sure it's AI, but Gemini is unsure, trust HF.
    if (hfScore !== null && hfScore > 0.98 && finalVerdict === DetectionVerdict.UNCERTAIN) {
        finalVerdict = DetectionVerdict.AI;
        data.aiProbability = Math.max(data.aiProbability, 95);
        data.reasoning = `External specialist model detected distinct AI signatures (${(hfScore*100).toFixed(1)}%). ` + data.reasoning;
    }

    return {
      verdict: finalVerdict,
      confidence: data.confidence,
      aiProbability: data.aiProbability,
      visualArtifacts: data.visualArtifacts || [],
      reasoning: data.reasoning,
      metrics: data.metrics,
      localAnalysis: localMetrics,
      huggingFaceScore: hfScore !== null ? hfScore : undefined,
      modelUsed: hfScore !== null ? "Ensemble (HF + Gemini)" : "Gemini Vision (Standalone)",
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error("Analysis Error:", error);
    return {
      verdict: DetectionVerdict.UNCERTAIN,
      confidence: 0,
      aiProbability: 0,
      visualArtifacts: ["Connection Error"],
      reasoning: "Failed to connect to forensic engines.",
      metrics: [],
      modelUsed: "Error",
      timestamp: new Date().toISOString()
    };
  }
};