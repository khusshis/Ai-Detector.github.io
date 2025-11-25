import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip } from 'recharts';
import { AnalysisResult } from '../types';

interface ChartsProps {
  data: AnalysisResult;
}

const COLORS = ['#6B46C1', '#1f2937']; // Primary Purple vs Dark Gray

export const ConfidenceGauge: React.FC<{ value: number }> = ({ value }) => {
  const chartData = [
    { name: 'Confidence', value: value },
    { name: 'Remaining', value: 100 - value },
  ];

  return (
    <div className="h-64 relative flex flex-col items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            startAngle={180}
            endAngle={0}
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            <Cell key="cell-0" fill={value > 80 ? '#06B6D4' : value > 50 ? '#6B46C1' : '#F59E0B'} />
            <Cell key="cell-1" fill="#334155" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute top-[60%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <span className="text-4xl font-bold text-white">{value}%</span>
        <p className="text-xs text-gray-400 uppercase tracking-wider">Confidence</p>
      </div>
    </div>
  );
};

export const MetricsRadar: React.FC<{ metrics: AnalysisResult['metrics'] }> = ({ metrics }) => {
  // Fix: Map the metrics array to the format expected by Recharts RadarChart.
  // We handle the case where metrics might be empty or undefined.
  const data = (metrics && metrics.length > 0) 
    ? metrics.map(m => ({ subject: m.label, A: m.value, fullMark: 100 }))
    : [
        { subject: 'Texture', A: 0, fullMark: 100 },
        { subject: 'Lighting', A: 0, fullMark: 100 },
        { subject: 'Anatomy', A: 0, fullMark: 100 },
        { subject: 'Consistency', A: 0, fullMark: 100 },
      ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#374151" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="AI Metrics"
            dataKey="A"
            stroke="#6B46C1"
            strokeWidth={2}
            fill="#6B46C1"
            fillOpacity={0.4}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}
            itemStyle={{ color: '#E5E7EB' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};