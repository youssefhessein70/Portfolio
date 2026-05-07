/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { 
  Mail, 
  MessageCircle,
  Facebook,
  ChevronRight,
  ChevronLeft,
  ArrowDown,
  X,
  Menu as MenuIcon
} from "lucide-react";
import { useState, useRef, Suspense, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial, Float } from "@react-three/drei";
import * as THREE from "three";

const PROJECTS = [
  {
    category: "Shopify",
    items: [
      { name: "Vie Pharmaceuticals", url: "https://viepharmaceuticals.com/", label: "Shopify Store" },
      { name: "Smart Clean Eg", url: "https://smartcleaneg.com/", label: "Shopify Store" },
      { name: "Bayan Cloud Kw", url: "https://bayancloudkw.com/", label: "Shopify Store" },
      { name: "Beais Watches", url: "https://beaiswatches.com/", label: "Shopify Store" },
    ]
  },
  {
    category: "Salla",
    items: [
      { name: "Symphony Perfume", url: "https://symphony-perfume.com/", label: "Salla Store" },
      { name: "Kafil", url: "https://kafil.org.sa/", label: "Salla Store" },
      { name: "Assaloon", url: "https://assaloon.com/ar", label: "Salla Store" },
      { name: "Bayan Cloud Sa", url: "https://bayancloud-sa.com/", label: "Salla Store" },
      { name: "Pandoz", url: "https://pandoz.sa/ar/", label: "Salla Store" },
      { name: "Almajd", url: "https://almajd.com.sa/", label: "Salla Store" },
      { name: "Asabaya", url: "https://asabaya.com/", label: "Salla Store" },
      { name: "Tactical", url: "https://tactical.sa/", label: "Salla Store" },
      { name: "Teeb Alwedad", url: "https://teebalwedad.com/", label: "Salla Store" },
      { name: "Eten Brand", url: "https://etenbrand.com/", label: "Salla Store" },
      { name: "Berghoff Sa", url: "https://berghoffsa.com/", label: "Salla Store" },
    ]
  },
  {
    category: "WordPress",
    items: [
      { name: "Nawar Microspine", url: "https://nawarmicrospine.com/", label: "WordPress Store" },
      { name: "Primeraxis", url: "https://primeraxis.com/", label: "WordPress Store" },
      { name: "Hamat Towers", url: "https://hamattowers.com/en/home-badge/", label: "WordPress Store" },
      { name: "Aglf", url: "https://aglf.sa/", label: "WordPress Store" },
    ]
  },
  {
    category: "Webflow",
    items: [
      { name: "The Pro English", url: "https://www.theproenglish.io/", label: "Webflow Site" },
      { name: "Pro Eng Preview", url: "https://pro-eng-cdb967081bb0b66c65c0b6ae42c8b39.webflow.io/", label: "Webflow Site" },
    ]
  }
];

const SKILLS = ["HTML", "CSS", "JavaScript", "React.js", "Next.js", "Node.js", "Express"];
const SPECIALIZATIONS = [
  { title: "Shopify", desc: "" },
  { title: "WordPress & Elementor", desc: "" },
  { title: "Salla & Webflow", desc: "" }
];

function AnimatedSphere() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.1;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <Sphere args={[1.5, 100, 200]} scale={1.2} ref={meshRef}>
        <MeshDistortMaterial
          color="#222"
          attach="material"
          distort={0.4}
          speed={3}
          wireframe
        />
      </Sphere>
    </Float>
  );
}

function ProjectCard({ project }: { project: any }) {
  const [metadata, setMetadata] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await fetch(`/api/metadata?url=${encodeURIComponent(project.url)}`);
        const data = await response.json();
        setMetadata(data);
      } catch (error) {
        console.error("Failed to fetch metadata", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMetadata();
  }, [project.url]);

  // Platform icons mapping
  const getPlatformIcon = (label: string) => {
    if (label.includes("Shopify")) return "https://cdn.worldvectorlogo.com/logos/shopify.svg";
    if (label.includes("Wordpress") || label.includes("WordPress") || label.includes("ووردبريس")) return "https://s.w.org/style/images/about/WordPress-logotype-wmark.png";
    if (label.includes("Salla") || label.includes("سلة")) return "https://salla.sa/assets/images/logo-green.svg";
    if (label.includes("Webflow")) return "https://cdn.worldvectorlogo.com/logos/webflow.svg";
    return null;
  };

  const platformIcon = getPlatformIcon(project.label);
  const initials = project.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <motion.a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex-shrink-0 w-[300px] md:w-[450px] snap-start group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="relative aspect-[16/10] mb-6 overflow-hidden rounded-xl bg-[#0a0a0a] border border-white/5 group-hover:border-white/20 transition-all duration-500">
        {(loading || !imageLoaded) && !imageError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900">
            <div className="text-6xl font-bold text-white/[0.03] absolute select-none tracking-tighter">{initials}</div>
            <div className="w-6 h-6 border-2 border-white/5 border-t-white/20 rounded-full animate-spin" />
          </div>
        )}
        
        {!imageError ? (
          <img 
            src={metadata?.image || `https://s0.wp.com/mshots/v1/${encodeURIComponent(project.url)}?w=1280`} 
            alt={project.name}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover transition-all duration-1000 group-hover:scale-105 ${imageLoaded ? 'opacity-80 group-hover:opacity-100' : 'opacity-0'}`}
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-neutral-900 to-black">
             <div className="text-8xl font-bold text-white/[0.03] uppercase select-none tracking-tighter">{initials}</div>
          </div>
        )}
        
        {/* Overlay Label */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
           <p className="text-white text-xs font-bold tracking-[0.2em] uppercase mb-2">Launch Store</p>
           <div className="h-[1px] w-12 bg-white origin-left group-hover:scale-x-100 scale-x-0 transition-transform duration-500" />
        </div>

        {/* Platform Badge */}
        {platformIcon && (
          <div className="absolute top-4 right-4 w-8 h-8 bg-black/50 backdrop-blur-md rounded-lg p-1.5 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
            <img src={platformIcon} alt="Platform" className="w-full h-full object-contain invert" />
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-xl font-bold mb-1 group-hover:text-gray-300 transition-colors tracking-tight">{project.name}</h4>
          <p className="text-[10px] text-white/30 font-bold tracking-[0.3em] uppercase">{project.label}</p>
        </div>
        <div className="p-2.5 border border-white/10 rounded-full group-hover:bg-white group-hover:text-black transition-all rotate-[-45deg] group-hover:rotate-0">
          <ChevronRight size={16} />
        </div>
      </div>
    </motion.a>
  );
}

function ProjectCarousel({ category, items }: { category: string; items: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 500;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div id={category.toLowerCase()} className="py-16 md:py-24 border-t border-white/5">
      <div className="flex justify-between items-center mb-16">
        <h3 className="text-4xl font-bold tracking-tight text-white/80">
          {category}
        </h3>
        <div className="flex gap-4">
          <button 
            onClick={() => scroll('left')}
            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all cursor-pointer"
          >
            <ChevronLeft size={16} />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all cursor-pointer"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex gap-10 overflow-x-auto hide-scrollbar snap-x scroll-px-0 custom-scrollbar pb-12"
      >
        {items.map((project, idx) => (
          <ProjectCard key={idx} project={project} />
        ))}
      </div>
    </div>
  );
}

function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: 'Home', href: '#hero' },
    { label: 'Shopify', href: '#shopify' },
    { label: 'Salla', href: '#salla' },
    { label: 'WordPress', href: '#wordpress' },
    { label: 'Webflow', href: '#webflow' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <nav className="fixed top-0 w-full z-50 px-6 py-6 md:px-10 md:py-10 flex justify-between items-center mix-blend-difference">
        <a href="#hero" className="text-lg font-bold tracking-tighter text-white">Youssef Hussein.</a>
        <button 
          onClick={() => setIsOpen(true)}
          className="text-xs font-bold tracking-[0.4em] uppercase text-white hover:text-white/60 transition-colors cursor-pointer"
        >
          MENU
        </button>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[60] bg-black text-white p-10 md:p-20 flex flex-col justify-between"
          >
             <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold tracking-[0.4em] uppercase opacity-40">Categories</span>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-4 rounded-full border border-white/10 hover:bg-white hover:text-black transition-all"
                >
                  <X size={20} />
                </button>
             </div>

             <div className="flex flex-col gap-2 md:gap-4">
                {menuItems.map((item) => (
                  <a 
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="text-4xl md:text-[5vw] font-medium tracking-tight hover:opacity-40 transition-opacity"
                  >
                    {item.label}
                  </a>
                ))}
             </div>

             <div className="flex justify-between items-end border-t border-white/5 pt-10">
                <div className="text-[10px] font-bold tracking-[0.4em] uppercase opacity-40">Connect</div>
                <div className="flex flex-wrap justify-end gap-6 md:gap-12 text-[10px] font-bold tracking-[0.4em] uppercase">
                   <a href="https://www.facebook.com/share/1GqRSFGTgk/" className="hover:opacity-40 whitespace-nowrap">Facebook</a>
                   <a href="https://wa.me/201023018543" className="hover:opacity-40 whitespace-nowrap">WhatsApp</a>
                   <a href="mailto:youssefhessein70@gmail.com" className="hover:opacity-40 whitespace-nowrap">Email</a>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function App() {
  const { scrollYProgress } = useScroll();
  const sphereScale = useTransform(scrollYProgress, [0, 0.2], [1.2, 0.6]);
  const sphereOpacity = useTransform(scrollYProgress, [0, 0.3], [0.8, 0]);

  return (
    <div className="bg-black text-white selection:bg-white selection:text-black min-h-screen overflow-x-hidden">
      <Nav />

      {/* Main Content */}
      <main className="px-6 md:px-10 max-w-7xl mx-auto">
        {/* Hero */}
        <section id="hero" className="relative h-screen flex flex-col items-center justify-center">
          <motion.div 
            style={{ scale: sphereScale, opacity: sphereOpacity }}
            className="absolute inset-0 z-0 pointer-events-none"
          >
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
              <Suspense fallback={null}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <AnimatedSphere />
              </Suspense>
            </Canvas>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="z-10 text-center"
          >
            <h1 className="text-7xl md:text-[10vw] font-bold tracking-tight leading-[0.8] mb-8">
              Youssef Hussein
            </h1>
            <p className="text-lg md:text-2xl text-white/40 tracking-tight font-medium max-w-xl mx-auto uppercase tracking-[0.4em]">
              Front-End Developer
            </p>
          </motion.div>

          <motion.div 
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-12 flex flex-col items-center gap-4 text-white/20"
          >
             <ArrowDown size={24} />
          </motion.div>
        </section>

        {/* Work Section */}
        <section id="work" className="py-32 md:py-60">
          <header className="mb-20 md:mb-32">
             <h2 className="text-xs font-bold tracking-[0.6em] uppercase mb-8 text-white/30">LATEST WORK</h2>
             <p className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl leading-[1.1]">
                Helping businesses build scalable, high-converting digital storefronts.
             </p>
          </header>
          
          <div className="space-y-40">
            {PROJECTS.map((category) => (
              <ProjectCarousel key={category.category} {...category} />
            ))}
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-32 md:py-60 border-t border-white/5">
          <div className="grid lg:grid-cols-[1fr_2fr] gap-16 lg:gap-32">
            <div>
               <h2 className="text-xs font-bold tracking-[0.6em] uppercase text-white/30 sticky top-40">ABOUT ME</h2>
            </div>
            
            <div className="space-y-40">
              <p className="text-3xl md:text-5xl font-medium leading-[1.2] tracking-tight">
                I’m a Front-End Developer with 3+ years of experience specialize in <span className="text-white/40">Shopify, Salla, WordPress, and Webflow</span>. I focus on bridging the gap between design and functionality to deliver seamless user experiences.
              </p>

              <div className="grid md:grid-cols-2 gap-20">
                <div className="space-y-10">
                  <h3 className="text-xs font-bold tracking-widest uppercase text-white/20">Specialization</h3>
                  <div className="space-y-8">
                    {SPECIALIZATIONS.map((spec) => (
                      <div key={spec.title} className="group">
                        <p className="text-xl font-bold mb-2 group-hover:text-white/60 transition-colors">{spec.title}</p>
                        <p className="text-sm text-white/40 font-medium">{spec.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-10">
                  <h3 className="text-xs font-bold tracking-widest uppercase text-white/20">Technical Stack</h3>
                  <div className="flex flex-wrap gap-3">
                    {SKILLS.map((skill) => (
                      <span key={skill} className="px-5 py-2.5 rounded-full border border-white/10 text-xs font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-all cursor-default">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-32 md:py-60 border-t border-white/5">
          <div className="mb-20">
            <h2 className="text-xs font-bold tracking-[0.6em] uppercase mb-12 md:mb-24 text-white/30">GET IN TOUCH</h2>
            <div className="flex flex-col">
              {[
                { label: 'Email', href: 'mailto:youssefhessein70@gmail.com' },
                { label: 'Facebook', href: 'https://www.facebook.com/share/1GqRSFGTgk/' },
                { label: 'WhatsApp', href: 'https://wa.me/201023018543' }
              ].map((link, idx) => (
                <motion.a 
                  key={link.label}
                  whileHover={{ x: 30 }}
                  href={link.href} 
                  target="_blank"
                  className="py-10 border-b border-white/5 text-6xl md:text-[10vw] font-bold tracking-tighter hover:text-white/40 transition-colors block group flex justify-between items-center"
                >
                  {link.label}
                  <ChevronRight size={60} className="hidden md:block opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="px-6 md:px-10 py-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
        <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/20">
          © {new Date().getFullYear()} Youssef Hussein. Design matters.
        </p>
        <div className="flex gap-12 text-[10px] font-bold tracking-[0.4em] uppercase text-white/20">
           <a href="#" className="hover:text-white transition-colors">Privacy</a>
           <a href="#" className="hover:text-white transition-colors">Terms</a>
        </div>
      </footer>
    </div>
  );
}

