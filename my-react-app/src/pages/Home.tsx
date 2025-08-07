import { ArrowRightIcon, AcademicCapIcon, ChartBarIcon, UserIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { rudriDaveData } from '../data/rudri-dave';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { useRef, useEffect } from 'react';

export default function Home() {
  // For smooth scrolling setup
  useEffect(() => {
    const handleLinkClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        event.preventDefault();
        const targetId = target.getAttribute('href')?.substring(1);
        const targetElement = document.getElementById(targetId || '');
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop,
            behavior: 'smooth'
          });
        }
      }
    };

    document.addEventListener('click', handleLinkClick);
    return () => document.removeEventListener('click', handleLinkClick);
  }, []);

  // For parallax scrolling
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, -150]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);
  const y3 = useTransform(scrollY, [0, 2000], [0, -250]);
  const ySpring1 = useSpring(y1, { stiffness: 100, damping: 30 });
  const ySpring2 = useSpring(y2, { stiffness: 100, damping: 30 });
  const ySpring3 = useSpring(y3, { stiffness: 100, damping: 30 });
  
  // Section animation component
  const SectionWithAnimation = ({ children, className, id }: { children: React.ReactNode, className?: string, id?: string }) => {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: false, margin: "-20% 0px -20% 0px" });
    
    return (
      <motion.section 
        id={id}
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8 }}
        className={className}
      >
        {children}
      </motion.section>
    );
  };


  return (
    <motion.div 
      className="space-y-0"
      initial="initial"
      animate="animate">
      {/* Hero Section */}
      <SectionWithAnimation className="relative min-h-screen flex items-center justify-center overflow-hidden">
                 {/* Background with parallax effect */}
         <motion.div 
           style={{ y: ySpring1 }}
           className="absolute inset-0 bg-gradient-to-br from-primary-50 via-academic-50 to-primary-100 parallax-element">
           <motion.div 
             className="absolute inset-0 opacity-30">
             <motion.div 
               className="absolute inset-0 bg-academic-200"></motion.div>
           </motion.div>
         </motion.div>
        
        {/* Floating shapes with parallax */}
        <motion.div 
          style={{ y: ySpring2 }}
          className="absolute top-20 left-10 w-32 h-32 bg-primary-200 rounded-full opacity-20 animate-pulse parallax-element"></motion.div>
        <motion.div 
          style={{ y: ySpring3 }}
          className="absolute bottom-20 right-10 w-24 h-24 bg-academic-300 rounded-full opacity-20 animate-pulse delay-1000 parallax-element"></motion.div>
        <motion.div 
          style={{ y: ySpring1 }}
          className="absolute top-1/2 left-1/4 w-16 h-16 bg-primary-300 rounded-full opacity-20 animate-pulse delay-500 parallax-element"></motion.div>
        
        {/* Hero Content */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6 hover:bg-primary-200 hover:scale-105 transition-all duration-300">
              <AcademicCapIcon className="h-4 w-4" />
              Assistant Professor & PhD Researcher
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-5xl md:text-6xl lg:text-7xl font-serif font-semibold text-academic-900 leading-tight mb-8">
            <span className="bg-gradient-to-r from-primary-700 to-academic-800 text-transparent bg-clip-text">{rudriDaveData.name}</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-xl md:text-2xl text-academic-700 max-w-4xl mx-auto leading-relaxed mb-8">
            {rudriDaveData.title}
          </motion.p>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="text-lg md:text-xl text-academic-600 max-w-3xl mx-auto leading-relaxed mb-12">
            {rudriDaveData.bio}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/papers"
                className="btn-primary inline-flex items-center gap-x-2 text-lg px-8 py-4 group relative overflow-hidden"
              >
                <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
                <span className="relative">View Research</span>
                <ArrowRightIcon className="h-5 w-5 relative transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="#about"
                className="btn-secondary text-lg px-8 py-4 group relative overflow-hidden"
              >
                <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-primary-500 rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
                <span className="relative">Learn More</span>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
        
        {/* Scroll indicator */}
        <motion.div 
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-academic-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-academic-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </motion.div>
      </SectionWithAnimation>

      {/* About Section */}
      <SectionWithAnimation id="about" className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Profile Photo and Info */}
            <div className="space-y-8">
              <div className="text-center lg:text-left">
                <h2 className="text-4xl md:text-5xl font-serif font-semibold mb-6 relative inline-block">
                  <span className="bg-gradient-to-r from-primary-700 to-academic-800 text-transparent bg-clip-text">About {rudriDaveData.name}</span>
                  <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-gradient-to-r from-primary-500 to-transparent rounded-full"></span>
                </h2>
                <p className="text-lg text-academic-700 leading-relaxed mb-8">
                  {rudriDaveData.bio}
                </p>
                
                {/* Current Position */}
                <div className="bg-primary-50 border border-primary-200 rounded-xl p-6 mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <AcademicCapIcon className="h-6 w-6 text-primary-600" />
                    <h3 className="text-lg font-semibold text-academic-900">Current Position</h3>
                  </div>
                  <p className="text-academic-700">{rudriDaveData.currentPosition}</p>
                </div>
                
                {/* Education */}
                <div className="bg-academic-50 border border-academic-200 rounded-xl p-6 mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <ChartBarIcon className="h-6 w-6 text-academic-600" />
                    <h3 className="text-lg font-semibold text-academic-900">Education</h3>
                  </div>
                  <p className="text-academic-700">{rudriDaveData.education}</p>
                </div>
              </div>
            </div>
            
                         {/* Profile Photo */}
             <div className="relative">
               <div className="relative mx-auto lg:mx-0 w-80 h-80 lg:w-96 lg:h-96">
                                 {/* Profile photo with 3D effect */}
                <div className="relative group">
                  {/* 3D shadow layers */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-academic-800 rounded-full opacity-75 blur-lg group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                  <div className="absolute -inset-2 bg-gradient-to-r from-primary-400 via-academic-500 to-primary-700 rounded-full opacity-50 blur group-hover:opacity-70 transition duration-1000"></div>
                  
                  {/* Main image container with 3D effect */}
                  <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl border-4 border-white transform transition-all duration-500 group-hover:scale-105 group-hover:rotate-3 hover:shadow-academic-lg">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary-700/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                    <img 
                      src="/rudri-dave-profile.jpg" 
                      alt="Rudri Dave speaking at Ganpat University podium"
                      className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        // Fallback to placeholder if image fails to load
                        e.currentTarget.style.display = 'none';
                        (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
                      }}
                    />
                    {/* Fallback placeholder */}
                    <div className="w-full h-full bg-gradient-to-br from-primary-200 to-academic-200 rounded-full flex items-center justify-center" style={{display: 'none'}}>
                      <div className="text-center">
                        <UserIcon className="h-32 w-32 text-academic-600 mx-auto mb-4" />
                        <p className="text-academic-700 font-medium">Profile Photo</p>
                        <p className="text-sm text-academic-500">Rudri Dave</p>
                      </div>
                    </div>
                  </div>
                </div>
                 
                 {/* Floating elements */}
                 <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary-400 rounded-full opacity-60"></div>
                 <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-academic-400 rounded-full opacity-60"></div>
               </div>
             </div>
          </div>
        </div>
      </SectionWithAnimation>

      {/* Skills & Interests Section */}
      <SectionWithAnimation className="py-24 bg-academic-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-semibold mb-6 relative inline-block">
              <span className="bg-gradient-to-r from-primary-700 to-academic-800 text-transparent bg-clip-text">Expertise & Interests</span>
              <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-gradient-to-r from-primary-500 to-transparent rounded-full"></span>
            </h2>
            <p className="text-xl text-academic-700 max-w-3xl mx-auto">
              {rudriDaveData.vision}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Skills */}
            <div className="card">
              <h3 className="text-2xl font-serif font-semibold text-academic-900 mb-6">Skills & Expertise</h3>
              <div className="grid grid-cols-2 gap-4">
                {rudriDaveData.skills.map((skill, index) => (
                  <motion.div 
                    key={index} 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    whileHover={{ scale: 1.05, y: -4 }}
                    className="flex items-center gap-2 p-3 bg-academic-100 rounded-lg shadow-sm hover:bg-academic-200 hover:shadow-md"
                  >
                    <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                    <span className="text-academic-700 font-medium">{skill}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Interests */}
            <div className="card">
              <h3 className="text-2xl font-serif font-semibold text-academic-900 mb-6">Research Interests</h3>
              <div className="space-y-4">
                {rudriDaveData.interests.map((interest, index) => (
                  <motion.div 
                    key={index} 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    whileHover={{ scale: 1.05, y: -4 }}
                    className="flex items-center gap-3 p-3 bg-academic-100 rounded-lg shadow-sm hover:bg-academic-200 hover:shadow-md"
                  >
                    <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                    <span className="text-academic-700 font-medium">{interest}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </SectionWithAnimation>

      {/* Achievements Section */}
      <SectionWithAnimation className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-semibold mb-6 relative inline-block">
              <span className="bg-gradient-to-r from-primary-700 to-academic-800 text-transparent bg-clip-text">Achievements & Recognition</span>
              <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-gradient-to-r from-primary-500 to-transparent rounded-full"></span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {rudriDaveData.achievements.map((achievement, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                whileHover={{ y: -8, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 8px 10px -6px rgba(59, 130, 246, 0.1)" }}
                className="card text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-6 transform transition-all duration-300 group-hover:scale-110 shadow-md">
                  <AcademicCapIcon className="h-8 w-8 text-primary-600" />
                </div>
                <p className="text-academic-700 leading-relaxed">{achievement}</p>
                <div className="w-16 h-1 bg-gradient-to-r from-primary-300 to-transparent rounded-full mx-auto mt-4"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </SectionWithAnimation>

      {/* Contact Section */}
      <SectionWithAnimation className="py-24 bg-academic-50">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-semibold mb-8 relative inline-block">
            <span className="bg-gradient-to-r from-primary-700 to-academic-800 text-transparent bg-clip-text">Get in Touch</span>
            <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-gradient-to-r from-primary-500 to-transparent rounded-full"></span>
          </h2>
          <p className="text-xl text-academic-700 mb-12">
            Interested in collaboration or have questions about my research?
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={`mailto:${rudriDaveData.contact.email}`}
              className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4 group relative overflow-hidden"
            >
              <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
              <EnvelopeIcon className="h-5 w-5 relative transition-all duration-300 group-hover:scale-110" />
              <span className="relative">Send Email</span>
            </motion.a>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/papers"
                className="btn-secondary text-lg px-8 py-4 group relative overflow-hidden"
              >
                <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-primary-500 rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
                <span className="relative">View Research</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </SectionWithAnimation>

    </motion.div>
  );
} 