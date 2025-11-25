import React from 'react';
import { Cpu, Eye, Lock, Database } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">How It Works</h1>
        <p className="text-xl text-gray-400">Understanding the technology behind Veritas AI Image Forensics.</p>
      </div>

      <div className="space-y-16">
        {/* Section 1 */}
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-6">
              <Eye className="text-primary" size={24} />
            </div>
            <h2 className="text-2xl font-bold mb-4">Visual Artifact Analysis</h2>
            <p className="text-gray-400 leading-relaxed">
              AI image generators, despite their advancements, often leave behind subtle visual artifacts. Our system uses the Google Gemini Vision model to scan for specific irregularities such as:
            </p>
            <ul className="mt-4 space-y-2 text-gray-300 list-disc pl-5">
              <li>Inconsistent lighting logic and shadow placement.</li>
              <li>Anatomical errors (fingers, teeth, pupils).</li>
              <li>Text rendering failures (alien glyphs).</li>
              <li>Overly smooth, plastic-like skin textures.</li>
            </ul>
          </div>
          <div className="flex-1 p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-white/10">
            <div className="w-full h-48 rounded-lg bg-black/40 flex items-center justify-center border border-white/5 relative overflow-hidden">
               <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%)] animate-[pulse_3s_ease-in-out_infinite]"></div>
               <span className="text-gray-500 font-mono text-sm">Scanning for artifacts...</span>
            </div>
          </div>
        </div>

        {/* Section 2 */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-10">
          <div className="flex-1">
            <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center mb-6">
              <Cpu className="text-secondary" size={24} />
            </div>
            <h2 className="text-2xl font-bold mb-4">Multi-Modal Logic</h2>
            <p className="text-gray-400 leading-relaxed">
              We don't just look at pixels. We analyze the semantic context of the image. Does the scene make logical sense? Is the perspective physically possible?
            </p>
            <p className="mt-4 text-gray-400 leading-relaxed">
              By combining low-level pixel analysis with high-level semantic understanding, Veritas AI reduces false positives common in older detection methods that only relied on noise patterns.
            </p>
          </div>
          <div className="flex-1 p-8 rounded-2xl bg-gradient-to-bl from-secondary/10 to-transparent border border-white/10">
             <div className="grid grid-cols-2 gap-4">
               <div className="h-20 bg-white/5 rounded-lg border border-white/5"></div>
               <div className="h-20 bg-white/5 rounded-lg border border-white/5"></div>
               <div className="h-20 bg-white/5 rounded-lg border border-white/5"></div>
               <div className="h-20 bg-white/5 rounded-lg border border-white/5"></div>
             </div>
          </div>
        </div>

        {/* Privacy Note */}
        <div className="glass-card p-8 rounded-2xl text-center">
          <Lock className="mx-auto text-accent mb-4" size={32} />
          <h2 className="text-xl font-bold mb-2">Privacy First</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Images uploaded to Veritas AI are processed in real-time. We do not store your personal images on our servers after analysis is complete. The history feature on this app stores data locally in your browser.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;