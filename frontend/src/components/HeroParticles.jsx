import React from 'react';
import { motion } from 'framer-motion';
import './HeroParticles.css';

const particleVariants = {
  float: (i) => ({
    y: [0, -18 + (i % 3) * 6, 0],
    x: [0, 8 - (i % 4) * 4, 0],
    transition: {
      duration: 6 + (i % 5),
      repeat: Infinity,
      repeatType: 'mirror',
      ease: 'easeInOut',
      delay: i * 0.3,
    },
  }),
};

const particles = new Array(8).fill(0).map((_, i) => ({
  id: i,
  size: 8 + (i % 4) * 6,
  left: `${6 + (i * 11) % 80}%`,
  top: `${20 + (i * 7) % 60}%`,
  hue: 190 + (i % 4) * 10,
}));

const HeroParticles = () => {
  return (
    <div className="hero-particles" aria-hidden="true">
      {particles.map((p, i) => (
        <motion.div
          className="particle"
          key={p.id}
          custom={i}
          variants={particleVariants}
          animate="float"
          style={{
            width: p.size,
            height: p.size,
            left: p.left,
            top: p.top,
            background: `hsla(${p.hue}, 90%, 60%, 0.14)`,
            boxShadow: `0 6px 18px hsla(${p.hue}, 90%, 60%, 0.06)`,
          }}
        />
      ))}
    </div>
  );
};

export default HeroParticles;
