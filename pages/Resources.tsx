import React from 'react';
import { ExternalLink, Book, HelpCircle } from 'lucide-react';

const Resources: React.FC = () => {
  const articles = [
    { title: "How Diffusion Models Work", source: "AI Research Lab", link: "#" },
    { title: "The State of Deepfakes in 2024", source: "Tech Monthly", link: "#" },
    { title: "Spotting AI Hands: A Guide", source: "Visual Forensics", link: "#" },
    { title: "GANs vs Diffusion: Differences", source: "Machine Learning Blog", link: "#" },
  ];

  const faqs = [
    { q: "Is this tool 100% accurate?", a: "No tool is 100% accurate. AI detection is probabilistic. We provide a confidence score to help you make an informed decision." },
    { q: "Can it detect edited photos?", a: "Veritas AI focuses on generative AI. Heavily photoshopped images might trigger some artifacts, but the model is tuned for generative synthesis." },
    { q: "Does it work on cartoons?", a: "Yes, it can detect AI-generated anime and digital art styles, distinguishing them from human-drawn digital art based on stroke consistency." },
  ];

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <h1 className="text-3xl font-bold mb-8">Resources & Learning</h1>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Articles */}
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-6">
            <Book className="text-primary" size={24} />
            <h2 className="text-xl font-bold">Latest Research</h2>
          </div>
          <div className="space-y-4">
            {articles.map((article, i) => (
              <a key={i} href={article.link} className="block p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-200 group-hover:text-primary transition-colors">{article.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{article.source}</p>
                  </div>
                  <ExternalLink size={16} className="text-gray-600 group-hover:text-white" />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-6">
            <HelpCircle className="text-accent" size={24} />
            <h2 className="text-xl font-bold">Manual Detection Tips</h2>
          </div>
          <ul className="space-y-4 text-gray-400">
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center flex-shrink-0 text-sm font-bold">1</span>
              <span><strong>Check the Background:</strong> AI often blurs backgrounds illogically or creates objects that fade into nothing.</span>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center flex-shrink-0 text-sm font-bold">2</span>
              <span><strong>Look at Accessories:</strong> Earrings, glasses, and buttons are often asymmetrical or blend into skin/clothing.</span>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center flex-shrink-0 text-sm font-bold">3</span>
              <span><strong>Text Analysis:</strong> If there is text in the image (street signs, books), it is often gibberish in AI images.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* FAQ */}
      <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
      <div className="grid gap-4">
        {faqs.map((faq, i) => (
          <div key={i} className="glass-card p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-white mb-2">{faq.q}</h3>
            <p className="text-gray-400">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Resources;