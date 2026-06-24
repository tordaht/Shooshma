const items = [
  { title: "Sleep Mask Application", src: "assets/mockups/EyePath.webp", type: "product" },
  { title: "Ritual Flyer", src: "assets/mockups/Flyer.webp", type: "print" },
  { title: "Gift Package System", src: "assets/mockups/GiftPackage.webp", type: "set" },
  { title: "Night Cream Jar", src: "assets/mockups/NightCream.webp", type: "product" },
  { title: "Blue Tansy Night Cream", src: "assets/mockups/Night-Cream.webp", type: "product" },
  { title: "Night Cream Box", src: "assets/mockups/NightCreamBox.webp", type: "product" },
  { title: "Deep Sleep Pillow Mist", src: "assets/mockups/PillowMist.webp", type: "product" },
  { title: "Pillow Mist Box", src: "assets/mockups/PillowMistBox.webp", type: "product" },
  { title: "Pillow Mist Set", src: "assets/mockups/PillowMistSet.webp", type: "set" },
  { title: "QR Ritual Card", src: "assets/mockups/QR.webp", type: "print" },
  { title: "Collection Set", src: "assets/mockups/SleepSet.webp", type: "set" },
  { title: "Editorial Product Scene", src: "assets/mockups/SleepSet-2.webp", type: "set" },
  { title: "Product Benefit Layout", src: "assets/mockups/SleepSet-3.webp", type: "set" }
];

const gallery = document.querySelector(".gallery");
const filters = document.querySelectorAll(".filter");
const progress = document.querySelector(".progress");
const navLinks = document.querySelectorAll(".nav a");
const lightbox = document.querySelector(".lightbox");
const lightboxImage = lightbox.querySelector("img");
const lightboxCaption = lightbox.querySelector("figcaption");
let visibleItems = [...items];
let currentIndex = 0;

function renderGallery(filter = "all") {
  visibleItems = filter === "all" ? [...items] : items.filter((item) => item.type === filter);
  gallery.innerHTML = visibleItems
    .map(
      (item, index) => `
        <button class="gallery-item" type="button" data-index="${index}" aria-label="${item.title}">
          <img src="${item.src}" alt="${item.title}" loading="lazy">
          <span>${item.title}</span>
        </button>
      `
    )
    .join("");
}

function openLightbox(index) {
  const item = visibleItems[index];
  if (!item) return;
  currentIndex = index;
  lightboxImage.src = item.src;
  lightboxImage.alt = item.title;
  lightboxCaption.textContent = item.title;
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
}

function moveLightbox(step) {
  const nextIndex = (currentIndex + step + visibleItems.length) % visibleItems.length;
  openLightbox(nextIndex);
}

filters.forEach((button) => {
  button.addEventListener("click", () => {
    filters.forEach((filter) => filter.classList.remove("active"));
    button.classList.add("active");
    renderGallery(button.dataset.filter);
  });
});

gallery.addEventListener("click", (event) => {
  const button = event.target.closest(".gallery-item");
  if (button) openLightbox(Number(button.dataset.index));
});

lightbox.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
lightbox.querySelector(".prev").addEventListener("click", () => moveLightbox(-1));
lightbox.querySelector(".next").addEventListener("click", () => moveLightbox(1));
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

window.addEventListener("keydown", (event) => {
  if (!lightbox.classList.contains("open")) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") moveLightbox(-1);
  if (event.key === "ArrowRight") moveLightbox(1);
});

function updateProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const percentage = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progress.style.width = `${percentage}%`;
}

function updateActiveNav() {
  let active = "home";
  document.querySelectorAll("main section[id]").forEach((section) => {
    if (section.getBoundingClientRect().top < 150) active = section.id;
  });
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${active}`);
  });
}

window.addEventListener("scroll", () => {
  updateProgress();
  updateActiveNav();
});

renderGallery();
updateProgress();
updateActiveNav();
