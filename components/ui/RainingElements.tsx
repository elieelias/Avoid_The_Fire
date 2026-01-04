'use client';

import React, { useEffect, useRef } from 'react';

const RainingElements: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const logoImageRef = useRef<HTMLImageElement | null>(null);

    useEffect(() => {
        // Preload image
        const img = new Image();
        img.src = '/fruishy_logo.jpg';
        logoImageRef.current = img;
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        // Particle types: 0 for logo, 1 for tree
        interface Particle {
            x: number;
            y: number;
            speed: number;
            type: 'logo' | 'tree';
            size: number;
            angle: number; // For slight rotation or sway
            swaySpeed: number;
        }

        const particles: Particle[] = [];
        const maxParticles = 40; // Total number of elements

        // Initialize particles
        for (let i = 0; i < maxParticles; i++) {
            // Randomly assign type (50/50 chance)
            const isLogo = Math.random() > 0.5;
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                speed: Math.random() * 0.5 + 0.2, // Very slow speed (0.2 to 0.7)
                type: isLogo ? 'logo' : 'tree',
                size: Math.random() * 15 + 15, // Size between 15px and 30px
                angle: Math.random() * Math.PI * 2,
                swaySpeed: Math.random() * 0.02 - 0.01,
            });
        }

        let animationFrameId: number;

        const draw = () => {
            ctx.clearRect(0, 0, width, height);

            particles.forEach((p) => {
                ctx.save();

                // Update position
                p.y += p.speed;
                p.angle += p.swaySpeed;
                p.x += Math.sin(p.angle) * 0.5; // Gentle sway

                // Wrap around
                if (p.y > height) {
                    p.y = -50;
                    p.x = Math.random() * width;
                }
                if (p.x > width + 50) p.x = -50;
                if (p.x < -50) p.x = width + 50;


                // Draw based on type
                if (p.type === 'logo' && logoImageRef.current) {
                    // Circular clipping for logo if desired, or just draw rect
                    // The user wanted "small", let's make them look nice.
                    // Circular clip to make the logo look cleaner if it's rectangular

                    // Standard draw
                    // ctx.drawImage(logoImageRef.current, p.x, p.y, p.size, p.size);

                    // Circular draw attempt for better aesthetics
                    ctx.beginPath();
                    ctx.arc(p.x + p.size / 2, p.y + p.size / 2, p.size / 2, 0, Math.PI * 2);
                    ctx.closePath();
                    // Clip is expensive, maybe just draw image. 
                    // Let's stick to simple drawImage first. If it looks blocky we can round it.
                    // Actually, "fruishy_logo.jpg" suggests it's a rectangle. 
                    // Let's assume it's fine to draw as is, but maybe a bit transparent?
                    ctx.globalAlpha = 0.8;
                    ctx.drawImage(logoImageRef.current, p.x, p.y, p.size, p.size);
                    ctx.globalAlpha = 1.0;

                } else {
                    // Christmas Tree Emoji
                    ctx.font = `${p.size}px serif`;
                    ctx.fillText('🎄', p.x, p.y + p.size); // Text draws from baseline
                }

                ctx.restore();
            });

            animationFrameId = requestAnimationFrame(draw);
        };

        let started = false;
        const startAnimation = () => {
            if (started) return;
            started = true;
            draw();
        };

        if (logoImageRef.current && logoImageRef.current.complete) {
            startAnimation();
        } else if (logoImageRef.current) {
            logoImageRef.current.onload = () => {
                startAnimation();
            }
            // Start anyway for the emojis if image takes time, 
            // but we need to match the logic. 
            // Actually, let's just start it. The image will appear when loaded.
            startAnimation();
        } else {
            startAnimation();
        }


        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 opacity-60" // Reduced opacity for background feel
        />
    );
};

export default RainingElements;
