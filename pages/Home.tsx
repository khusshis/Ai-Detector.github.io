import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Zap, Activity, Layers } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center pt-10 lg:pt-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-10"></div>
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm animate-pulse-slow">
          <span className="w-2 h-2 rounded-full bg-green-400"></span>
          <span className="text-sm font-medium text-gray-300">New: Enhanced V2.5 Detection Model</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl leading-tight">
          Unmask <span className="gradient-text">AI-Generated</span> Images with Precision
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed">
          Veritas AI uses advanced neural networks to detect synthetic imagery artifacts, 
          providing you with a confidence score and detailed forensic analysis instantly.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            to="/detect"
            className="px-8 py-4 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-lg flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(107,70,193,0.4)] hover:shadow-[0_0_30px_rgba(107,70,193,0.6)]"
          >
            Start Analysis <ArrowRight size={20} />
          </Link>
          <Link 
            to="/about"
            className="px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-lg border border-white/10 transition-all backdrop-blur-sm"
          >
            How it Works
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-16">Advanced Detection Capabilities</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <Zap className="text-yellow-400" size={32} />,
              title: "Instant Analysis",
              desc: "Get results in seconds using our optimized Gemini Vision integration."
            },
            {
              icon: <Layers className="text-cyan-400" size={32} />,
              title: "Artifact Detection",
              desc: "Identifies common generation errors in hands, text, and textures."
            },
            {
              icon: <Activity className="text-pink-400" size={32} />,
              title: "Deep Forensics",
              desc: "Analyzes noise patterns and lighting inconsistencies invisible to the naked eye."
            },
            {
              icon: <ShieldCheck className="text-green-400" size={32} />,
              title: "Detailed Reports",
              desc: "Download comprehensive PDF reports for documentation and evidence."
            }
          ].map((feature, idx) => (
            <div key={idx} className="glass-card p-6 rounded-2xl hover:bg-white/10 transition-colors group">
              <div className="mb-4 p-3 rounded-lg bg-white/5 w-fit group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-100">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-white/10 bg-black/20 backdrop-blur-sm py-16">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold gradient-text mb-2">98.5%</div>
            <div className="text-gray-400 text-sm">Detection Accuracy</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-white mb-2">24/7</div>
            <div className="text-gray-400 text-sm">API Availability</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-white mb-2">50k+</div>
            <div className="text-gray-400 text-sm">Images Analyzed</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-white mb-2">0.5s</div>
            <div className="text-gray-400 text-sm">Average Latency</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;