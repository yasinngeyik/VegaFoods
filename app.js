async function loadProducts() {
    try {
        const { products } = await (await fetch("/product.json")).json();
        const productsContainer = document.querySelector("#products-container");
        const productsToShow = products.slice(0, products.length - 7);

        const productHTML = productsToShow.map(product => `
            <div class="product-card rounded-lg shadow-sm :shadow-md">
                ${product.discountedPrice ? `
                    <span class="top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                        SALE!
                    </span>
                ` : ''}
                <img src="${product.image}" 
                     alt="${product.name}" 
                     class="product-image w-full h-48 object-cover">
                
                <div class="icons-container top-4 right-4 flex flex-row gap-2">
                    <button class="icon-button w-8 h-8 rounded-full flex items-center justify-center shadow-md">

             <i class="fa-solid fa-bars"></i>
                    </button>
                    <button class="icon-button w-8 h-8 rounded-full flex items-center justify-center shadow-md">
                     <i class="fa-solid fa-cart-shopping"></i>
                    </button>
                    <button class="icon-button w-8 h-8 rounded-full flex items-center justify-center shadow-md">
            <i class="fa-solid fa-heart"></i>
                    </button>
                </div>

                <div class="p-4">
                    <h3 class="text-lg font-semibold text-gray-800 mb-2">${product.name}</h3>
                    <p class="text-green-600 font-bold text-xl">
                        $${product.discountedPrice || product.price}
                    </p>
                    ${product.discountedPrice ?
                `<p class="text-gray-400 text-sm"><s>$${product.price}</s></p>`
                : ''}
                </div>
            </div>
        `).join('');

        productsContainer.innerHTML = productHTML;
    } catch (error) {
        console.error("Ürünler yüklenirken hata oluştu:", error);
    }
}

class CommentSlider {
    constructor() {
        this.currentIndex = 0;
        this.commentSlider = document.getElementById('commentSlider');
        this.interval = null;
    }

    async loadComments() {
        try {
            const response = await fetch('/product.json');
            const data = await response.json();
            const comments = data.comments;

            this.commentSlider.innerHTML = comments.map((comment, index) => `
                <div class="slide ${index === 0 ? '' : 'hidden'} transition-all duration-500">
                    <div class="comment-content fade-in p-6">
                        <div class="flex items-center gap-8 bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
                            <!-- Sol Taraf - Profil Bilgileri -->
                            <div class="w-1/3 border-r border-gray-100 pr-8">
                                <div class="relative mb-4">
                                    <div class="absolute inset-0 bg-gradient-to-r from-green-200 to-green-100 rounded-full opacity-20 blur-lg"></div>
                                    <img src="${comment.userImage}" 
                                         alt="${comment.userName}" 
                                         class="w-20 h-20 rounded-full object-cover mx-auto border-4 border-white shadow-md relative z-10">
                                </div>
                                
                                <h3 class="font-bold text-xl text-gray-800 mb-2 text-center">${comment.userName}</h3>
                                
                                <div class="flex justify-center gap-1 mb-3">
                                    ${this.generateStars(comment.rating)}
                                </div>
                                
                                <div class="text-green-600 text-sm font-medium text-center">
                                    ${this.getRatingText(comment.rating)}
                                </div>

                                <div class="flex justify-center gap-4 mt-4 pt-4 border-t border-gray-50">
                                    <div class="text-center">
                                        <div class="text-2xl font-bold text-gray-700">${comment.likes}</div>
                                        <div class="text-xs text-gray-400">Likes</div>
                                    </div>
                                    <div class="text-center">
                                        <div class="text-2xl font-bold text-gray-700">${comment.replies || 5}</div>
                                        <div class="text-xs text-gray-400">Replies</div>
                                    </div>
                                </div>
                            </div>

                          
                            <div class="w-2/3 pl-8 relative">
                                <div class="absolute top-0 left-6 text-4xl text-green-100 opacity-50">
                                    <i class="fas fa-quote-left"></i>
                                </div>
                                
                                <p class="text-gray-600 text-lg leading-relaxed relative z-10 mb-6">
                                    ${comment.content}
                                </p>

                                <div class="flex items-center gap-2 text-sm text-gray-400">
                                    <i class="fas fa-clock"></i>
                                    <span>Posted ${comment.date || '2 days ago'}</span>
                                </div>

                                <div class="absolute bottom-0 right-0 flex gap-2">
                                    <button class="review-action-btn bg-red-50 text-red-500">
                                        <i class="fas fa-heart"></i>
                                    </button>
                                    <button class="review-action-btn bg-gray-50 text-gray-500">
                                        <i class="fas fa-share"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');
            const controlsHTML = `
                <div class="slider-controls flex items-center justify-center gap-6 mt-6">
                    <button id="prevBtn" class="nav-btn group">
                        <i class="fas fa-chevron-left group-hover:-translate-x-1 transition-transform"></i>
                    </button>
                    <button id="nextBtn" class="nav-btn group">
                        <i class="fas fa-chevron-right group-hover:translate-x-1 transition-transform"></i>
                    </button>
                </div>
            `;

            this.commentSlider.insertAdjacentHTML('afterend', controlsHTML);
            this.setupControls();
            this.startAutoSlide();
        } catch (error) {
            console.error('Yorumlar yüklenemedi:', error);
        }
    }


    generateStars(rating) {
        return Array(5).fill().map((_, i) => `
            <i class="fas fa-star ${i < rating ? 'text-yellow-400' : 'text-gray-200'} 
               text-xl transform transition-transform hover:scale-110 duration-300"></i>
        `).join('');
    }

    getRatingText(rating) {
        const texts = {
            5: "Excellent Experience!",
            4: "Great Experience",
            3: "Good Experience",
            2: "Fair Experience",
            1: "Poor Experience"
        };
        return texts[rating] || "";
    }

    setupControls() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                this.changeSlide('prev');
                this.resetAutoSlide();
            });

            nextBtn.addEventListener('click', () => {
                this.changeSlide('next');
                this.resetAutoSlide();
            });
        }
    }

    resetAutoSlide() {
        if (this.interval) {
            clearInterval(this.interval);
        }
        this.startAutoSlide();
    }

    startAutoSlide() {
        if (this.interval) {
            clearInterval(this.interval);
        }
        this.interval = setInterval(() => {
            this.changeSlide('next');
        }, 6000); // 6 seconds
    }

    changeSlide(direction) {
        const slides = this.commentSlider.querySelectorAll('.slide');
        if (!slides.length) return;

        slides[this.currentIndex].classList.add('hidden');
        if (direction === 'next') {
            this.currentIndex = (this.currentIndex + 1) % slides.length;
        } else {
            this.currentIndex = (this.currentIndex - 1 + slides.length) % slides.length;
        }
        slides[this.currentIndex].classList.remove('hidden');
    }
}

function initHeroSlider() {
    const slides = document.querySelectorAll('.slide');
    let currentIndex = 0;

    slides[0].classList.add('opacity-100');
    slides[0].classList.remove('opacity-0');

    function nextSlide() {
        slides[currentIndex].classList.remove('opacity-100');
        slides[currentIndex].classList.add('opacity-0');
        currentIndex = (currentIndex + 1) % slides.length;
        slides[currentIndex].classList.remove('opacity-0');
        slides[currentIndex].classList.add('opacity-100');
    }
    setInterval(nextSlide, 5000);
}

// hamburger menu
function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
}

function startTimer() {
    // Hedef tarih: 2025 yılının son günü
    const endDate = new Date("2025-12-31T23:59:59").getTime();

    function updateTimer() {
        const now = new Date().getTime();
        const timeLeft = endDate - now;

        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        document.getElementById("days").textContent = days.toString().padStart(2, '0');
        document.getElementById("hours").textContent = hours.toString().padStart(2, '0');
        document.getElementById("minutes").textContent = minutes.toString().padStart(2, '0');
        document.getElementById("seconds").textContent = seconds.toString().padStart(2, '0');
    }


    updateTimer();
    setInterval(updateTimer, 1000);
}

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    const commentSlider = new CommentSlider();
    commentSlider.loadComments();
    initHeroSlider();
    startTimer();
    initMobileMenu();
});

document.getElementById("scrollToTopBtn").addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
});
document.head.insertAdjacentHTML('beforeend', styles);