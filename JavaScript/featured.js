// ////////////////// FETCHING THE DATA FOR FEATURED MOVIE LIST ///////////////////
const FEATURED_API_KEY =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0YzE3YjQ4YjFmMzFkZWNlMDI5N2JkZGQ1ZGM4YmMwZCIsInN1YiI6IjY2NDYyM2Y2Y2VlNWFiOTBhYTJkYjc3OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ElAPr5z_O7njtzfAJLXeQiPcsjlcVS6xbWYCdAPcTms";
const BASE_URL = "https://api.themoviedb.org";
const IMG_BASE_URL = "https://image.tmdb.org/t/p/w500";
const SEARCH_API_KEY = 278130;
const topRatedList = document.querySelector(".top-rated-list");
const btnSwipe = document.getElementById("btnSwipe");

// trimming the plot overviews that are too long
function trimString(string) {
  const words = string.split(" ");
  if (words.length > 15) {
    return words.slice(0, 15).join(" ") + "...";
  }
  return string;
}

async function fetchData() {
  try {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${FEATURED_API_KEY}`,
      },
    };

    const result = await fetch(`${BASE_URL}/3/discover/movie`, options);
    const data = await result.json();

    let currentIndex = 0;
    const itemsPerPage = 5;
    const totalItems = data.results.length;

    function displayMovies(startIndex, endIndex) {
      topRatedList.innerHTML = "";
      const movieList = data.results.slice(startIndex, endIndex);

      movieList.forEach((movie) => {
        const movieCard = document.createElement("div");
        movieCard.classList.add("top-rated-movie");
        movieCard.innerHTML = `
        <img src="${IMG_BASE_URL}${movie.poster_path}" alt="${
          movie.title
        }" class="movie-img" />
        <div class="movie-rating">${Number(movie.vote_average.toFixed(1))}</div>
        <h2 class="movie-title">${movie.title}</h2>
        <img src="../images/Review 4.5.png" alt="Rating 4.5" class="stars" />
        <p class="release-date">${movie.release_date}</p>
        <p class="plot">${trimString(movie.overview)}</p>
        `;
        topRatedList.appendChild(movieCard);
      });
    }

    btnSwipe.addEventListener("click", () => {
      currentIndex += itemsPerPage;

      if (currentIndex >= totalItems) {
        currentIndex = 0;
      }

      const nextIndex = currentIndex + itemsPerPage;

      displayMovies(currentIndex, nextIndex);
    });

    displayMovies(currentIndex, itemsPerPage);
  } catch (error) {
    console.log(`Error fetching data: ${error}`);
  }
}

fetchData();
