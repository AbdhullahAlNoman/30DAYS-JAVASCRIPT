const apiKey = "ee71a566"; // 🔑 Replace with your OMDb API key
const searchBtn = document.getElementById("searchBtn");
const movieInput = document.getElementById("movieInput");
const movieResult = document.getElementById("movieResult");

searchBtn.addEventListener("click", () => {
  const movieName = movieInput.value.trim();
  if (movieName === "") {
    movieResult.innerHTML = `<p>Please enter a movie name!</p>`;
    return;
  }

  fetch(`https://www.omdbapi.com/?t=${movieName}&apikey=${apiKey}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.Response === "True") {
        movieResult.innerHTML = `
          <h2>${data.Title}</h2>
          <p><strong>Year:</strong> ${data.Year}</p>
          <p><strong>IMDB Rating:</strong> ⭐ ${data.imdbRating}</p>
          <img src="${data.Poster !== "N/A" ? data.Poster : "https://via.placeholder.com/200"}" alt="${data.Title}">
        `;
      } else {
        movieResult.innerHTML = `<p>Movie not found! 😢</p>`;
      }
    })
    .catch((error) => {
      movieResult.innerHTML = `<p>Error fetching data. Please try again.</p>`;
      console.error(error);
    });
});
