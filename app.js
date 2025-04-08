async function loadProducts() {
    try {
        const { products } = await (await fetch("/product.json")).json();
        const productsContainer = document.querySelector("#products-container");

        const productsToShow = products.slice(0, products.length - 7); //bununla arkadakileri sildim

        productsToShow.forEach(product => {
            const productDiv = document.createElement("div");
            productDiv.classList.add("product-card");

            productDiv.innerHTML = `
             ${product.discountedPrice ? `
        <span class="discount-badge absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
           SALE !
        </span>
    ` : ''}
                <img src="${product.image}" alt="${product.name}" class="product-image rounded-t-lg">
              
<div class="icons-container cursor-pointer">
    <button class="icon-button">
        <i class="fa-solid fa-bars text-xs"></i>
    </button>
    <button class="icon-button">
        <i class="fa-solid fa-cart-shopping text-xs"></i>
    </button>
    <button class="icon-button">
        <i class="fa-solid fa-heart text-xs"></i>
    </button>
</div>
<div class="product-info">
    <h3 class="product-name">${product.name}</h3>
    <p class="product-price">$${product.discountedPrice || product.price}</p>
    ${product.discountedPrice ? `<p class="old-price"><s>$${product.price}</s></p>` : ''}
</div>
            `;

            productsContainer.appendChild(productDiv);
        });
    } catch (error) {
        console.error("Ürünler yüklenirken hata oluştu:", error);
    }
}

loadProducts();



// navbar-toggle
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});



let index = 0;
const slides = document.querySelectorAll(".slide");

setInterval(() => {
    slides.forEach((slide, i) => {
        slide.classList.remove("opacity-100");
        slide.classList.add("opacity-0");
    });

    slides[index].classList.add("opacity-100");
    slides[index].classList.remove("opacity-0");

    index = (index + 1) % slides.length;
}, 4000);


function startTimer() {
    const endTime = new Date("2025-12-31T23:59:59").getTime(); // Hedef zaman (bu örnekte 31 Aralık 2025)

    setInterval(function () {
        const now = new Date().getTime();
        const timeLeft = endTime - now;

        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        // Sayfada zaman gösterme
        document.getElementById("days").innerHTML = days;
        document.getElementById("hours").innerHTML = hours;
        document.getElementById("minutes").innerHTML = minutes;
        document.getElementById("seconds").innerHTML = seconds;
    }, 1000); // Zamanı her saniye günceller
}

window.onload = startTimer;