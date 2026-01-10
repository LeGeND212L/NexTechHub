import React, { useEffect, useRef } from 'react';
import './HeroParticles.css';

const HeroParticles = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    let gridLines = [];
    let waves = [];

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initParticles();
      initGridLines();
      initWaves();
    };

    // Particle class
    class Particle {
      constructor() {
        this.reset();
        this.y = Math.random() * canvas.height;
        this.opacity = Math.random() * 0.5 + 0.3;
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = -10;
        this.size = Math.random() * 3 + 1;
        this.speedY = Math.random() * 1.2 + 0.6;
        this.speedX = (Math.random() - 0.5) * 0.8;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.hue = 200 + Math.random() * 20;
        this.pulseSpeed = Math.random() * 0.04 + 0.02;
        this.pulsePhase = Math.random() * Math.PI * 2;
      }

      update(time) {
        this.y += this.speedY;
        this.x += this.speedX;
        this.pulsePhase += this.pulseSpeed;
        
        // Drift effect
        this.x += Math.sin(time * 0.002 + this.pulsePhase) * 0.5;

        if (this.y > canvas.height + 10) {
          this.reset();
        }
        if (this.x < -10 || this.x > canvas.width + 10) {
          this.x = Math.random() * canvas.width;
        }
      }

      draw(time) {
        const pulse = Math.sin(this.pulsePhase) * 0.3 + 0.7;
        const glowSize = this.size * (2 + pulse);
        
        // Outer glow
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, glowSize * 3);
        gradient.addColorStop(0, `hsla(${this.hue}, 100%, 60%, ${this.opacity * pulse * 0.4})`);
        gradient.addColorStop(0.5, `hsla(${this.hue}, 100%, 50%, ${this.opacity * pulse * 0.1})`);
        gradient.addColorStop(1, `hsla(${this.hue}, 100%, 50%, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, glowSize * 3, 0, Math.PI * 2);
        ctx.fill();

        // Core particle
        ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, ${this.opacity * pulse})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * pulse, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Grid Line class
    class GridLine {
      constructor(isVertical, position) {
        this.isVertical = isVertical;
        this.position = position;
        this.opacity = Math.random() * 0.1 + 0.05;
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
        this.pulsePhase = Math.random() * Math.PI * 2;
      }

      update() {
        this.pulsePhase += this.pulseSpeed;
      }

      draw() {
        const pulse = Math.sin(this.pulsePhase) * 0.5 + 0.5;
        ctx.strokeStyle = `rgba(0, 150, 255, ${this.opacity * pulse})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        
        if (this.isVertical) {
          ctx.moveTo(this.position, 0);
          ctx.lineTo(this.position, canvas.height);
        } else {
          ctx.moveTo(0, this.position);
          ctx.lineTo(canvas.width, this.position);
        }
        
        ctx.stroke();
      }
    }

    // Wave class
    class Wave {
      constructor(index) {
        this.y = (canvas.height / 4) * index;
        this.amplitude = 30 + Math.random() * 20;
        this.frequency = 0.01 + Math.random() * 0.005;
        this.speed = 0.02 + Math.random() * 0.01;
        this.phase = Math.random() * Math.PI * 2;
        this.opacity = 0.1 + Math.random() * 0.1;
      }

      update() {
        this.phase += this.speed;
      }

      draw() {
        ctx.strokeStyle = `rgba(0, 120, 255, ${this.opacity})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        for (let x = 0; x < canvas.width; x += 5) {
          const y = this.y + Math.sin(x * this.frequency + this.phase) * this.amplitude;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.stroke();
      }
    }

    // Initialize particles
    const initParticles = () => {
      particles = [];
      const particleCount = Math.floor((canvas.width * canvas.height) / 15000);
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    // Initialize grid lines
    const initGridLines = () => {
      gridLines = [];
      const spacing = 80;
      
      for (let x = 0; x < canvas.width; x += spacing) {
        gridLines.push(new GridLine(true, x));
      }
      
      for (let y = 0; y < canvas.height; y += spacing) {
        gridLines.push(new GridLine(false, y));
      }
    };

    // Initialize waves
    const initWaves = () => {
      waves = [];
      for (let i = 0; i < 3; i++) {
        waves.push(new Wave(i));
      }
    };

    // Draw connections between nearby particles
    const drawConnections = () => {
      const maxDistance = 150;
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.15;
            ctx.strokeStyle = `rgba(0, 150, 255, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    // Animation loop
    const animate = (time) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw grid lines
      gridLines.forEach(line => {
        line.update();
        line.draw();
      });

      // Draw waves
      waves.forEach(wave => {
        wave.update();
        wave.draw();
      });

      // Draw connections
      drawConnections();

      // Draw particles
      particles.forEach(particle => {
        particle.update(time);
        particle.draw(time);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    // Initialize and start animation
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animate(0);

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="hero-particles-canvas" 
      aria-hidden="true"
    />
  );
};

export default HeroParticles;
