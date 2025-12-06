import React, { useState, useEffect, useCallback, memo } from "react"
import { Github, Linkedin, Mail, ExternalLink, Instagram, Sparkles } from "lucide-react"
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { supabase } from "../supabase"
import Lanyard from "../components/Lanyard"

// Memoized Components
const StatusBadge = memo(() => (
  <div className="inline-block animate-float lg:mx-0" data-aos="zoom-in" data-aos-delay="400">
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-rose-500 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
      <div className="relative px-3 sm:px-4 py-2 rounded-full bg-black/40 backdrop-blur-xl border border-white/10">
        <span className="bg-gradient-to-r from-red-400 to-rose-400 text-transparent bg-clip-text sm:text-sm text-[0.7rem] font-medium flex items-center">
          <Sparkles className="sm:w-4 sm:h-4 w-3 h-3 mr-2 text-red-400" />
          Ready to Innovate
        </span>
      </div>
    </div>
  </div>
));

const MainTitle = memo(({ title }) => {
  // Split title into words for better formatting - add space between words
  const words = title.split(' ');
  
  // Group words: first 1-2 words on first line, rest on second line
  const firstLine = words.slice(0, 2).join('  '); // double space
  const secondLine = words.slice(2).join('  '); // double space
  
  return (
    <div className="space-y-3" data-aos="fade-up" data-aos-delay="600">
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-bold leading-tight" style={{ letterSpacing: '0.05em' }}>
        {/* First Line */}
        <span className="relative inline-block">
          <span className="absolute -inset-2 bg-gradient-to-r from-red-500 to-rose-500 blur-2xl opacity-20"></span>
          <span className="relative bg-gradient-to-r from-white via-rose-100 to-rose-200 bg-clip-text text-transparent">
            {firstLine}
          </span>
        </span>
        
        {/* Second Line (if exists) */}
        {secondLine && (
          <>
            <br />
            <span className="relative inline-block mt-2">
              <span className="absolute -inset-2 bg-gradient-to-r from-red-500 to-rose-500 blur-2xl opacity-20"></span>
              <span className="relative bg-gradient-to-r from-red-400 to-rose-400 bg-clip-text text-transparent">
                {secondLine}
              </span>
            </span>
          </>
        )}
      </h1>
    </div>
  );
});

const TechStack = memo(({ tech }) => (
  <div className="px-4 py-2 hidden sm:block rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-sm text-gray-300 hover:bg-white/10 transition-colors">
    {tech}
  </div>
));

const CTAButton = memo(({ href, text, icon: Icon }) => (
  <a href={href}>
    <button className="group relative w-full sm:w-[160px]">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-rose-600 rounded-xl opacity-50 blur-md group-hover:opacity-90 transition-all duration-700"></div>
      <div className="relative h-11 bg-[#020617] backdrop-blur-xl rounded-lg border border-white/10 leading-none overflow-hidden">
        <div className="absolute inset-0 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 bg-gradient-to-r from-red-500/20 to-rose-500/20"></div>
        <span className="absolute inset-0 flex items-center justify-center gap-2 text-sm group-hover:gap-3 transition-all duration-300">
          <span className="bg-gradient-to-r from-gray-200 to-white bg-clip-text text-transparent font-medium z-10">
            {text}
          </span>
          <Icon className={`w-4 h-4 text-gray-200 ${text === 'Contact' ? 'group-hover:translate-x-1' : 'group-hover:rotate-45'} transform transition-all duration-300 z-10`} />
        </span>
      </div>
    </button>
  </a>
));

const SocialLink = memo(({ icon: Icon, link }) => (
  <a href={link} target="_blank" rel="noopener noreferrer">
    <button className="group relative p-3">
      <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-rose-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
      <div className="relative rounded-xl bg-black/50 backdrop-blur-xl p-2 flex items-center justify-center border border-white/10 group-hover:border-red-500/30 transition-all duration-300">
        <Icon className="w-5 h-5 text-gray-400 group-hover:text-red-400 transition-colors" />
      </div>
    </button>
  </a>
));

// Constants
const TYPING_SPEED = 100;
const ERASING_SPEED = 50;
const PAUSE_DURATION = 2000;

const Home = () => {
  const [text, setText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [wordIndex, setWordIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  
  // Profile data from database
  const [profileData, setProfileData] = useState({
    title: "Frontend Developer",
    subtitle: ["Web Developer", "Design", "Video & Photo Editing", "UI/UX Design"],
    tech_stack: ["React", "Javascript", "Node.js", "Tailwind"],
    social_links: [
      { icon: Github, link: "https://github.com/Fazrilukman" },
      { icon: Linkedin, link: "https://www.linkedin.com/in/fazrilukman/" },
      { icon: Instagram, link: "https://www.instagram.com/fazrilukman_/?hl=id" }
    ]
  });

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!supabase) return;
      
      try {
        const { data, error } = await supabase
          .from('profile_settings')
          .select('*')
          .single();

        if (data) {
          // Parse subtitle into array if it's a string
          let subtitleArray = ["Network & Telecom Student", "Tech Enthusiast"];
          if (data.subtitle) {
            // If subtitle contains separator, split it
            if (data.subtitle.includes('|')) {
              subtitleArray = data.subtitle.split('|').map(s => s.trim());
            } else {
              subtitleArray = [data.subtitle, "Tech Enthusiast"];
            }
          }

          setProfileData({
            title: data.title || "Frontend Developer",
            subtitle: subtitleArray,
            tech_stack: data.tech_stack || ["React", "Javascript", "Node.js", "Tailwind"],
            social_links: [
              { icon: Github, link: data.github_url || "https://github.com/Fazrilukman" },
              { icon: Linkedin, link: data.linkedin_url || "https://www.linkedin.com/in/fazrilukman/" },
              { icon: Instagram, link: data.instagram_url || "https://www.instagram.com/fazrilukman_/?hl=id" }
            ]
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  // Optimize AOS initialization
  useEffect(() => {
    const initAOS = () => {
      AOS.init({
        once: true,
        offset: 10,
       
      });
    };

    initAOS();
    window.addEventListener('resize', initAOS);
    return () => window.removeEventListener('resize', initAOS);
  }, []);

  useEffect(() => {
    setIsLoaded(true);
    return () => setIsLoaded(false);
  }, []);

  // Optimize typing effect
  const handleTyping = useCallback(() => {
    const WORDS = profileData.subtitle;
    if (isTyping) {
      if (charIndex < WORDS[wordIndex].length) {
        setText(prev => prev + WORDS[wordIndex][charIndex]);
        setCharIndex(prev => prev + 1);
      } else {
        setTimeout(() => setIsTyping(false), PAUSE_DURATION);
      }
    } else {
      if (charIndex > 0) {
        setText(prev => prev.slice(0, -1));
        setCharIndex(prev => prev - 1);
      } else {
        setWordIndex(prev => (prev + 1) % WORDS.length);
        setIsTyping(true);
      }
    }
  }, [charIndex, isTyping, wordIndex, profileData.subtitle]);

  useEffect(() => {
    const timeout = setTimeout(
      handleTyping,
      isTyping ? TYPING_SPEED : ERASING_SPEED
    );
    return () => clearTimeout(timeout);
  }, [handleTyping]);

  return (
    <div className="min-h-screen overflow-hidden px-[5%] sm:px-[5%] lg:px-[10%] pt-20 md:pt-16 lg:pt-12" id="Home">
      <div className={`relative z-10 transition-all duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
        <div className="container mx-auto  min-h-screen ">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-start md:justify-between gap-10 sm:gap-12 lg:gap-20 min-h-[85vh]">
            {/* Left Column */}
            <div className="w-full lg:w-1/2 space-y-6 sm:space-y-8 text-left lg:text-left order-1 lg:order-1 lg:mt-0"
              data-aos="fade-right"
              data-aos-delay="200">
              <div className="space-y-4 sm:space-y-6">
                <MainTitle title={profileData.title} />

                {/* Typing Effect */}
                <div className="h-8 flex items-center" data-aos="fade-up" data-aos-delay="800">
                  <span className="text-xl md:text-2xl bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent font-light">
                    {text}
                  </span>
                  <span className="w-[3px] h-6 bg-gradient-to-t from-[#dc2626] to-[#f43f5e] ml-1 animate-blink"></span>
                </div>

                {/* Description */}
                <p className="text-base md:text-lg text-gray-400 max-w-xl leading-relaxed font-light"
                  data-aos="fade-up"
                  data-aos-delay="1000">
                  A creative and multidisciplinary digital professional with a passion for transforming ideas into exceptional visual and functional experiences. I specialize in designing, building, and deploying intuitive, fast, and future-ready web applications, while also possessing strong expertise in UI/UX Design, Photo & Video Editing, and Graphic Design.
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-3 justify-start" data-aos="fade-up" data-aos-delay="1200">
                  {profileData.tech_stack.map((tech, index) => (
                    <TechStack key={index} tech={tech} />
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-start" data-aos="fade-up" data-aos-delay="1400">
                  <CTAButton href="#Portofolio" text="Projects" icon={ExternalLink} />
                  <CTAButton href="#Contact" text="Contact" icon={Mail} />
                </div>

                {/* Social Links */}
                <div className="flex flex-wrap gap-3 justify-start" data-aos="fade-up" data-aos-delay="1600">
                  {profileData.social_links.map((social, index) => (
                    <SocialLink key={index} icon={social.icon} link={social.link} />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Lanyard Card */}
            <div className="w-full max-w-[440px] lg:max-w-none mx-auto py-8 sm:py-10 lg:py-0 lg:w-1/2 h-auto lg:h-[600px] xl:h-[750px] relative flex items-center justify-center order-2 lg:order-2 mt-6 sm:mt-8 lg:mt-0"
              data-aos="fade-left"
              data-aos-delay="600">
              
              {/* Interactive Lanyard Card */}
              <Lanyard />
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Home);
