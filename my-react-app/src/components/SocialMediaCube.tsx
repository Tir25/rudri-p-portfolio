import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SocialMediaCubeProps {
  className?: string;
}

const SocialMediaCube: React.FC<SocialMediaCubeProps> = ({ className = '' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const socialLinks = [
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/rudri.dave.338',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      color: '#1877F2'
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/rudri__dave?utm_source=ig_web_button_share_sheet&igsh=NjFxcDJ2bGlsYTM4',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.807-.875-1.297-2.026-1.297-3.323s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323z"/>
        </svg>
      ),
      color: '#E4405F'
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/rudri-dave-09091a183',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      color: '#0A66C2'
    }
  ];

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <motion.div
        className="relative"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Main Cube */}
        <motion.div
          className="relative w-16 h-16 cursor-pointer"
          animate={{
            rotateX: isExpanded ? 45 : 0,
            rotateY: isExpanded ? 45 : 0,
            scale: isHovered ? 1.1 : 1
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          style={{
            transformStyle: 'preserve-3d',
            perspective: '1000px'
          }}
        >
          {/* Cube Faces */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-academic-700 to-academic-800 rounded-lg shadow-2xl"
            style={{
              transform: 'translateZ(8px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}
            whileHover={{
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)'
            }}
          >
            <div className="flex items-center justify-center h-full">
              <motion.div
                className="text-white font-bold text-sm"
                animate={{
                  opacity: isExpanded ? 0 : 1,
                  scale: isExpanded ? 0.8 : 1
                }}
                transition={{ duration: 0.2 }}
              >
                {isExpanded ? '' : 'SOCIAL'}
              </motion.div>
            </div>
          </motion.div>

          {/* Top Face */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-academic-600 to-academic-700 rounded-lg"
            style={{
              transform: 'rotateX(90deg) translateZ(8px)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
            }}
          />

          {/* Right Face */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-academic-800 to-academic-900 rounded-lg"
            style={{
              transform: 'rotateY(90deg) translateZ(8px)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
            }}
          />

          {/* Left Face */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-academic-500 to-academic-600 rounded-lg"
            style={{
              transform: 'rotateY(-90deg) translateZ(8px)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
            }}
          />

          {/* Bottom Face */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-academic-900 to-academic-800 rounded-lg"
            style={{
              transform: 'rotateX(-90deg) translateZ(8px)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
            }}
          />

          {/* Back Face */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-academic-700 to-academic-800 rounded-lg"
            style={{
              transform: 'translateZ(-8px)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
            }}
          />
        </motion.div>

        {/* Expanded Social Icons */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute bottom-full right-0 mb-4 flex flex-col space-y-3"
            >
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative"
                  initial={{ opacity: 0, x: 20, scale: 0.5 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ 
                    duration: 0.3, 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 200
                  }}
                  whileHover={{ 
                    scale: 1.2, 
                    x: -5,
                    rotateY: 15
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Icon Container */}
                  <motion.div
                    className="relative w-12 h-12 rounded-lg shadow-lg flex items-center justify-center"
                    style={{
                      backgroundColor: social.color,
                      boxShadow: `0 4px 20px ${social.color}40`
                    }}
                    whileHover={{
                      boxShadow: `0 8px 30px ${social.color}60`,
                      y: -2
                    }}
                  >
                    {/* Icon */}
                    <div className="text-white">
                      {social.icon}
                    </div>
                    
                    {/* Glow Effect */}
                    <motion.div
                      className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: `radial-gradient(circle, ${social.color}40 0%, transparent 70%)`,
                        filter: 'blur(8px)',
                        transform: 'scale(1.5)'
                      }}
                    />
                  </motion.div>

                  {/* Tooltip */}
                  <motion.div
                    className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-academic-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap"
                    style={{
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                    }}
                  >
                    {social.name}
                    <div className="absolute top-1/2 left-full transform -translate-y-1/2 w-0 h-0 border-l-4 border-r-0 border-t-4 border-b-4 border-transparent border-l-academic-900"></div>
                  </motion.div>
                </motion.a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Click Indicator */}
        <motion.div
          className="absolute -top-2 -right-2 w-4 h-4 bg-academic-400 rounded-full"
          animate={{
            scale: isExpanded ? 0 : [1, 1.2, 1],
            opacity: isExpanded ? 0 : 1
          }}
          transition={{
            scale: {
              repeat: isExpanded ? 0 : Infinity,
              duration: 2
            }
          }}
        />
      </motion.div>
    </div>
  );
};

export default SocialMediaCube;
