// ============================================================
// KHAIDAR SINAAN PORTFOLIO - PORTO.JS
// ============================================================

(() => {
    'use strict';

    // ========================================================
    // BASIC SETTINGS
    // ========================================================

    const reduceMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    ).matches;


    // ========================================================
    // CLICK SOUND
    // ========================================================

    const clickSound = document.getElementById('clickSound');

    let soundEnabled = true;

    try {
        const savedSound =
            localStorage.getItem('khaidar-sound-enabled');

        if (savedSound !== null) {
            soundEnabled = savedSound === 'true';
        }
    } catch (error) {
        // localStorage tidak tersedia
    }


    function playClickSound() {

        if (!clickSound) return;

        if (!soundEnabled) return;

        try {

            clickSound.currentTime = 0;

            const playPromise =
                clickSound.play();

            if (playPromise !== undefined) {

                playPromise.catch(() => {
                    // Browser dapat memblokir audio
                });

            }

        } catch (error) {
            // Abaikan error audio
        }

    }


    // ========================================================
    // SOUND ON / OFF BUTTON
    // ========================================================

    let soundToggleBtn =
        document.getElementById('soundToggleBtn');


    // Kalau tombol belum ada di HTML,
    // JS akan membuat tombolnya otomatis.
    if (!soundToggleBtn) {

        soundToggleBtn =
            document.createElement('button');

        soundToggleBtn.id =
            'soundToggleBtn';

        soundToggleBtn.type =
            'button';

        soundToggleBtn.className =
            'sound-toggle';

        soundToggleBtn.innerHTML =
            '<span class="sound-icon">🔊</span>';

        soundToggleBtn.setAttribute(
            'aria-label',
            'Matikan suara klik'
        );

        soundToggleBtn.setAttribute(
            'aria-pressed',
            'true'
        );

        soundToggleBtn.title =
            'On / Off suara klik';

        document.body.appendChild(
            soundToggleBtn
        );

    }


    function updateSoundButton() {

        if (!soundToggleBtn) return;

        const icon =
            soundToggleBtn.querySelector(
                '.sound-icon'
            );


        if (soundEnabled) {

            if (icon) {
                icon.textContent = '🔊';
            }

            soundToggleBtn.setAttribute(
                'aria-label',
                'Matikan suara klik'
            );

            soundToggleBtn.setAttribute(
                'aria-pressed',
                'true'
            );

            soundToggleBtn.classList.remove(
                'is-muted'
            );

        } else {

            if (icon) {
                icon.textContent = '🔇';
            }

            soundToggleBtn.setAttribute(
                'aria-label',
                'Aktifkan suara klik'
            );

            soundToggleBtn.setAttribute(
                'aria-pressed',
                'false'
            );

            soundToggleBtn.classList.add(
                'is-muted'
            );

        }

    }


    updateSoundButton();


    soundToggleBtn.addEventListener(
        'click',
        function () {

            soundEnabled =
                !soundEnabled;


            updateSoundButton();


            try {

                localStorage.setItem(
                    'khaidar-sound-enabled',
                    String(soundEnabled)
                );

            } catch (error) {
                // Abaikan error storage
            }


            // Kalau baru dinyalakan,
            // langsung tes suara.
            if (soundEnabled) {

                playClickSound();

            }

        }
    );


    // ========================================================
    // BUTTON / LINK CLICK SOUND
    // ========================================================

    document
        .querySelectorAll(
            'button:not(#soundToggleBtn), a.btn'
        )
        .forEach(function (element) {

            element.addEventListener(
                'click',
                function () {

                    playClickSound();

                }
            );

        });


    // ========================================================
    // IMPORTANT:
    // INSTAGRAM / WHATSAPP / EMAIL
    // ========================================================
    //
    // JS TIDAK MENGUBAH href link.
    // Jadi tombol Instagram tetap aman.
    //
    // Contoh HTML:
    //
    // <a href="https://instagram.com/username">
    // Instagram
    // </a>
    //
    // JS hanya memberi suara ketika tombol diklik.


    // ========================================================
    // SPOTLIGHT CARD EFFECT
    // ========================================================

    const cards =
        document.querySelectorAll(
            '.skill, .proj-card'
        );


    cards.forEach(function (card) {

        card.addEventListener(
            'mousemove',
            function (event) {

                const rect =
                    card.getBoundingClientRect();


                const x =
                    ((event.clientX - rect.left)
                        / rect.width) * 100;


                const y =
                    ((event.clientY - rect.top)
                        / rect.height) * 100;


                card.style.setProperty(
                    '--mx',
                    x + '%'
                );


                card.style.setProperty(
                    '--my',
                    y + '%'
                );

            }
        );

    });


    // ========================================================
    // SCROLL REVEAL
    // ========================================================

    const revealElements =
        document.querySelectorAll(
            '.reveal, .skill'
        );


    if (
        'IntersectionObserver' in window
    ) {

        const revealObserver =
            new IntersectionObserver(
                function (entries) {

                    entries.forEach(
                        function (entry) {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target.classList.add(
                                    'is-visible'
                                );


                                revealObserver.unobserve(
                                    entry.target
                                );

                            }

                        }
                    );

                },
                {
                    threshold: 0.18
                }
            );


        revealElements.forEach(
            function (element) {

                revealObserver.observe(
                    element
                );

            }
        );

    } else {

        revealElements.forEach(
            function (element) {

                element.classList.add(
                    'is-visible'
                );

            }
        );

    }


    // ========================================================
    // DOMAIN EXPANSION
    // ========================================================

    const domainBtn =
        document.getElementById(
            'domainBtn'
        );


    const contactPanel =
        document.getElementById(
            'contactPanel'
        );


    if (
        domainBtn &&
        contactPanel
    ) {

        domainBtn.addEventListener(
            'click',
            function (event) {

                const isOpen =
                    contactPanel.classList.toggle(
                        'open'
                    );


                domainBtn.setAttribute(
                    'aria-expanded',
                    String(isOpen)
                );


                if (isOpen) {

                    domainBtn.textContent =
                        'Close Domain';

                } else {

                    domainBtn.textContent =
                        'Activate Domain Expansion';

                }


                createRipple(
                    domainBtn,
                    event
                );


                if (isOpen) {

                    contactPanel.scrollIntoView({

                        behavior:
                            reduceMotion
                                ? 'auto'
                                : 'smooth',

                        block: 'nearest'

                    });

                }

            }
        );

    }


    // ========================================================
    // RIPPLE EFFECT
    // ========================================================

    function createRipple(
        button,
        event
    ) {

        if (!button) return;


        const rect =
            button.getBoundingClientRect();


        const ripple =
            document.createElement(
                'span'
            );


        ripple.className =
            'ripple';


        const size =
            Math.max(
                rect.width,
                rect.height
            ) * 1.4;


        ripple.style.width =
            size + 'px';


        ripple.style.height =
            size + 'px';


        let x =
            rect.width / 2;


        let y =
            rect.height / 2;


        if (event) {

            x =
                event.clientX -
                rect.left;

            y =
                event.clientY -
                rect.top;

        }


        ripple.style.left =
            (x - size / 2) + 'px';


        ripple.style.top =
            (y - size / 2) + 'px';


        button.appendChild(
            ripple
        );


        ripple.addEventListener(
            'animationend',
            function () {

                ripple.remove();

            }
        );

    }


    // ========================================================
    // MOBILE NAVIGATION
    // ========================================================

    const navToggle =
        document.getElementById(
            'navToggle'
        );


    const navLinks =
        document.getElementById(
            'navLinks'
        );


    if (
        navToggle &&
        navLinks
    ) {

        navToggle.addEventListener(
            'click',
            function () {

                const isOpen =
                    navLinks.classList.toggle(
                        'is-open'
                    );


                navToggle.classList.toggle(
                    'is-open',
                    isOpen
                );


                navToggle.setAttribute(
                    'aria-expanded',
                    String(isOpen)
                );

            }
        );


        // Tutup menu setelah memilih link
        navLinks
            .querySelectorAll('a')
            .forEach(function (link) {

                link.addEventListener(
                    'click',
                    function () {

                        navLinks.classList.remove(
                            'is-open'
                        );


                        navToggle.classList.remove(
                            'is-open'
                        );


                        navToggle.setAttribute(
                            'aria-expanded',
                            'false'
                        );

                    }
                );

            });

    }


    // ========================================================
    // SCROLL PROGRESS
    // ========================================================

    const curseFill =
        document.getElementById(
            'curseFill'
        );


    const toTopBtn =
        document.getElementById(
            'toTopBtn'
        );


    function updateScroll() {

        const scrollTop =
            window.scrollY;


        const documentHeight =
            document.body.scrollHeight;


        const windowHeight =
            window.innerHeight;


        const maxScroll =
            documentHeight -
            windowHeight;


        let percentage = 0;


        if (maxScroll > 0) {

            percentage =
                (scrollTop / maxScroll) *
                100;

        }


        if (curseFill) {

            curseFill.style.width =
                percentage + '%';

        }


        if (toTopBtn) {

            toTopBtn.classList.toggle(
                'is-visible',
                scrollTop > 500
            );

        }

    }


    window.addEventListener(
        'scroll',
        updateScroll,
        {
            passive: true
        }
    );


    updateScroll();


    // ========================================================
    // BACK TO TOP
    // ========================================================

    if (toTopBtn) {

        toTopBtn.addEventListener(
            'click',
            function () {

                window.scrollTo({

                    top: 0,

                    behavior:
                        reduceMotion
                            ? 'auto'
                            : 'smooth'

                });

            }
        );

    }


    // ========================================================
    // CURSED ENERGY PARTICLES
    // ========================================================

    const canvas =
        document.getElementById(
            'curse-canvas'
        );


    if (canvas) {

        const ctx =
            canvas.getContext('2d');


        let canvasWidth = 0;

        let canvasHeight = 0;


        let particles = [];


        let mouseX = -9999;

        let mouseY = -9999;


        // ----------------------------------------------------
        // RESIZE
        // ----------------------------------------------------

        function resizeCanvas() {

            canvasWidth =
                canvas.width =
                window.innerWidth;


            canvasHeight =
                canvas.height =
                document.body.scrollHeight;

        }


        resizeCanvas();


        window.addEventListener(
            'resize',
            resizeCanvas
        );


        // ----------------------------------------------------
        // MOUSE
        // ----------------------------------------------------

        window.addEventListener(
            'mousemove',
            function (event) {

                mouseX =
                    event.clientX;


                mouseY =
                    event.clientY +
                    window.scrollY;

            },
            {
                passive: true
            }
        );


        window.addEventListener(
            'mouseleave',
            function () {

                mouseX = -9999;

                mouseY = -9999;

            }
        );


        // ----------------------------------------------------
        // CREATE PARTICLE
        // ----------------------------------------------------

        function createParticle() {

            return {

                x:
                    Math.random() *
                    canvasWidth,


                y:
                    Math.random() *
                    canvasHeight,


                radius:
                    Math.random() *
                    1.6 +
                    0.4,


                vx:
                    (Math.random() - 0.5) *
                    0.15,


                vy:
                    -(Math.random() * 0.25 + 0.05),


                opacity:
                    Math.random() *
                    0.5 +
                    0.1,


                hue:
                    Math.random() > 0.75
                        ? '226,58,94'
                        : '139,107,255'

            };

        }


        // ----------------------------------------------------
        // PARTICLE COUNT
        // ----------------------------------------------------

        let particleCount;


        if (reduceMotion) {

            particleCount = 0;

        } else if (
            window.innerWidth <= 640
        ) {

            // Lebih ringan untuk HP
            particleCount = 55;

        } else {

            particleCount = 110;

        }


        for (
            let i = 0;
            i < particleCount;
            i++
        ) {

            particles.push(
                createParticle()
            );

        }


        // ----------------------------------------------------
        // ANIMATION
        // ----------------------------------------------------

        function animateParticles() {

            ctx.clearRect(
                0,
                0,
                canvasWidth,
                canvasHeight
            );


            const linkDistance = 120;


            // ------------------------------------------------
            // CONNECTION LINES
            // ------------------------------------------------

            for (
                let i = 0;
                i < particles.length;
                i++
            ) {

                const first =
                    particles[i];


                for (
                    let j = i + 1;
                    j < particles.length;
                    j++
                ) {

                    const second =
                        particles[j];


                    const dx =
                        first.x -
                        second.x;


                    const dy =
                        first.y -
                        second.y;


                    const distanceSquared =
                        dx * dx +
                        dy * dy;


                    if (
                        distanceSquared <
                        linkDistance *
                        linkDistance
                    ) {

                        const distance =
                            Math.sqrt(
                                distanceSquared
                            );


                        const opacity =
                            (
                                1 -
                                distance /
                                linkDistance
                            ) * 0.16;


                        ctx.strokeStyle =
                            `rgba(139,107,255,${opacity})`;


                        ctx.lineWidth = 1;


                        ctx.beginPath();


                        ctx.moveTo(
                            first.x,
                            first.y
                        );


                        ctx.lineTo(
                            second.x,
                            second.y
                        );


                        ctx.stroke();

                    }

                }

            }


            // ------------------------------------------------
            // PARTICLES
            // ------------------------------------------------

            particles.forEach(
                function (particle) {

                    // Mouse interaction

                    const dx =
                        particle.x -
                        mouseX;


                    const dy =
                        (
                            particle.y -
                            window.scrollY
                        ) -
                        (
                            mouseY -
                            window.scrollY
                        );


                    const distanceSquared =
                        dx * dx +
                        dy * dy;


                    const interactionRadius =
                        90;


                    if (
                        distanceSquared <
                        interactionRadius *
                        interactionRadius &&
                        distanceSquared >
                        0.01
                    ) {

                        const distance =
                            Math.sqrt(
                                distanceSquared
                            );


                        const force =
                            0.35 *
                            (
                                1 -
                                distance /
                                interactionRadius
                            );


                        particle.vx +=
                            (
                                dx /
                                distance
                            ) *
                            force *
                            0.12;


                        particle.vy +=
                            (
                                dy /
                                distance
                            ) *
                            force *
                            0.12;

                    }


                    // Movement

                    particle.x +=
                        particle.vx;


                    particle.y +=
                        particle.vy;


                    particle.vx *=
                        0.96;


                    particle.vy *=
                        0.96;


                    // Vertical wrap

                    if (
                        particle.y <
                        -10
                    ) {

                        particle.y =
                            canvasHeight +
                            10;


                        particle.x =
                            Math.random() *
                            canvasWidth;

                    }


                    if (
                        particle.y >
                        canvasHeight +
                        10
                    ) {

                        particle.y = -10;


                        particle.x =
                            Math.random() *
                            canvasWidth;

                    }


                    // Horizontal wrap

                    if (
                        particle.x <
                        -10
                    ) {

                        particle.x =
                            canvasWidth +
                            10;

                    }


                    if (
                        particle.x >
                        canvasWidth +
                        10
                    ) {

                        particle.x = -10;

                    }


                    // Draw

                    ctx.beginPath();


                    ctx.arc(

                        particle.x,

                        particle.y,

                        particle.radius,

                        0,

                        Math.PI * 2

                    );


                    ctx.fillStyle =
                        `rgba(${particle.hue},${particle.opacity})`;


                    ctx.shadowBlur = 6;


                    ctx.shadowColor =
                        `rgba(${particle.hue},0.6)`;


                    ctx.fill();

                }
            );


            ctx.shadowBlur = 0;


            if (!reduceMotion) {

                requestAnimationFrame(
                    animateParticles
                );

            }

        }


        animateParticles();

    }


})();
