document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header');
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('mainNav');

    if (!header || !menuToggle || !nav) return;

    const closeMenu = () => {
        header.classList.remove('menu-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir menú');
    };

    const toggleMenu = () => {
        const isOpen = header.classList.toggle('menu-open');
        menuToggle.setAttribute('aria-expanded', String(isOpen));
        menuToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
    };

    const navLinks = Array.from(nav.querySelectorAll('a[href^="#"]'));
    const sectionEntries = navLinks
        .map((link) => {
            const target = document.querySelector(link.getAttribute('href'));
            return target ? { link, target } : null;
        })
        .filter(Boolean);

    const setCurrentLink = (id) => {
        sectionEntries.forEach(({ link, target }) => {
            if (`#${target.id}` === id) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    };

    menuToggle.addEventListener('click', toggleMenu);

    nav.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeMenu);
    });

    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            const href = link.getAttribute('href');
            if (href) {
                setCurrentLink(href);
            }
        });
    });

    if (sectionEntries.length > 0) {
        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

                if (visible.length > 0) {
                    setCurrentLink(`#${visible[0].target.id}`);
                }
            },
            {
                root: null,
                rootMargin: '-35% 0px -55% 0px',
                threshold: [0.2, 0.35, 0.5, 0.75],
            }
        );

        sectionEntries.forEach(({ target }) => observer.observe(target));

        if (window.location.hash) {
            setCurrentLink(window.location.hash);
        } else {
            setCurrentLink(`#${sectionEntries[0].target.id}`);
        }
    }

    document.addEventListener('click', (event) => {
        if (window.innerWidth > 900) return;
        if (!header.contains(event.target)) {
            closeMenu();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 900) {
            closeMenu();
        }
    });
});
