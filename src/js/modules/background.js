export function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    let particles = [];
    const config = {
        particleCount: window.innerWidth < 768 ? 40 : 80,
        connectionDistance: 150,
        mouseRadius: 200,
        mouseForce: 0.05,
        baseSpeed: 0.5
    };

    let mouse = { x: -1000, y: -1000 };
    let clickPulse = { x: -1000, y: -1000, active: false, radius: 0 };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('click', (e) => {
        clickPulse.x = e.clientX;
        clickPulse.y = e.clientY;
        clickPulse.active = true;
        clickPulse.radius = 0;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * config.baseSpeed;
            this.vy = (Math.random() - 0.5) * config.baseSpeed;
            this.size = Math.random() * 2 + 1;
            this.baseColor = Math.random() > 0.8 ? '#bd00ff' : '#00f2ff'; // Occasional purple
            this.color = this.baseColor;
            this.originalX = this.x;
            this.originalY = this.y;
        }

        update() {
            // Base movement
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

            // Mouse Interaction (Gravity/Repulsion mix)
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < config.mouseRadius) {
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const force = (config.mouseRadius - distance) / config.mouseRadius;

                // Gentle attraction
                this.vx += forceDirectionX * force * config.mouseForce;
                this.vy += forceDirectionY * force * config.mouseForce;
            }

            // Pulse Effect
            if (clickPulse.active) {
                const pdx = this.x - clickPulse.x;
                const pdy = this.y - clickPulse.y;
                const pDist = Math.sqrt(pdx * pdx + pdy * pdy);

                if (Math.abs(pDist - clickPulse.radius) < 50) {
                    this.size = 5; // Flash size
                } else {
                    if (this.size > 2) this.size -= 0.1;
                }
            }

            // Speed limit
            const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            if (speed > 2) {
                this.vx = (this.vx / speed) * 2;
                this.vy = (this.vy / speed) * 2;
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        config.particleCount = window.innerWidth < 768 ? 40 : 80;
        init();
    }

    function init() {
        particles = [];
        for (let i = 0; i < config.particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Pulse logic
        if (clickPulse.active) {
            clickPulse.radius += 15;
            if (clickPulse.radius > Math.max(canvas.width, canvas.height)) {
                clickPulse.active = false;
            }
            // Draw pulse ring
            ctx.beginPath();
            ctx.arc(clickPulse.x, clickPulse.y, clickPulse.radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(0, 242, 255, ${1 - clickPulse.radius / 1000})`;
            ctx.stroke();
        }

        particles.forEach((p, index) => {
            p.update();
            p.draw();

            // Connections
            for (let j = index + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < config.connectionDistance) {
                    ctx.beginPath();
                    let opacity = 1 - distance / config.connectionDistance;

                    // Mouse proximity brightens lines
                    const mouseDist = Math.sqrt((p.x - mouse.x) ** 2 + (p.y - mouse.y) ** 2);
                    if (mouseDist < 150) opacity += 0.5;

                    ctx.strokeStyle = `rgba(0, 242, 255, ${opacity * 0.5})`; // Faint cyan
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        });

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    resize();
    animate();
}
