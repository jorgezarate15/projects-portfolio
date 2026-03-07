// Carrusel de Skills
class SkillsCarousel {
    constructor() {
        this.container = document.querySelector('.carousel-container');
        this.track = document.getElementById('carouselTrack');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.indicators = document.getElementById('carouselIndicators');
        if (!this.track || !this.prevBtn || !this.nextBtn || !this.indicators || !this.container) {
            return;
        }
        this.items = Array.from(this.track.children);
        this.currentIndex = 0;
        this.itemsPerView = this.getItemsPerView();
        this.totalPages = Math.ceil(this.items.length / this.itemsPerView);
        this.frameId = null;
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        this.init();
    }

    getItemsPerView() {
        const width = window.innerWidth;
        if (width >= 1200) return 4;
        if (width >= 768) return 3;
        if (width >= 480) return 2;
        return 1;
    }

    init() {
        this.createIndicators();
        this.scheduleUpdate();
        this.attachEventListeners();
        
        // Actualizar al redimensionar la ventana
        window.addEventListener('resize', () => {
            const newItemsPerView = this.getItemsPerView();
            if (newItemsPerView !== this.itemsPerView) {
                this.itemsPerView = newItemsPerView;
                this.totalPages = Math.ceil(this.items.length / this.itemsPerView);
                this.currentIndex = Math.min(this.currentIndex, this.totalPages - 1);
                this.createIndicators();
                this.scheduleUpdate();
            }
        }, { passive: true });
    }

    createIndicators() {
        this.indicators.innerHTML = '';
        for (let i = 0; i < this.totalPages; i++) {
            const indicator = document.createElement('div');
            indicator.classList.add('indicator');
            if (i === this.currentIndex) {
                indicator.classList.add('active');
            }
            indicator.addEventListener('click', () => {
                this.currentIndex = i;
                this.scheduleUpdate();
            });
            this.indicators.appendChild(indicator);
        }
    }

    attachEventListeners() {
        this.prevBtn.addEventListener('click', () => this.prev());
        this.nextBtn.addEventListener('click', () => this.next());

        // Soporte para teclado
        document.addEventListener('keydown', (e) => {
            if (!this.canUseKeyboard()) return;
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.prev();
            }
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.next();
            }
        });

        // Soporte para gestos táctiles
        let touchStartX = 0;
        let touchEndX = 0;

        this.track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        this.track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        }, { passive: true });

        const handleSwipe = () => {
            if (touchEndX < touchStartX - 50) this.next();
            if (touchEndX > touchStartX + 50) this.prev();
        };

        this.handleSwipe = handleSwipe;
    }

    canUseKeyboard() {
        const activeElement = document.activeElement;
        return this.container.matches(':hover') || (activeElement && this.container.contains(activeElement));
    }

    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.scheduleUpdate();
        }
    }

    next() {
        if (this.currentIndex < this.totalPages - 1) {
            this.currentIndex++;
            this.scheduleUpdate();
        }
    }

    scheduleUpdate() {
        if (this.frameId !== null) {
            cancelAnimationFrame(this.frameId);
        }

        this.frameId = requestAnimationFrame(() => {
            this.updateCarousel();
            this.frameId = null;
        });
    }

    updateCarousel() {
        // Establecer CSS variable para items por vista
        document.documentElement.style.setProperty('--items-per-view', this.itemsPerView);
        
        // Calcular el ancho de cada item incluyendo gap
        const gapSize = 20; // en px
        const wrapper = this.track.parentElement;
        const wrapperWidth = wrapper.offsetWidth - 40; // restando padding
        const itemWidth = (wrapperWidth - (gapSize * (this.itemsPerView - 1))) / this.itemsPerView;
        
        // Calcular offset en píxeles
        const offset = -(this.currentIndex * this.itemsPerView * (itemWidth + gapSize));
        this.track.style.transform = `translate3d(${offset}px, 0, 0)`;

        // Actualizar indicadores
        const allIndicators = this.indicators.querySelectorAll('.indicator');
        allIndicators.forEach((ind, index) => {
            ind.classList.toggle('active', index === this.currentIndex);
        });

        // Actualizar estado de los botones
        this.prevBtn.disabled = this.currentIndex === 0;
        this.nextBtn.disabled = this.currentIndex === this.totalPages - 1;

        // Añadir animación a los items visibles
        this.items.forEach((item, index) => {
            const startIndex = this.currentIndex * this.itemsPerView;
            const endIndex = startIndex + this.itemsPerView;
            const visibleIndex = index - startIndex;
            const delay = this.prefersReducedMotion ? 0 : Math.max(0, visibleIndex) * 28;

            item.style.transition = this.prefersReducedMotion
                ? 'none'
                : `opacity var(--motion-normal) var(--ease-out-snappy) ${delay}ms, transform var(--motion-medium) var(--ease-out-fluid) ${delay}ms, filter var(--motion-normal) var(--ease-out-smooth) ${delay}ms`;
            
            if (index >= startIndex && index < endIndex) {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0) scale(1)';
                item.style.filter = 'blur(0)';
            } else {
                item.style.opacity = '0.68';
                item.style.transform = 'translateY(6px) scale(0.945)';
                item.style.filter = 'blur(1px)';
            }
        });
    }
}

// Inicializar el carrusel cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new SkillsCarousel();
});
