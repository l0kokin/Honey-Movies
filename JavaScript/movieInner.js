const FEATURED_API_KEY =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0YzE3YjQ4YjFmMzFkZWNlMDI5N2JkZGQ1ZGM4YmMwZCIsInN1YiI6IjY2NDYyM2Y2Y2VlNWFiOTBhYTJkYjc3OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ElAPr5z_O7njtzfAJLXeQiPcsjlcVS6xbWYCdAPcTms";
const BASE_URL = "https://api.themoviedb.org";
const IMG_BASE_URL = "https://image.tmdb.org/t/p/w500";
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${FEATURED_API_KEY}`,
  },
};
const movieId = window.location.href.split("id=")[1];
const movieContainer = document.querySelector(".movie-inner");
const body = document.querySelector(".movies-inner--body");

function displayMovies(movie) {
  const movieCard = document.createElement("div");
  movieCard.classList.add("movie-inner--info");
  movieCard.innerHTML = `
    <h1 class="movie-inner--title">${movie.title}</h1>
    <img src="../images/Review.png" alt="4.5 star review" class="movie-inner--stars" />
    <p class="movie-inner--views">${movie.popularity} views</p>
    <img src="../images/imdb logo.png" alt="imdb logo" width="57px" />
    <p class="movie-inner--plot">${movie.overview}</p>
    <div class="movie-inner--buttons">
        <button class="btn btn-white btn-inner">
        <embed src="../icons/Plus.svg" /> Watchlist
        </button>
        <button class="btn btn-yellow btn-inner">Watch Now</button>
    </div>
    `;

  const movieImg = document.createElement("img");
  movieImg.classList.add("movie-inner--image");
  movieImg.alt = movie.title;
  movieImg.src = `${IMG_BASE_URL}/${movie.poster_path}`;

  movieContainer.appendChild(movieCard);
  movieContainer.appendChild(movieImg);
  body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.33), rgba(0, 0, 0, 0.8)), url("${IMG_BASE_URL}/${movie.backdrop_path}")`;
}

async function fetchMovie() {
  try {
    const result = await fetch(`${BASE_URL}/3/movie/${movieId}`, options);
    const data = await result.json();

    console.log(data);
    displayMovies(data);
  } catch (error) {
    console.log(`Error fetching data: ${error}`);
  }
}

fetchMovie();
