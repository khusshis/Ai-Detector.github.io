export enum DetectionVerdict {
  AI = 'AI-Generated',
  HUMAN = 'Human-Made',
  UNCERTAIN = 'Uncertain'
}

export interface MetricEntry {
  label: string;
  value: number; // 0-100
}

export interface AnalysisResult {
  verdict: DetectionVerdict;
  confidence: number;
  aiProbability: number;
  visualArtifacts: string[];
  reasoning: string;
  metrics: MetricEntry[];
  localAnalysis?: {
    noiseVariance: number;
    isStandardAIRes: boolean;
    dimensions: string;
    fileSize: string;
  };
  huggingFaceScore?: number; // 0-1 probability
  modelUsed: string;
  timestamp: string;
}

export interface ScanHistoryItem extends AnalysisResult {
  id: string;
  thumbnail: string; // Base64 or URL
  fileName: string;
}

export interface NavItem {
  label: string;
  path: string;
  icon: any; // Lucide icon component
}