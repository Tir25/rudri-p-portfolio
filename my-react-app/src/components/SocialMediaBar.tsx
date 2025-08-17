import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SocialMediaBarProps {
  className?: string;
}

const SocialMediaBar: React.FC<SocialMediaBarProps> = ({ className = '' }) => {
  const [isHovered, setIsHovered] = useState(false);

  const socialLinks = [
    {
      name: 'Facebook',
      url: 'https://facebook.com/rudridave',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com/rudridave',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.807-.875-1.297-2.026-1.297-3.323s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323z"/>
        </svg>
      )
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/rudridave',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    }
  ];

  return (
    <div className={`fixed bottom-0 left-0 w-full z-50 ${className}`}>
      <motion.div
        className="relative"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* 3D Bar Background */}
        <motion.div
          className="h-12 bg-gradient-to-r from-academic-800 via-academic-700 to-academic-800 shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #1e3a8a 100%)',
            boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            transform: 'perspective(1000px) rotateX(5deg)',
            transformOrigin: 'bottom'
          }}
        >
          {/* Content Container */}
          <div className="flex items-center justify-center h-full px-4">
            {/* Text Label */}
            <AnimatePresence mode="wait">
              {!isHovered && (
                <motion.div
                  key="text"
                  initial={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -50, scale: 0.8 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="text-white font-semibold text-base tracking-wider"
                >
                  SOCIAL MEDIA
                </motion.div>
              )}
            </AnimatePresence>

            {/* Social Icons */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  key="icons"
                  initial={{ opacity: 0, scale: 0.8, x: 50 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: 50 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="flex items-center space-x-6"
                >
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative"
                      initial={{ opacity: 0, y: 15, scale: 0.5 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ 
                        duration: 0.3, 
                        delay: index * 0.08,
                        type: "spring",
                        stiffness: 200
                      }}
                      whileHover={{ 
                        scale: 1.15, 
                        y: -3,
                        rotateY: 10
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {/* Icon Container with 3D Effect */}
                      <motion.div
                        className="relative p-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 shadow-lg"
                        style={{
                          boxShadow: '0 3px 12px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                          transform: 'perspective(1000px) rotateX(0deg)',
                        }}
                        whileHover={{
                          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                          transform: 'perspective(1000px) rotateX(-8deg) translateY(-1px)'
                        }}
                      >
                        {/* Icon */}
                        <div className="text-white group-hover:text-academic-200 transition-colors duration-300">
                          {social.icon}
                        </div>
                        
                        {/* Glow Effect */}
                        <motion.div
                          className="absolute inset-0 rounded-full bg-gradient-to-r from-academic-400/20 to-academic-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{
                            filter: 'blur(6px)',
                            transform: 'scale(1.1)'
                          }}
                        />
                      </motion.div>

                      {/* Tooltip */}
                      <motion.div
                        className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-academic-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap"
                        style={{
                          boxShadow: '0 3px 10px rgba(0, 0, 0, 0.3)'
                        }}
                      >
                        {social.name}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-3 border-r-3 border-t-3 border-transparent border-t-academic-900"></div>
                      </motion.div>
                    </motion.a>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 3D Bottom Edge */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-academic-900 via-academic-800 to-academic-900"
            style={{
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SocialMediaBar;
