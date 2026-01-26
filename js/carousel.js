// Carrusel de Skills
class SkillsCarousel {
    constructor() {
        this.track = document.getElementById('carouselTrack');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.indicators = document.getElementById('carouselIndicators');
        this.items = Array.from(this.track.children);
        this.currentIndex = 0;
        this.itemsPerView = this.getItemsPerView();
        this.totalPages = Math.ceil(this.items.length / this.itemsPerView);
        
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
        this.updateCarousel();
        this.attachEventListeners();
        
        // Actualizar al redimensionar la ventana
        window.addEventListener('resize', () => {
            const newItemsPerView = this.getItemsPerView();
            if (newItemsPerView !== this.itemsPerView) {
                this.itemsPerView = newItemsPerView;
                this.totalPages = Math.ceil(this.items.length / this.itemsPerView);
                this.currentIndex = Math.min(this.currentIndex, this.totalPages - 1);
                this.createIndicators();
                this.updateCarousel();
            }
        });
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
                this.updateCarousel();
            });
            this.indicators.appendChild(indicator);
        }
    }

    attachEventListeners() {
        this.prevBtn.addEventListener('click', () => this.prev());
        this.nextBtn.addEventListener('click', () => this.next());

        // Soporte para teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
        });

        // Soporte para gestos táctiles
        let touchStartX = 0;
        let touchEndX = 0;

        this.track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        this.track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        });

        const handleSwipe = () => {
            if (touchEndX < touchStartX - 50) this.next();
            if (touchEndX > touchStartX + 50) this.prev();
        };

        this.handleSwipe = handleSwipe;
    }

    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateCarousel();
        }
    }

    next() {
        if (this.currentIndex < this.totalPages - 1) {
            this.currentIndex++;
            this.updateCarousel();
        }
    }

    updateCarousel() {
        // Establecer CSS variable para items por vista
        document.documentElement.style.setProperty('--items-per-view', this.itemsPerView);
        
        // Calcular el ancho de cada item incluyendo gap
        const gapSize = 20; // en px
        const wrapper = this.track.parentElement;
        const wrapperWidth = wrapper.offsetWidth - 40; // restando padding
        const itemWidth = (wrapperWidth - (gapSize * (this.itemsPerView - 1))) / this.itemsPerView;
        const totalGap = gapSize * (this.currentIndex * this.itemsPerView);
        
        // Calcular offset en píxeles
        const offset = -(this.currentIndex * this.itemsPerView * (itemWidth + gapSize));
        this.track.style.transform = `translateX(${offset}px)`;

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
            
            if (index >= startIndex && index < endIndex) {
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
            } else {
                item.style.opacity = '0.5';
                item.style.transform = 'scale(0.85)';
            }
        });
    }
}

// Inicializar el carrusel cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new SkillsCarousel();
});
