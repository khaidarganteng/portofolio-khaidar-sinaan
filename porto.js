const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// click sound — plays on any button or .btn link press
const clickSound = document.getElementById('clickSound');
let soundEnabled = true;
try {
    const saved = localStorage.getItem('khaidar-sound-enabled');
    if (saved !== null) soundEnabled = saved === 'true';
} catch (err) { /* localStorage unavailable, keep default */ }

function playClickSound() {
    if (!clickSound || !soundEnabled) return;
    clickSound.currentTime = 0;
    clickSound.play().catch(() => {});
}
document.querySelectorAll('button, a.btn').forEach(el => {
    if (el.id === 'soundToggleBtn') return; // handled separately below
    el.addEventListener('click', playClickSound);
});

// sound on/off toggle button
const soundToggleBtn = document.getElementById('soundToggleBtn');

function updateSoundToggleUI() {
    if (!soundToggleBtn) return;
    soundToggleBtn.classList.toggle('is-muted', !soundEnabled);
    soundToggleBtn.setAttribute('aria-pressed', soundEnabled);
    soundToggleBtn.setAttribute('aria-label', soundEnabled ? 'Matikan suara klik' : 'Aktifkan suara klik');
}
if (soundToggleBtn) {
    updateSoundToggleUI();
    soundToggleBtn.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        updateSoundToggleUI();
        try { localStorage.setItem('khaidar-sound-enabled', soundEnabled); } catch (err) { /* ignore */ }
        if (soundEnabled) playClickSound();
    });
}

// spotlight-follow effect on skill & project cards
document.querySelectorAll('.skill, .proj-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width * 100) + '%');
        card.style.setProperty('--my', ((e.clientY - rect.top) / rect.height * 100) + '%');
    });
});

// scroll reveal
const revealEls = document.querySelectorAll('.reveal, .skill');
const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
        }
    });
}, { threshold: 0.18 });
revealEls.forEach(el => io.observe(el));

// domain expansion toggle
const domainBtn = document.getElementById('domainBtn');
const contactPanel = document.getElementById('contactPanel');
domainBtn.addEventListener('click', (e) => {
    const open = contactPanel.classList.toggle('open');
    domainBtn.setAttribute('aria-expanded', open);
    domainBtn.textContent = open ? 'Close Domain' : 'Activate Domain Expansion';
    spawnRipple(domainBtn, e);
    if (open) contactPanel.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' });
});

function spawnRipple(btn, e) {
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const size = Math.max(rect.width, rect.height) * 1.4;
    ripple.style.width = ripple.style.height = size + 'px';
    const x = (e && e.clientX ? e.clientX - rect.left : rect.width / 2) - size / 2;
    const y = (e && e.clientY ? e.clientY - rect.top : rect.height / 2) - size / 2;
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
}

// mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', open);
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navLinks.classList.remove('is-open');
    navToggle.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', false);
}));

// curse meter (scroll progress) + back-to-top visibility
const curseFill = document.getElementById('curseFill');
const toTopBtn = document.getElementById('toTopBtn');

function onScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    curseFill.style.width = pct + '%';
    toTopBtn.classList.toggle('is-visible', scrollTop > 500);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

toTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
});

// cursed energy particle canvas
const canvas = document.getElementById('curse-canvas');
const ctx = canvas.getContext('2d');
let w, h, particles = [];
let mouseX = -9999,
    mouseY = -9999;

function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = document.body.scrollHeight;
}
window.addEventListener('resize', resize);
resize();

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY + window.scrollY;
}, { passive: true });
window.addEventListener('mouseleave', () => {
    mouseX = -9999;
    mouseY = -9999;
});

function makeParticle() {
    return {
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.6 + 0.4,
        vy: -(Math.random() * 0.25 + 0.05),
        vx: (Math.random() - 0.5) * 0.15,
        a: Math.random() * 0.5 + 0.1,
        hue: Math.random() > 0.75 ? '226,58,94' : '139,107,255'
    };
}

const COUNT = reduceMotion ? 0 : 110;
for (let i = 0; i < COUNT; i++) particles.push(makeParticle());

function tick() {
    ctx.clearRect(0, 0, w, h);

    // constellation lines between nearby particles
    const linkDist = 120;
    for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        if (a.fade) continue;
        for (let j = i + 1; j < particles.length; j++) {
            const b = particles[j];
            if (b.fade) continue;
            const dx = a.x - b.x,
                dy = a.y - b.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < linkDist * linkDist) {
                const alpha = (1 - Math.sqrt(d2) / linkDist) * 0.16;
                ctx.strokeStyle = `rgba(139,107,255,${alpha})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.stroke();
            }
        }
    }

    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // particles are gently repelled from the cursor
        const dx = p.x - mouseX;
        const dy = (p.y - window.scrollY) - (mouseY - window.scrollY);
        const distSq = dx * dx + dy * dy;
        const radius = 90;
        if (distSq < radius * radius && distSq > 0.01) {
            const dist = Math.sqrt(distSq);
            const force = 0.35 * (1 - dist / radius);
            p.vx += (dx / dist) * force * 0.12;
            p.vy += (dy / dist) * force * 0.12;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy *= 0.96;

        if (p.fade) {
            p.a -= 0.02;
            const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

            // click sound — plays on any button or .btn link press
            const clickSound = document.getElementById('clickSound');
            let soundEnabled = true;
            try {
                const saved = localStorage.getItem('khaidar-sound-enabled');
                if (saved !== null) soundEnabled = saved === 'true';
            } catch (err) { /* localStorage unavailable, keep default */ }

            function playClickSound() {
                if (!clickSound || !soundEnabled) return;
                clickSound.currentTime = 0;
                clickSound.play().catch(() => {});
            }
            document.querySelectorAll('button, a.btn').forEach(el => {
                if (el.id === 'soundToggleBtn') return; // handled separately below
                el.addEventListener('click', playClickSound);
            });

            // sound on/off toggle button
            const soundToggleBtn = document.getElementById('soundToggleBtn');

            function updateSoundToggleUI() {
                if (!soundToggleBtn) return;
                soundToggleBtn.classList.toggle('is-muted', !soundEnabled);
                soundToggleBtn.setAttribute('aria-pressed', soundEnabled);
                soundToggleBtn.setAttribute('aria-label', soundEnabled ? 'Matikan suara klik' : 'Aktifkan suara klik');
            }
            if (soundToggleBtn) {
                updateSoundToggleUI();
                soundToggleBtn.addEventListener('click', () => {
                    soundEnabled = !soundEnabled;
                    updateSoundToggleUI();
                    try { localStorage.setItem('khaidar-sound-enabled', soundEnabled); } catch (err) { /* ignore */ }
                    if (soundEnabled) playClickSound();
                });
            }

            // spotlight-follow effect on skill & project cards
            document.querySelectorAll('.skill, .proj-card').forEach(card => {
                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    card.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width * 100) + '%');
                    card.style.setProperty('--my', ((e.clientY - rect.top) / rect.height * 100) + '%');
                });
            });

            // scroll reveal
            const revealEls = document.querySelectorAll('.reveal, .skill');
            const io = new IntersectionObserver((entries) => {
                entries.forEach(e => {
                    if (e.isIntersecting) {
                        e.target.classList.add('is-visible');
                        io.unobserve(e.target);
                    }
                });
            }, { threshold: 0.18 });
            revealEls.forEach(el => io.observe(el));

            // domain expansion toggle
            const domainBtn = document.getElementById('domainBtn');
            const contactPanel = document.getElementById('contactPanel');
            domainBtn.addEventListener('click', (e) => {
                const open = contactPanel.classList.toggle('open');
                domainBtn.setAttribute('aria-expanded', open);
                domainBtn.textContent = open ? 'Close Domain' : 'Activate Domain Expansion';
                spawnRipple(domainBtn, e);
                if (open) contactPanel.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' });
            });

            function spawnRipple(btn, e) {
                const rect = btn.getBoundingClientRect();
                const ripple = document.createElement('span');
                ripple.className = 'ripple';
                const size = Math.max(rect.width, rect.height) * 1.4;
                ripple.style.width = ripple.style.height = size + 'px';
                const x = (e && e.clientX ? e.clientX - rect.left : rect.width / 2) - size / 2;
                const y = (e && e.clientY ? e.clientY - rect.top : rect.height / 2) - size / 2;
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                btn.appendChild(ripple);
                ripple.addEventListener('animationend', () => ripple.remove());
            }

            // mobile nav toggle
            const navToggle = document.getElementById('navToggle');
            const navLinks = document.getElementById('navLinks');
            navToggle.addEventListener('click', () => {
                const open = navLinks.classList.toggle('is-open');
                navToggle.classList.toggle('is-open', open);
                navToggle.setAttribute('aria-expanded', open);
            });
            navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
                navLinks.classList.remove('is-open');
                navToggle.classList.remove('is-open');
                navToggle.setAttribute('aria-expanded', false);
            }));

            // curse meter (scroll progress) + back-to-top visibility
            const curseFill = document.getElementById('curseFill');
            const toTopBtn = document.getElementById('toTopBtn');

            function onScroll() {
                const scrollTop = window.scrollY;
                const docHeight = document.body.scrollHeight - window.innerHeight;
                const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
                curseFill.style.width = pct + '%';
                toTopBtn.classList.toggle('is-visible', scrollTop > 500);
            }
            window.addEventListener('scroll', onScroll, { passive: true });
            onScroll();

            toTopBtn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
            });

            // cursed energy particle canvas
            const canvas = document.getElementById('curse-canvas');
            const ctx = canvas.getContext('2d');
            let w, h, particles = [];
            let mouseX = -9999,
                mouseY = -9999;

            function resize() {
                w = canvas.width = window.innerWidth;
                h = canvas.height = document.body.scrollHeight;
            }
            window.addEventListener('resize', resize);
            resize();

            window.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY + window.scrollY;
            }, { passive: true });
            window.addEventListener('mouseleave', () => {
                mouseX = -9999;
                mouseY = -9999;
            });

            function makeParticle() {
                return {
                    x: Math.random() * w,
                    y: Math.random() * h,
                    r: Math.random() * 1.6 + 0.4,
                    vy: -(Math.random() * 0.25 + 0.05),
                    vx: (Math.random() - 0.5) * 0.15,
                    a: Math.random() * 0.5 + 0.1,
                    hue: Math.random() > 0.75 ? '226,58,94' : '139,107,255'
                };
            }

            const COUNT = reduceMotion ? 0 : 110;
            for (let i = 0; i < COUNT; i++) particles.push(makeParticle());

            function tick() {
                ctx.clearRect(0, 0, w, h);

                // constellation lines between nearby particles
                const linkDist = 120;
                for (let i = 0; i < particles.length; i++) {
                    const a = particles[i];
                    if (a.fade) continue;
                    for (let j = i + 1; j < particles.length; j++) {
                        const b = particles[j];
                        if (b.fade) continue;
                        const dx = a.x - b.x,
                            dy = a.y - b.y;
                        const d2 = dx * dx + dy * dy;
                        if (d2 < linkDist * linkDist) {
                            const alpha = (1 - Math.sqrt(d2) / linkDist) * 0.16;
                            ctx.strokeStyle = `rgba(139,107,255,${alpha})`;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(a.x, a.y);
                            ctx.lineTo(b.x, b.y);
                            ctx.stroke();
                        }
                    }
                }

                for (let i = particles.length - 1; i >= 0; i--) {
                    const p = particles[i];

                    // particles are gently repelled from the cursor
                    const dx = p.x - mouseX;
                    const dy = (p.y - window.scrollY) - (mouseY - window.scrollY);
                    const distSq = dx * dx + dy * dy;
                    const radius = 90;
                    if (distSq < radius * radius && distSq > 0.01) {
                        const dist = Math.sqrt(distSq);
                        const force = 0.35 * (1 - dist / radius);
                        p.vx += (dx / dist) * force * 0.12;
                        p.vy += (dy / dist) * force * 0.12;
                    }

                    p.x += p.vx;
                    p.y += p.vy;
                    p.vx *= 0.96;
                    p.vy *= 0.96;

                    if (p.fade) {
                        p.a -= 0.02;
                        if (p.a <= 0) { particles.splice(i, 1); continue; }
                    } else {
                        if (p.y < -10) {
                            p.y = h + 10;
                            p.x = Math.random() * w;
                        }
                        if (p.y > h + 10) {
                            p.y = -10;
                            p.x = Math.random() * w;
                        }
                        if (p.x < -10) p.x = w + 10;
                        if (p.x > w + 10) p.x = -10;
                    }

                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${p.hue},${p.a})`;
                    ctx.shadowBlur = 6;
                    ctx.shadowColor = `rgba(${p.hue},0.6)`;
                    ctx.fill();
                }
                if (!reduceMotion) requestAnimationFrame(tick);
            }
            tick();
            if (p.a <= 0) { particles.splice(i, 1); continue; }
        } else {
            if (p.y < -10) {
                p.y = h + 10;
                p.x = Math.random() * w;
            }
            if (p.y > h + 10) {
                p.y = -10;
                p.x = Math.random() * w;
            }
            if (p.x < -10) p.x = w + 10;
            if (p.x > w + 10) p.x = -10;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.hue},${p.a})`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = `rgba(${p.hue},0.6)`;
        ctx.fill();
    }
    if (!reduceMotion) requestAnimationFrame(tick);
}
tick();