// Icon color change in navigation
document.querySelectorAll(".navigation ul li").forEach((li) => {
  li.addEventListener("mouseenter", () => {
    const embed = li.querySelector("embed");
    const svgDoc = embed.getSVGDocument();
    if (svgDoc) {
      const paths = svgDoc.querySelectorAll("path");
      paths.forEach((path) => (path.style.stroke = "orange"));
    }
  });
  li.addEventListener("mouseleave", () => {
    const embed = li.querySelector("embed");
    const svgDoc = embed.getSVGDocument();
    if (svgDoc) {
      const paths = svgDoc.querySelectorAll("path");
      paths.forEach((path) => (path.style.stroke = ""));
    }
  });
});

// Carousel
let currentSlide = 0;
const slides = document.querySelectorAll(".carousel-item");
const dots = document.querySelectorAll(".dot");

function showSlide(n) {
  if (n < 0) {
    currentSlide = slides.length - 1;
  } else if (n >= slides.length) {
    currentSlide = 0;
  } else {
    currentSlide = n;
  }

  slides.forEach((slide, index) => {
    slide.style.display = "none";
    dots[index].classList.remove("active");
  });

  slides[currentSlide].style.display = "block";
  dots[currentSlide].classList.add("active");
}

function nextSlide() {
  showSlide(currentSlide + 1);
}

function prevSlide() {
  showSlide(currentSlide - 1);
}

function currentSlideIndex(n) {
  showSlide(n);
}

document.querySelector(".btn-next").addEventListener("click", nextSlide);
document.querySelector(".btn-prev").addEventListener("click", prevSlide);

dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    currentSlideIndex(index);
  });
});

showSlide(currentSlide);
