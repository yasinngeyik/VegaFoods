async function loadProducts() {
    try {
        const { products } = await (await fetch("/product.json")).json();
        const productsContainer = document.querySelector("#products-container");

        const productsToShow = products.slice(0, products.length - 7); //bununla arkadakileri sildim

        productsToShow.forEach(product => {
            const productDiv = document.createElement("div");
            productDiv.classList.add("product-card");

            productDiv.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="product-image rounded-t-lg">
                <div class="icons-container">
                    <button class="icon-button">
                        <i class="fa-solid fa-bars"></i>
                    </button>
                    <button class="icon-button">
                        <i class="fa-solid fa-cart-shopping"></i>
                    </button>
                    <button class="icon-button">
                        <i class="fa-solid fa-heart"></i>
                    </button>
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-price">$${product.discountedPrice || product.price}</p>
                    ${product.discountedPrice ? `<p class="old-price">$${product.price}</p>` : ''}
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
