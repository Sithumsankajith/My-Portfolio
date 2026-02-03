export function initInteractions() {
    initEasterEgg();
}

function initEasterEgg() {
    const code = "sithum";
    let input = "";

    document.addEventListener('keydown', (e) => {
        input += e.key.toLowerCase();
        if (input.length > code.length) {
            input = input.slice(-code.length);
        }

        if (input === code) {
            triggerGlitch();
        }
    });

    function triggerGlitch() {
        document.body.classList.add('glitch-active');
        setTimeout(() => {
            document.body.classList.remove('glitch-active');
        }, 1000); // 1s effect

        // Create confetti or particles
        createConfetti();
    }
}

function createConfetti() {
    // Simple burst
    for (let i = 0; i < 50; i++) {
        const el = document.createElement('div');
        el.className = 'confetti';
        el.style.left = '50%';
        el.style.top = '50%';
        el.style.backgroundColor = Math.random() > 0.5 ? '#00f2ff' : '#bd00ff';
        document.body.appendChild(el);

        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 100 + 50;

        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;

        el.animate([
            { transform: 'translate(0,0) scale(1)', opacity: 1 },
            { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
        ], {
            duration: 1000,
            easing: 'ease-out'
        }).onfinish = () => el.remove();
    }
}
