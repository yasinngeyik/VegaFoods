async function loadProducts(category = "all") {
    try {
        const response = await fetch("/product.json");
        const data = await response.json();
        const filteredProducts = category === "all" ? data.products : data.products.filter(product => product.category === category);

        const container = document.querySelector("#products-container");
        container.innerHTML = filteredProducts.map(product => `
        <div class="product-card relative rounded-lg shadow-sm hover:shadow-md overflow-hidden">
          ${product.discountedPrice ? `
            <span class="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
              SALE!
            </span>` : ''}

          <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover product-image ">

          <div class="absolute inset-0 flex justify-center items-center space-x-2">
            <button class="icon-button w-9 h-9 rounded-full flex items-center justify-center shadow-md mt-20"
              onclick='addToCart(${JSON.stringify(product)})'>
              <i class="fa-solid fa-cart-shopping"></i>
            </button>
            <button class="icon-button w-9 h-9 rounded-full flex items-center justify-center shadow-md mt-20">
              <i class="fa-solid fa-heart"></i>
            </button>
            <button class="icon-button w-9 h-9 rounded-full flex items-center justify-center shadow-md mt-20">
              <i class="fa-solid fa-bars"></i>
            </button>
          </div>

          <div class="p-4">
            <h3 class="text-lg font-semibold text-gray-800 mb-2">${product.name}</h3>
            <p class="text-green-600 font-bold text-xl">$${product.discountedPrice || product.price}</p>
            ${product.discountedPrice ? `<p class="text-gray-400 text-sm"><s>$${product.price}</s></p>` : ''}
          </div>
        </div>
      `).join('');
    } catch (err) {
        console.error("Ürünler yüklenirken hata:", err);
    }
}


document.addEventListener("DOMContentLoaded", () => loadProducts());

document.querySelector("#categoryButtons").addEventListener("click", (event) => {
    const category = event.target.getAttribute("data-category");
    if (category) {

        const buttons = document.querySelectorAll(".category-btn");
        buttons.forEach(btn => btn.classList.remove("bg-green-500", "text-white"));


        event.target.classList.add("bg-green-500", "text-white");

        loadProducts(category);
    }
});