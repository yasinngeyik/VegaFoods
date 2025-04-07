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
