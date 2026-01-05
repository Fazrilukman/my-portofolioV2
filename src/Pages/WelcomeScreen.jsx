import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Github, Globe, User } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const TypewriterEffect = ({ text, speed = 260 }) => {
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    let index = 0;
    setDisplayText('');
    const timer = setInterval(() => {
      if (index <= text.length) {
        setDisplayText(text.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, speed);
    
    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <span className="inline-block">
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  );
};

const BackgroundEffect = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute inset-0 bg-[#140003]" />
    <div
      className="absolute inset-0 opacity-70"
      style={{ background: "radial-gradient(circle at top, rgba(239,68,68,0.25), transparent 60%)" }}
    />
    <div
      className="absolute inset-0 opacity-50"
      style={{ background: "radial-gradient(circle at bottom, rgba(244,63,94,0.2), transparent 60%)" }}
    />
    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(220,38,38,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(220,38,38,0.08)_1px,transparent_1px)] bg-[size:28px_28px] opacity-30" />
    <div className="absolute -top-24 left-1/2 h-48 w-72 -translate-x-1/2 rounded-full bg-rose-500/20 blur-3xl animate-pulse" />
    <div className="absolute -bottom-32 right-10 h-56 w-56 rounded-full bg-red-500/20 blur-3xl animate-float" />
  </div>
);

const IconButton = ({ Icon, label, delay }) => (
  <div className="relative group animate-float flex-shrink-0" style={{ animationDelay: delay }}>
    <div className="absolute -inset-1 bg-gradient-to-r from-red-600/30 to-rose-600/30 rounded-lg sm:rounded-xl blur opacity-0 group-hover:opacity-70 transition duration-300" />
    <div className="relative flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-[#0f0014]/70 border border-white/10 backdrop-blur-sm whitespace-nowrap">
      <span className="flex h-4 sm:h-5 w-4 sm:w-5 items-center justify-center rounded-full bg-rose-500/20 flex-shrink-0">
        <Icon className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-rose-200" />
      </span>
      <span className="text-[0.45rem] sm:text-[0.55rem] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-gray-300">{label}</span>
    </div>
  </div>
);

const WelcomeScreen = ({ onLoadingComplete }) => {
  const [isLoading, setIsLoading] = useState(true);
  const typewriterText = "www.fazrilukman.id";
  const typewriterSpeed = 120;
  const loadingDuration = Math.max(2000, typewriterText.length * typewriterSpeed + 800);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: false,
    });
  }, []);

  useEffect(() => {
    let completeTimer;
    const timer = setTimeout(() => {
      setIsLoading(false);
      completeTimer = setTimeout(() => {
        onLoadingComplete?.();
      }, 1000);
    }, loadingDuration);
    
    return () => {
      clearTimeout(timer);
      if (completeTimer) {
        clearTimeout(completeTimer);
      }
    };
  }, [loadingDuration, onLoadingComplete]);

  const containerVariants = {
    exit: {
      opacity: 0,
      scale: 1.1,
      filter: "blur(10px)",
      transition: {
        duration: 0.8,
        ease: "easeInOut",
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const childVariants = {
    exit: {
      y: -20,
      opacity: 0,
      transition: {
        duration: 0.4,
        ease: "easeInOut"
      }
    }
  };

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 bg-[#140003]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit="exit"
          variants={containerVariants}
        >
          <BackgroundEffect />
          
          <div className="relative min-h-screen flex items-center justify-center px-3 sm:px-4 py-6">
            <div className="w-full max-w-6xl mx-auto">
              <div className="relative rounded-2xl sm:rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl px-4 py-6 sm:px-8 sm:py-10 md:px-10 md:py-12 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-rose-500/10"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(244,63,94,0.16),transparent_60%)]"></div>
                <div className="absolute -left-1/3 top-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-40 animate-[shine_10s_ease-in-out_infinite]" />
                <div className="absolute -right-10 top-6 hidden lg:block text-[7rem] font-semibold tracking-[0.2em] text-white/5">
                  WELCOME
                </div>

                <div className="relative grid gap-6 sm:gap-8 md:gap-10 lg:grid-cols-[1.05fr_0.95fr] items-center">
                  <motion.div className="space-y-4 sm:space-y-6 md:space-y-8" variants={childVariants}>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 sm:px-3 py-1 text-[0.55rem] sm:text-[0.6rem] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-gray-300">
                        <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span>
                        System Ready
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 sm:px-3 py-1 text-[0.55rem] sm:text-[0.6rem] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-gray-300">
                        Portfolio 2025
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 sm:px-3 py-1 text-[0.55rem] sm:text-[0.6rem] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-gray-300">
                        UI Loading
                      </span>
                    </div>

                    <motion.div className="space-y-2 sm:space-y-3 md:space-y-4" variants={childVariants}>
                      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-semibold leading-tight">
                        <span className="block text-gray-200">Welcome to</span>
                        <span className="block bg-gradient-to-r from-white via-red-100 to-rose-200 bg-clip-text text-transparent">
                          my Portfolio
                        </span>
                        <span className="block text-white">Website</span>
                      </h1>
                      <p className="text-sm sm:text-base md:text-lg text-gray-400 max-w-xl">
                        Building modern, reliable, and fast digital experiences with a focus on clean UI and solid engineering.
                      </p>
                    </motion.div>

                    <motion.div className="flex items-center gap-3 sm:gap-4" variants={childVariants}>
                      <span className="text-[0.55rem] sm:text-[0.65rem] uppercase tracking-[0.3em] sm:tracking-[0.35em] text-gray-400">Live Status</span>
                      <div className="h-[2px] flex-1 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full w-2/3 bg-gradient-to-r from-red-500/80 to-rose-500/60 animate-pulse" />
                      </div>
                    </motion.div>

                    <motion.div className="flex gap-2 sm:gap-2.5 items-center" variants={childVariants}>
                      {[
                        { Icon: Code2, label: "Code" },
                        { Icon: User, label: "Profile" },
                        { Icon: Github, label: "Source" }
                      ].map((item, index) => (
                        <div key={item.label} data-aos="fade-down" data-aos-delay={index * 150} className="flex-shrink-0">
                          <IconButton Icon={item.Icon} label={item.label} delay={`${index * 0.6}s`} />
                        </div>
                      ))}
                    </motion.div>

                    <motion.div variants={childVariants} data-aos="fade-up" data-aos-delay="900">
                      <a
                        href="https://www.fazrilukman.id"
                        className="inline-flex items-center gap-2 sm:gap-3 rounded-full border border-white/10 bg-white/5 px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-xs sm:text-sm md:text-base text-gray-300 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02]"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="flex h-7 sm:h-9 w-7 sm:w-9 items-center justify-center rounded-full bg-red-500/20 text-red-300 flex-shrink-0">
                          <Globe className="w-3 sm:w-4 h-3 sm:h-4" />
                        </span>
                        <span className="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent text-sm sm:text-lg md:text-xl">
                          <TypewriterEffect text={typewriterText} speed={typewriterSpeed} />
                        </span>
                      </a>
                    </motion.div>
                  </motion.div>

                  <motion.div
                    className="relative h-64 sm:h-80 md:h-[340px] lg:h-[400px]"
                    variants={childVariants}
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="absolute inset-0 rounded-2xl sm:rounded-[28px] border border-white/10 bg-[#0c0010]/80 backdrop-blur-2xl overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(244,63,94,0.2),transparent_60%)]"></div>
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(220,38,38,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(220,38,38,0.08)_1px,transparent_1px)] bg-[size:24px_24px] opacity-30"></div>
                      <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -top-1/2 left-0 right-0 h-1/2 bg-gradient-to-b from-red-500/10 via-transparent to-transparent animate-scanline"></div>
                      </div>

                      <div className="absolute top-3 sm:top-5 left-4 sm:left-6 right-4 sm:right-6 flex items-center justify-between text-[0.55rem] sm:text-[0.6rem] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-gray-400">
                        <span>Core UI</span>
                        <span className="text-rose-200">online</span>
                      </div>

                      <div className="absolute inset-0 flex items-center justify-center px-2">
                        <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 lg:w-52 lg:h-52">
                          <div className="absolute inset-0 rounded-full border border-rose-500/40"></div>
                          <div className="absolute inset-6 rounded-full border border-white/10"></div>
                          <div className="absolute inset-10 rounded-full bg-gradient-to-br from-red-500/30 to-transparent animate-pulse"></div>

                          <motion.div
                            className="absolute inset-0"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                          >
                            <div className="absolute left-1/2 -top-3 sm:-top-4 -translate-x-1/2 rounded-full bg-black/50 border border-white/10 p-1.5 sm:p-2">
                              <Code2 className="w-3 sm:w-4 h-3 sm:h-4 text-rose-200" />
                            </div>
                            <div className="absolute -right-3 sm:-right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 border border-white/10 p-1.5 sm:p-2">
                              <User className="w-3 sm:w-4 h-3 sm:h-4 text-rose-200" />
                            </div>
                            <div className="absolute left-1/2 -bottom-3 sm:-bottom-4 -translate-x-1/2 rounded-full bg-black/50 border border-white/10 p-1.5 sm:p-2">
                              <Github className="w-3 sm:w-4 h-3 sm:h-4 text-rose-200" />
                            </div>
                            <div className="absolute -left-3 sm:-left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 border border-white/10 p-1.5 sm:p-2">
                              <Globe className="w-3 sm:w-4 h-3 sm:h-4 text-rose-200" />
                            </div>
                          </motion.div>

                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="rounded-full border border-rose-500/30 bg-[#140003]/80 px-3 sm:px-4 py-1 sm:py-2 text-[0.5rem] sm:text-[0.6rem] uppercase tracking-[0.3em] sm:tracking-[0.35em] text-rose-200">
                              Welcome
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="absolute left-4 sm:left-6 right-4 sm:right-6 bottom-4 sm:bottom-6 grid grid-cols-2 gap-2 sm:gap-3">
                        <div className="rounded-lg sm:rounded-2xl border border-white/10 bg-black/40 p-2 sm:p-3">
                          <p className="text-[0.5rem] sm:text-[0.6rem] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-gray-400">Modules</p>
                          <p className="mt-1 sm:mt-2 text-lg sm:text-xl text-white">06</p>
                          <p className="text-[0.65rem] sm:text-xs text-gray-400">Loaded</p>
                        </div>
                        <div className="rounded-lg sm:rounded-2xl border border-white/10 bg-black/40 p-2 sm:p-3">
                          <p className="text-[0.5rem] sm:text-[0.6rem] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-gray-400">Latency</p>
                          <p className="mt-1 sm:mt-2 text-lg sm:text-xl text-white">12ms</p>
                          <p className="text-[0.65rem] sm:text-xs text-gray-400">Stable</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeScreen;
