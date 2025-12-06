import React, { useState, useEffect } from 'react';
import { Github, Code, Zap, Sparkles } from 'lucide-react';

const FloatingCard3D = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center perspective-container">
      {/* Rope/String */}
      <div 
        className={`absolute top-0 left-1/2 -translate-x-1/2 transition-all duration-[2000ms] ease-out ${
          isVisible ? 'h-[200px] opacity-100' : 'h-0 opacity-0'
        }`}
        style={{
          width: '2px',
          background: 'linear-gradient(180deg, rgba(139, 92, 246, 0.6) 0%, rgba(139, 92, 246, 0.3) 50%, rgba(139, 92, 246, 0.1) 100%)',
          boxShadow: '0 0 10px rgba(139, 92, 246, 0.5)',
          transformOrigin: 'top center'
        }}
      >
        {/* Rope shine effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent animate-pulse"></div>
      </div>

      {/* 3D Card */}
      <div 
        className={`card-3d transition-all duration-[2000ms] ease-bounce ${
          isVisible ? 'translate-y-0 opacity-100 rotate-0' : '-translate-y-[400px] opacity-0 rotate-[180deg]'
        }`}
        style={{
          transform: isVisible ? 'translateY(0) rotateX(0deg)' : 'translateY(-400px) rotateX(180deg)',
          marginTop: '200px'
        }}
      >
        {/* Card Container with 3D effect */}
        <div className="relative preserve-3d group">
          {/* Glow effect */}
          <div className="absolute -inset-4 bg-gradient-to-r from-red-500/30 via-rose-500/30 to-pink-500/30 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
          
          {/* Card */}
          <div className="relative w-[280px] h-[380px] bg-gradient-to-br from-slate-900/90 via-red-900/80 to-rose-900/90 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-xl overflow-hidden transform-gpu hover:rotate-y-12 transition-all duration-700">
            
            {/* Animated background gradient */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-rose-500 to-pink-500 animate-gradient-shift"></div>
            </div>

            {/* Top decoration */}
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white/5 to-transparent"></div>
            
            {/* Content */}
            <div className="relative z-10 p-8 h-full flex flex-col">
              
              {/* Header with icon */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-500/50 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                  <Code className="w-8 h-8 text-white" />
                </div>
                <Sparkles className="w-6 h-6 text-rose-400 animate-pulse" />
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-red-300 group-hover:to-rose-300 transition-all duration-300">
                Full Stack
              </h3>
              <h4 className="text-xl font-semibold text-rose-300 mb-4">
                Developer
              </h4>

              {/* Description */}
              <p className="text-gray-300 text-sm leading-relaxed mb-6 flex-grow">
                Crafting innovative web experiences with modern technologies and creative solutions.
              </p>

              {/* Tech badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {['React', 'Node.js', 'Tailwind'].map((tech, idx) => (
                  <span 
                    key={tech}
                    className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs text-rose-200 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-110"
                    style={{
                      animation: `float ${2 + idx * 0.5}s ease-in-out infinite`,
                      animationDelay: `${idx * 0.2}s`
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Bottom action */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-lg shadow-green-400/50"></div>
                  <span className="text-xs text-gray-400">Available for work</span>
                </div>
                <Zap className="w-5 h-5 text-yellow-400 animate-bounce" />
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br from-rose-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
          </div>

          {/* Card shadow */}
          <div className="absolute inset-0 bg-black/50 blur-xl transform translate-y-8 scale-95 -z-10 opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .perspective-container {
          perspective: 1500px;
        }

        .card-3d {
          transform-style: preserve-3d;
        }

        .preserve-3d {
          transform-style: preserve-3d;
        }

        .rotate-y-12:hover {
          transform: rotateY(12deg) rotateX(-5deg);
        }

        .ease-bounce {
          transition-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        @keyframes gradient-shift {
          0%, 100% {
            transform: scale(1) rotate(0deg);
          }
          50% {
            transform: scale(1.1) rotate(5deg);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        .animate-gradient-shift {
          animation: gradient-shift 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default FloatingCard3D;
