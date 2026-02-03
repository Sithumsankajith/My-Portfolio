export function initUI() {
    initCommandPalette();
    initModals();
    initThemeSwitch();
}

/* =======================
   Command Palette
   ======================= */
function initCommandPalette() {
    // Create Palette DOM
    const palette = document.createElement('div');
    palette.className = 'command-palette';
    palette.innerHTML = `
        <div class="palette-content glass-card">
            <input type="text" placeholder="Type a command..." id="cmd-input">
            <ul id="cmd-list">
                <li data-action="scroll" data-target="#home"><i class="fas fa-home"></i> Home</li>
                <li data-action="scroll" data-target="#projects"><i class="fas fa-folder-open"></i> Projects</li>
                <li data-action="scroll" data-target="#experience"><i class="fas fa-history"></i> Experience</li>
                <li data-action="scroll" data-target="#contact"><i class="fas fa-envelope"></i> Contact</li>
                <li data-action="link" data-url="/cv.pdf"><i class="fas fa-download"></i> Download CV</li>
                <li data-action="theme" data-theme="purple"><i class="fas fa-palette"></i> Theme: Purple</li>
                <li data-action="theme" data-theme="cyan"><i class="fas fa-palette"></i> Theme: Cyan</li>
            </ul>
        </div>
    `;
    document.body.appendChild(palette);

    let isOpen = false;

    // Toggle logic
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            togglePalette();
        }
        if (e.key === 'Escape' && isOpen) togglePalette();
    });

    function togglePalette() {
        isOpen = !isOpen;
        palette.classList.toggle('active', isOpen);
        if (isOpen) document.getElementById('cmd-input').focus();
    }

    // Action Logic
    palette.addEventListener('click', (e) => {
        const item = e.target.closest('li');
        if (!item) return;

        const action = item.dataset.action;
        if (action === 'scroll') {
            document.querySelector(item.dataset.target).scrollIntoView({ behavior: 'smooth' });
        } else if (action === 'link') {
            window.open(item.dataset.url, '_blank');
        } else if (action === 'theme') {
            setTheme(item.dataset.theme);
        }
        togglePalette();
    });

    // Simple Filter
    const input = document.getElementById('cmd-input');
    input.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const items = palette.querySelectorAll('li');
        items.forEach(li => {
            const text = li.textContent.toLowerCase();
            li.style.display = text.includes(term) ? 'flex' : 'none';
        });
    });
}

/* =======================
   Project Modals
   ======================= */
function initModals() {
    // Basic modal implementation for demo purposes
    // In a real app, this would populate dynamic data
    const modal = document.createElement('div');
    modal.className = 'project-modal';
    modal.innerHTML = `
        <div class="modal-content glass-card">
            <button class="close-modal">&times;</button>
            <h2 id="modal-title">Project Title</h2>
            <div class="modal-badges" id="modal-badges"></div>
            <p id="modal-desc">Project description goes here...</p>
            <div class="modal-links">
                <a href="#" id="modal-github" target="_blank" class="btn secondary"><i class="fab fa-github"></i> GitHub</a>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            // Extract data from card
            const title = card.querySelector('h3').textContent;
            const desc = card.querySelector('p').textContent;

            document.getElementById('modal-title').textContent = title;
            document.getElementById('modal-desc').textContent = desc + " This is an extended description showing the detailed impact of the project, technologies used, and challenges overcome during development.";

            modal.classList.add('active');
        });
    });

    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });
}

/* =======================
   Theme Switcher
   ======================= */
function initThemeSwitch() {
    // Handled via Command Palette for now to reduce UI clutter
}

function setTheme(theme) {
    const root = document.documentElement;
    if (theme === 'purple') {
        root.style.setProperty('--accent-cyan', '#bd00ff');
        root.style.setProperty('--accent-purple', '#00f2ff'); // Swap
    } else {
        root.style.setProperty('--accent-cyan', '#00f2ff');
        root.style.setProperty('--accent-purple', '#bd00ff');
    }
}
