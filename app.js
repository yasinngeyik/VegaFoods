const cart = [];
function updateCartUI() {
    const countEl = document.querySelector("#cart-count");
    const cartItemsEl = document.querySelector("#cart-items");
    const cartTotalEl = document.querySelector("#cart-total");

    let totalItems = 0;
    let totalPrice = 0;
    cartItemsEl.innerHTML = '';

    if (cart.length === 0) {
        cartItemsEl.innerHTML = `<li class="text-gray-500 text-xs">Your cart is empty</li>`;
        cartTotalEl.textContent = "";
    } else {
        cart.forEach((item, index) => {
            totalItems += item.quantity;
            const itemPrice = (item.discountedPrice || item.price) * item.quantity;
            totalPrice += itemPrice;

            cartItemsEl.innerHTML += `
                <div class="flex items-center justify-between border-b pb-1" data-index="${index}">
                    <img src="${item.image}" class="w-10 h-10 object-cover rounded mr-2" />
                    <div class="flex-1 text-gray-800 text-xs">
                        ${item.name}<br>
                        <span class="text-green-600 font-semibold">$${itemPrice.toFixed(2)}</span>
                    </div>
                    <div class="flex items-center space-x-2">
                        <button data-action="decrease" class="px-2 py-1 text-xs bg-gray-200 rounded">-</button>
                        <span class="text-sm font-bold">${item.quantity}</span>
                        <button data-action="increase" class="px-2 py-1 text-xs bg-gray-200 rounded">+</button>
                        <button data-action="remove" class="px-2 py-1 text-xs bg-red-200 rounded">Delete</button>
                    </div>
                </div>
            `;
        });

        cartTotalEl.textContent = `Total: $${totalPrice.toFixed(2)}`;
    }

    countEl.textContent = `[${totalItems}]`;
}

function updateFavoritesUI() {
    const favoritesCountEl = document.querySelector("#favorites-count");
    const favoritesListEl = document.querySelector("#favorites-list");

    favoritesListEl.innerHTML = favorites.length === 0 ?
        `<li class="text-gray-400">No favorites yet.</li>` :
        favorites.map(item => `
            <li class="text-gray-800">${item.name}</li>
        `).join('');
    favoritesCountEl.textContent = `[${favorites.length}]`
}

// Event delegation for cart buttons
document.querySelector("#cart-items").addEventListener("click", function (e) {
    const action = e.target.dataset.action;
    if (!action) return;

    const itemDiv = e.target.closest("[data-index]");
    const index = parseInt(itemDiv.dataset.index);

    if (action === "increase") {
        cart[index].quantity++;
    } else if (action === "decrease") {
        if (cart[index].quantity > 1) {
            cart[index].quantity--;
        } else {
            cart.splice(index, 1);
        }
    } else if (action === "remove") {
        cart.splice(index, 1);
    }

    updateCartUI();
});

// Add product to cart
function addToCart(product) {
    const existingIndex = cart.findIndex(item => item.id === product.id);
    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCartUI();
}

// Add favorite to cart
const favorites = [];
function addToFavorites(product) {
    if (!favorites.some(item => item.id === product.id)) {
        favorites.push(product);
        updateFavoritesUI();
    }
}
function removeFromFavorites(productId) {
    const index = favorites.findIndex(item => item.id === productId);
    if (index > -1) {
        favorites.splice(index, 1);
        updateFavoritesUI();
    }
}

function updateFavoritesUI() {
    const favoritesCountEl = document.querySelector("#favorites-count");
    const favoritesListEl = document.querySelector("#favorites-list");

    if (favorites.length === 0) {
        favoritesListEl.innerHTML = `<li class="text-gray-400">No favorites yet.</li>`;
    } else {
        favoritesListEl.innerHTML = favorites.map(item => `
            <li class="flex items-center justify-between text-gray-800">
                <img src="${item.image}" class="w-10 h-10 object-cover rounded mr-2" />
                <span>${item.name}</span>
                <button onclick="removeFromFavorites(${item.id})" class="text-red-500 ml-2"><i class="fa-regular fa-trash-can fa-sm"></i></button>
            </li>
        `).join('');
    }
    favoritesCountEl.textContent = `[${favorites.length}]`;
}


document.querySelector("#favorites-button").addEventListener("click", () => {
    document.querySelector("#favorites-panel").classList.toggle("hidden");
});

// Sepet butonuna tıklama
document.querySelector("#cart-button").addEventListener("click", () => {
    document.querySelector("#mini-cart").classList.toggle("hidden");
});

async function loadProducts(category = "all") {
    try {
        const response = await fetch("/product.json");
        const data = await response.json();

        // Kategoriyi filtrele
        const filteredProducts = category === "all" ? data.products : data.products.filter(product => product.category === category);
        const limitedProducts = filteredProducts.slice(0, 4);
        const container = document.querySelector("#products-container");
        container.innerHTML = limitedProducts.map(product => `
            <div class="product-card relative rounded-lg shadow-sm hover:shadow-md overflow-hidden group">
                ${product.discountedPrice ? `
                    <span class="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                        SALE!
                    </span>` : ''}
                <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover product-image">
                <div class="absolute inset-0 mt-16 flex justify-center items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                    <button class="w-9 h-9 rounded-full flex items-center justify-center shadow-md mt-20 group-hover:bg-green-500 group-hover:text-white transition-colors duration-300"
                        onclick='addToCart(${JSON.stringify(product)})'>
                        <i class="fa-solid fa-cart-shopping"></i>
                    </button>
                    <button class="w-9 h-9 rounded-full flex items-center justify-center shadow-md mt-20 group-hover:bg-green-500 group-hover:text-white transition-colors duration-300"
                        onclick='addToFavorites(${JSON.stringify(product)})'>
                        <i class="fa-solid fa-heart"></i>
                    </button>
                    <button class="w-9 h-9 rounded-full flex items-center justify-center shadow-md mt-20 group-hover:bg-green-500 group-hover:text-white transition-colors duration-300">
                        <i class="fa-solid fa-bars"></i>
                    </button>
                </div>
            </div>
            <div class="p-4">
                <h3 class="text-lg font-semibold text-gray-800 mb-2">${product.name}</h3>
                <p class="text-green-600 font-bold text-xl">$${product.discountedPrice || product.price}</p>
                ${product.discountedPrice ? `<p class="text-gray-400 text-sm"><s>$${product.price}</s></p>` : ''}
            </div>
        `).join('');
    } catch (err) {
        console.error("Ürünler yüklenirken hata:", err);
    }
}



document.addEventListener("DOMContentLoaded", () => {
    loadProducts();
});

document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector("#categoryButtons")) {
        document.querySelector("#categoryButtons").addEventListener("click", (event) => {
            if (!event.target.classList.contains("category-btn")) return;

            const category = event.target.getAttribute("data-category");
            if (category) {
                const buttons = document.querySelectorAll(".category-btn");
                buttons.forEach(btn => btn.classList.remove("bg-green-500", "text-white"));

                event.target.classList.add("bg-green-500", "text-white");

                loadProducts(category);
            }
        });
    }

});


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

// customer counter
const counters = document.querySelectorAll(".counter");

const options = {
    threshold: 0.5,
};

const runCounter = (counter) => {
    const target = +counter.getAttribute("data-target");
    const duration = 7000; // toplam süresi ms cinsinden
    const stepTime = 10;
    let count = 0;
    const increment = target / (duration / stepTime);

    const interval = setInterval(() => {
        count += increment;
        if (count >= target) {
            counter.textContent = target.toLocaleString();
            clearInterval(interval);
        } else {
            counter.textContent = Math.floor(count).toLocaleString();
        }
    }, stepTime);
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            runCounter(entry.target);
            observer.unobserve(entry.target); // bir kez çalışsın
        }
    });
}, options);

counters.forEach(counter => {
    observer.observe(counter);
});