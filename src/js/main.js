import '../styles/main.css';
import { initParticles } from './modules/background.js';
import { initUI } from './modules/ui.js';
import { initCursor } from './modules/cursor.js';
import { initInteractions } from './modules/interactions.js';
import { initTheme } from './modules/theme.js';

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initUI();
    initCursor();
    initInteractions();
    initTheme();

    // Core logic kept inline for simplicity
    initTyping();
    initScrollAnimations();
    initTilt();
    initNavbar();
});

// ... Keep existing typing/scroll/tilt/navbar functions but optimize ...

/* =========================================
   2. Typing Effect
   ========================================= */
function initTyping() {
    const textElement = document.querySelector('.typing-text');
    const texts = ["AI & ML Enthusiast", "Community Leader", "Data Science Student"];
    let count = 0;
    let index = 0;
    let currentText = '';
    let letter = '';

    if (!textElement) return;

    (function type() {
        if (count === texts.length) {
            count = 0;
        }
        currentText = texts[count];
        letter = currentText.slice(0, ++index);

        textElement.textContent = letter;

        if (letter.length === currentText.length) {
            count++;
            index = 0;
            setTimeout(type, 2000);
        } else {
            setTimeout(type, 100);
        }
    })();
}

/* =========================================
   3. Scroll Animations
   ========================================= */
function initScrollAnimations() {
    const reveals = document.querySelectorAll('.section-title, .glass-card, .skill-card, .project-card, .timeline-item');

    // Config
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');

                // Timeline progress logic could go here
            }
        });
    }, { threshold: 0.1 });

    reveals.forEach(el => observer.observe(el));
}

/* =========================================
   4. Tilt Effect
   ========================================= */
function initTilt() {
    // Only desktop
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const cards = document.querySelectorAll('.project-card, .about-text'); // Added tilt to about card too

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;

            // Use CSS var for cleaner performance if moved to CSS, but inline is fine here
            if (card.querySelector('.project-content')) {
                card.querySelector('.project-content').style.transform =
                    `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            } else {
                card.style.transform =
                    `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            }
        });

        card.addEventListener('mouseleave', () => {
            if (card.querySelector('.project-content')) {
                card.querySelector('.project-content').style.transform =
                    `perspective(1000px) rotateX(0) rotateY(0)`;
            } else {
                card.style.transform = `perspective(1000px) rotateX(0) rotateY(0)`;
            }
        });
    });
}

/* =========================================
   5. Navbar
   ========================================= */
function initNavbar() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('toggle');
        });
    }

    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            if (hamburger) hamburger.classList.remove('toggle');
        });
    });

    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        navbar.classList.toggle('sticky', window.scrollY > 0);
    });
}
