/////////////////////// Icon color change in navigation /////////////////////
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

///////////////////////// Carousel //////////////////////////
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

// ////////////////// FETCHING THE DATA FOR TOP RATED MOVIES ///////////////////
const FEATURED_API_KEY =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0YzE3YjQ4YjFmMzFkZWNlMDI5N2JkZGQ1ZGM4YmMwZCIsInN1YiI6IjY2NDYyM2Y2Y2VlNWFiOTBhYTJkYjc3OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ElAPr5z_O7njtzfAJLXeQiPcsjlcVS6xbWYCdAPcTms";
const BASE_URL = "https://api.themoviedb.org";
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${FEATURED_API_KEY}`,
  },
};
const IMG_BASE_URL = "https://image.tmdb.org/t/p/w500";
const topRatedList = document.querySelector(".top-rated-list");
const btnSwipe = document.getElementById("btnSwipe");
let movieList = [];

// trimming the plot overviews that are too long
function trimString(string) {
  const words = string.split(" ");
  if (words.length > 15) {
    return words.slice(0, 15).join(" ") + "...";
  }
  return string;
}

function movieCardCLickHandler(id) {
  window.location.replace(
    `https://honey-movies.vercel.app/pages/movieInner.html?id=${id}`
  );
}

function displayMovies(movies) {
  topRatedList.innerHTML = "";
  movies.forEach((movie) => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("top-rated-movie");
    movieCard.classList.add("movie-card");
    movieCard.innerHTML = `
    <img src="${IMG_BASE_URL}${movie.poster_path}" alt="${
      movie.title
    }" class="movie-img" />
    <div class="movie-rating">${Number(movie.vote_average.toFixed(1))}</div>
    <h2 class="movie-title">${movie.title}</h2>
    <img src="../images/Review 5.png" alt="Rating 5" class="stars" />
    <p class="release-date">${movie.release_date}</p>
    <p class="plot">${trimString(movie.overview)}</p>
    `;

    movieCard.addEventListener("click", () => movieCardCLickHandler(movie.id));

    topRatedList.appendChild(movieCard);
  });
}

async function fetchData() {
  try {
    const result = await fetch(`${BASE_URL}/3/movie/top_rated`, options);
    const data = await result.json();

    const top3Movies = data.results.slice(0, 3);
    displayMovies(top3Movies);
  } catch (error) {
    console.log(`Error fetching data: ${error}`);
  }
}
fetchData();

// ///////////////////// SEARCH FUNCTIONALITY ///////////////
const searchBar = document.getElementById("search-bar");
const searchResultList = document.querySelector(".search-result-list");

document.addEventListener("DOMContentLoaded", function () {
  let filteredMovies = [];

  async function searchMovies(searchTerm) {
    try {
      const response = await fetch(
        `${BASE_URL}/3/search/multi?query=${searchTerm}&include_adult=false&language=en-US&page=1`,
        options
      );
      const data = await response.json();
      filteredMovies = data.results || [];
    } catch (error) {
      console.log(`Error fetching data: ${error}`);
    }
  }

  function extractYear(dateString) {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    return isNaN(date.getFullYear()) ? "Unknown date" : date.getFullYear();
  }

  function displayMovies() {
    searchResultList.innerHTML = "";

    if (filteredMovies.length === 0) {
      const noMovieCard = document.createElement("div");
      noMovieCard.classList.add("search-result");
      noMovieCard.innerHTML = `
        <p class='no-results'>Movie not found</p>
      `;
      searchResultList.appendChild(noMovieCard);
      searchResultList.style.display = "block";
    } else {
      filteredMovies.forEach((movie) => {
        const movieCard = document.createElement("div");
        movieCard.classList.add("search-result");
        movieCard.classList.add("movie-card");
        const releaseYear = extractYear(
          movie.release_date || movie.first_air_date
        );
        movieCard.innerHTML = `
        <img src="${
          movie.poster_path
            ? IMG_BASE_URL + movie.poster_path
            : "placeholder-image-url"
        }" alt="${movie.title || movie.name}" alt="${movie.name}" />
        <div class="search-result-info">
          <h3 class="search-result--title">${movie.title || movie.name}</h3>
          <p class="search-result--date">${releaseYear}</p>
        </div>
      `;

        movieCard.addEventListener("click", () =>
          movieCardCLickHandler(movie.id)
        );

        searchResultList.appendChild(movieCard);
      });
    }
  }

  searchBar.addEventListener("input", function () {
    const searchTerm = searchBar.value.toLowerCase();

    searchMovies(searchTerm);
    displayMovies();
  });
});

// ///////////// BURGER MENU FUNCTIONALITY FOR MOBILE //////////
const burgerIcon = document.getElementById("burger-menu");
const navigation = document.querySelector(".navigation-container");
const logo = document.querySelector(".logo");
const honeyComb = document.querySelector(".honey-comb-img");

function toggleNavigation() {
  if (navigation.style.display === "none") {
    navigation.style.display = "flex";
    navigation.classList.add("navigation-burger");
    honeyComb.classList.add("hidden");
    logo.classList.add("hidden");
    logo.classList.remove("logo");
  } else if ((navigation.style.display = "flex")) {
    navigation.style.display = "none";
    navigation.classList.remove("navigation-burger");
    honeyComb.classList.remove("hidden");
    logo.classList.remove("hidden");
    logo.classList.add("logo");
  }
}

burgerIcon.addEventListener("click", toggleNavigation);

// Check screen width and reset display property on resize
window.addEventListener("resize", function () {
  if (window.innerWidth > 1104) {
    navigation.style.display = "";
    navigation.classList.remove("navigation-burger");
    honeyComb.classList.remove("hidden");
    logo.classList.remove("hidden");
    logo.classList.add("logo");
  }
});
