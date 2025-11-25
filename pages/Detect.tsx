import React, { useState, useEffect } from 'react';
import UploadZone from '../components/UploadZone';
import { analyzeImageWithGemini } from '../services/geminiService';
import { AnalysisResult, DetectionVerdict, ScanHistoryItem } from '../types';
import { ConfidenceGauge, MetricsRadar } from '../components/AnalysisCharts';
import { AlertTriangle, CheckCircle, Download, RefreshCw, Zap, Activity, Eye, ShieldAlert, Cpu, Ruler, BarChart3, CloudLightning } from 'lucide-react';

interface DetectProps {
  addToHistory: (item: ScanHistoryItem) => void;
}

const Detect: React.FC<DetectProps> = ({ addToHistory }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setResult(null);
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
  };

  useEffect(() => {
    if (isAnalyzing) {
      const steps = [
        "Running Client-Side Forensics...",
        "Querying Hugging Face Specialist Model...",
        "Uploading to Gemini Vision...",
        "Synthesizing Ensemble Verdict..."
      ];
      let i = 0;
      setAnalysisStep(steps[0]);
      const interval = setInterval(() => {
        i++;
        if (i < steps.length) {
          setAnalysisStep(steps[i]);
        }
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [isAnalyzing]);

  // Client-side heuristics
  const analyzeLocalFeatures = async (file: File): Promise<{
    dimensions: string;
    isStandardAIRes: boolean;
    noiseVariance: number;
    fileSize: string;
  }> => {
    return new Promise((resolve) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({ dimensions: 'Unknown', isStandardAIRes: false, noiseVariance: 0, fileSize: '0MB' });
          return;
        }
        ctx.drawImage(img, 0, 0);
        
        // 1. Dimension Check
        const dimensions = `${img.width}x${img.height}`;
        const commonSizes = [1024, 512, 768, 1344, 1216, 1536];
        const isStandardAIRes = commonSizes.includes(img.width) || commonSizes.includes(img.height);
        
        // 2. Simple Noise/Variance Analysis
        const patchSize = Math.min(100, img.width, img.height);
        const centerX = Math.floor(img.width / 2) - Math.floor(patchSize / 2);
        const centerY = Math.floor(img.height / 2) - Math.floor(patchSize / 2);
        
        const patch = ctx.getImageData(centerX, centerY, patchSize, patchSize);
        let sum = 0;
        let sqSum = 0;
        let count = 0;

        for (let i = 0; i < patch.data.length; i += 4) {
          const lum = 0.299 * patch.data[i] + 0.587 * patch.data[i + 1] + 0.114 * patch.data[i + 2];
          sum += lum;
          sqSum += lum * lum;
          count++;
        }
        
        const mean = sum / count;
        const variance = (sqSum / count) - (mean * mean);
        
        resolve({
          dimensions,
          isStandardAIRes,
          noiseVariance: Number(variance.toFixed(2)),
          fileSize: (file.size / 1024 / 1024).toFixed(2) + 'MB'
        });
        URL.revokeObjectURL(objectUrl);
      };
      img.src = objectUrl;
    });
  };

  const startAnalysis = async () => {
    if (!selectedFile || !previewUrl) return;

    setIsAnalyzing(true);
    setResult(null);

    try {
      // 1. Run local heuristics first
      const localMetrics = await analyzeLocalFeatures(selectedFile);
      
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        
        // 2. Pass File AND Base64 to service (Ensemble)
        const analysis = await analyzeImageWithGemini(selectedFile, base64data, localMetrics);
        setResult(analysis);
        
        addToHistory({
          ...analysis,
          id: Date.now().toString(),
          fileName: selectedFile.name,
          thumbnail: base64data
        });
        
        setIsAnalyzing(false);
      };
    } catch (error) {
      console.error(error);
      setIsAnalyzing(false);
      alert("Analysis failed. Please try again.");
    }
  };

  const downloadReport = () => {
    alert("Downloading Full Forensic PDF Report...");
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-3">Ensemble Forensic Detection</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Combining Hugging Face specialized models with Gemini Vision reasoning and client-side mathematics 
          for robust detection of Gemini, Midjourney v6, and Flux images.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Upload */}
        <div className="space-y-6">
          <UploadZone 
            onFileSelect={handleFileSelect} 
            selectedImage={previewUrl} 
            onClear={handleClear}
            isAnalyzing={isAnalyzing}
          />

          {previewUrl && !isAnalyzing && !result && (
            <button
              onClick={startAnalysis}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2 group"
            >
              <Zap size={20} className="fill-white group-hover:animate-pulse" /> Run Ensemble Analysis
            </button>
          )}

          {/* Guidelines */}
          {!result && (
            <div className="glass-card p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-3 text-gray-200">How it works</h3>
              <div className="space-y-3">
                 <div className="flex items-start gap-3">
                  <CloudLightning className="text-accent mt-1" size={16} />
                  <div>
                    <h4 className="text-sm font-bold text-gray-300">Expert Model (Hugging Face)</h4>
                    <p className="text-xs text-gray-500">First pass using a specialized AI-detection neural network.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Eye className="text-accent mt-1" size={16} />
                  <div>
                    <h4 className="text-sm font-bold text-gray-300">Visual Reasoning (Gemini)</h4>
                    <p className="text-xs text-gray-500">Second pass to verify visual artifacts and explain the verdict.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Ruler className="text-accent mt-1" size={16} />
                  <div>
                    <h4 className="text-sm font-bold text-gray-300">Forensics (Local)</h4>
                    <p className="text-xs text-gray-500">Checks noise patterns and resolution constraints.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Results */}
        <div className="min-h-[400px]">
          {!result ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 glass-card rounded-2xl p-8 border-dashed border-2 border-white/5 relative overflow-hidden">
              {isAnalyzing ? (
                <div className="space-y-6 text-center z-10">
                  <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <div>
                    <p className="text-xl font-bold text-white mb-2">{analysisStep}</p>
                    <p className="text-sm text-gray-400">Please wait while we cross-reference models...</p>
                  </div>
                </div>
              ) : (
                <>
                  <ShieldAlert size={48} className="mb-4 opacity-50" />
                  <p>Results will appear here after analysis</p>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              
              {/* Main Verdict Card */}
              <div className={`p-6 rounded-2xl border relative overflow-hidden ${
                result.verdict === DetectionVerdict.AI 
                  ? 'bg-red-500/10 border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.2)]' 
                  : result.verdict === DetectionVerdict.HUMAN
                  ? 'bg-green-500/10 border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.2)]'
                  : 'bg-yellow-500/10 border-yellow-500/30'
              }`}>
                {/* Diagonal Tape for AI */}
                {result.verdict === DetectionVerdict.AI && (
                  <div className="absolute -right-12 top-6 bg-red-500 text-black text-xs font-bold py-1 px-12 rotate-45 shadow-lg">
                    SYNTHETIC
                  </div>
                )}

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide flex items-center gap-2">
                       <Cpu size={14} /> Ensemble Verdict
                    </h2>
                    <div className="flex items-center gap-3 mt-1">
                      {result.verdict === DetectionVerdict.AI ? (
                         <AlertTriangle className="text-red-400" size={32} />
                      ) : result.verdict === DetectionVerdict.HUMAN ? (
                         <CheckCircle className="text-green-400" size={32} />
                      ) : (
                         <RefreshCw className="text-yellow-400" size={32} />
                      )}
                      <span className={`text-3xl font-bold ${
                        result.verdict === DetectionVerdict.AI ? 'text-red-400' : 
                        result.verdict === DetectionVerdict.HUMAN ? 'text-green-400' : 'text-yellow-400'
                      }`}>
                        {result.verdict}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">Probability</div>
                    <div className="text-2xl font-mono text-white">{result.aiProbability}%</div>
                  </div>
                </div>
                
                {/* Reasoning */}
                <div className="bg-black/40 p-4 rounded-lg border border-white/5 mb-4">
                   <p className="text-gray-300 text-sm leading-relaxed">
                     <span className="font-semibold text-white">Forensic Analysis: </span>
                     {result.reasoning}
                   </p>
                   {result.confidence < 70 && (
                     <div className="mt-3 pt-3 border-t border-yellow-500/20 flex gap-2 items-center text-xs text-yellow-400">
                        <AlertTriangle size={12} />
                        <span>High Realism Detected: This image is visually convincing. Verdict is based on subtle micro-artifacts.</span>
                     </div>
                   )}
                </div>
              </div>

              {/* Metrics Display */}
              {result.localAnalysis && (
                <div className="glass-card p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <h3 className="text-xs text-gray-400 uppercase tracking-wider mb-1">Detection Signals</h3>
                    <div className="flex gap-6">
                       {result.huggingFaceScore !== undefined && (
                        <div className="text-sm">
                           <span className="text-gray-500 block">Ext. Model</span>
                           <span className={result.huggingFaceScore > 0.5 ? "text-red-400 font-bold" : "text-green-400 font-bold"}>
                             {(result.huggingFaceScore * 100).toFixed(0)}%
                           </span>
                        </div>
                       )}
                      <div className="text-sm">
                        <span className="text-gray-500 block">Variance</span>
                        <span className="text-white font-mono">{result.localAnalysis.noiseVariance}</span>
                      </div>
                      <div className="text-sm">
                         <span className="text-gray-500 block">Resolution</span>
                         <span className={result.localAnalysis.isStandardAIRes ? "text-red-400" : "text-green-400"}>
                           {result.localAnalysis.dimensions}
                         </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-2 bg-white/5 rounded-lg">
                    <BarChart3 className="text-accent" size={24} />
                  </div>
                </div>
              )}

              {/* Charts Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card p-4 rounded-xl">
                  <h3 className="text-sm font-medium text-gray-400 mb-2 text-center">Confidence Score</h3>
                  <ConfidenceGauge value={result.confidence} />
                </div>
                <div className="glass-card p-4 rounded-xl">
                  <h3 className="text-sm font-medium text-gray-400 mb-2 text-center">Layer Breakdown</h3>
                  <MetricsRadar metrics={result.metrics} />
                </div>
              </div>

              {/* Artifacts List */}
              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-lg font-semibold mb-4 text-white">Evidence Log</h3>
                {result.visualArtifacts.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {result.visualArtifacts.map((artifact, i) => (
                      <span key={i} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 flex items-center gap-1">
                        <AlertTriangle size={12} className="text-accent" /> {artifact}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No specific anomalies detected.</p>
                )}
              </div>

              {/* Actions */}
              <button 
                onClick={downloadReport}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              >
                <Download size={18} />
                Download Detailed Forensic Report
              </button>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Detect;