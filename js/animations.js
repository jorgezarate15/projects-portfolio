document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isSmallScreen = window.matchMedia('(max-width: 768px)').matches;
    const rootStyles = getComputedStyle(document.documentElement);
    const staggerFast = parseInt(rootStyles.getPropertyValue('--motion-stagger-fast'), 10) || 56;
    const staggerMedium = parseInt(rootStyles.getPropertyValue('--motion-stagger-medium'), 10) || 82;

    if (prefersReducedMotion) {
        return;
    }

    const targets = [];
    const delayScale = isSmallScreen ? 0.78 : 1;
    const maxDelay = isSmallScreen ? 360 : 560;
    const queuedTargets = [];
    let revealRaf = null;

    const queueReveal = (target) => {
        queuedTargets.push(target);
        if (revealRaf !== null) {
            return;
        }

        revealRaf = requestAnimationFrame(() => {
            queuedTargets.forEach((item) => item.classList.add('is-visible'));
            queuedTargets.length = 0;
            revealRaf = null;
        });
    };

    const addRevealGroup = (selector, config = {}) => {
        const {
            variant = 'reveal-soft',
            baseDelay = 0,
            step = 70,
        } = config;

        const elements = Array.from(document.querySelectorAll(selector));
        elements.forEach((element, index) => {
            element.classList.add('reveal', variant);

            const rawDelay = (baseDelay + (index * step)) * delayScale;
            const revealDelay = Math.min(maxDelay, Math.round(rawDelay));
            element.style.setProperty('--reveal-delay', `${revealDelay}ms`);

            targets.push(element);
        });
    };

    addRevealGroup('.header', { variant: 'reveal-fade', baseDelay: 12, step: 0 });
    addRevealGroup('#home .Foto-inicio', { variant: 'reveal-fade', baseDelay: 30, step: 0 });
    addRevealGroup('#home .Presentacion-Inicio', { variant: 'reveal-right', baseDelay: 86, step: 0 });
    addRevealGroup('#home .perfil', { variant: 'reveal-soft', baseDelay: 138, step: 0 });

    addRevealGroup('#about .about-main', { variant: 'reveal-left', baseDelay: 18, step: 0 });
    addRevealGroup('#about .about-side', { variant: 'reveal-right', baseDelay: 74, step: 0 });
    addRevealGroup('#about .about-stats .stat', { variant: 'reveal-soft', baseDelay: 124, step: staggerFast });

    addRevealGroup('#Skills .Habilidades h2', { variant: 'reveal-soft', baseDelay: 14, step: 0 });
    addRevealGroup('#Skills .carousel-container', { variant: 'reveal-soft', baseDelay: 64, step: 0 });
    addRevealGroup('#Skills .carousel-indicators', { variant: 'reveal-fade', baseDelay: 116, step: 0 });

    addRevealGroup('#projects .projects-header', { variant: 'reveal-soft', baseDelay: 20, step: 0 });
    addRevealGroup('#projects .project-card', { variant: 'reveal-soft', baseDelay: 52, step: staggerMedium });

    addRevealGroup('#contact .contact-card', { variant: 'reveal-soft', baseDelay: 22, step: 0 });
    addRevealGroup('#contact .contact-main', { variant: 'reveal-soft', baseDelay: 64, step: 0 });
    addRevealGroup('#contact .contact-side', { variant: 'reveal-right', baseDelay: 104, step: 0 });
    addRevealGroup('#contact .contact-link', { variant: 'reveal-soft', baseDelay: 132, step: staggerFast });
    addRevealGroup('#contact .contact-meta-item', { variant: 'reveal-fade', baseDelay: 150, step: staggerFast });

    addRevealGroup('.site-footer .footer-brand', { variant: 'reveal-soft', baseDelay: 26, step: 0 });
    addRevealGroup('.site-footer .footer-block', { variant: 'reveal-soft', baseDelay: 76, step: staggerFast });
    addRevealGroup('.site-footer .footer-bottom', { variant: 'reveal-fade', baseDelay: 128, step: 0 });

    if (targets.length === 0) {
        return;
    }

    const revealNow = [];
    const revealLater = [];

    targets.forEach((target) => {
        const rect = target.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.9) {
            revealNow.push(target);
        } else {
            revealLater.push(target);
        }
    });

    if (revealNow.length > 0) {
        requestAnimationFrame(() => {
            revealNow.forEach((target) => queueReveal(target));
        });
    }

    if (!('IntersectionObserver' in window)) {
        revealLater.forEach((target) => queueReveal(target));
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                queueReveal(entry.target);
                observer.unobserve(entry.target);
            });
        },
        {
            root: null,
            rootMargin: isSmallScreen ? '0px 0px -4% 0px' : '0px 0px -8% 0px',
            threshold: isSmallScreen ? 0.1 : 0.14,
        }
    );

    revealLater.forEach((target) => observer.observe(target));
});
