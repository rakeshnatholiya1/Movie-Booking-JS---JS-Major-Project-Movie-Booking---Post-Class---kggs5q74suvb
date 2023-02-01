
import { fetchMovieAvailability, fetchMovieList } from "./api.js";

let movies = [];
let selectedMovie = null;
let unavailableSeats = [];
let selectedSeats = [];
const loaderEle = document.getElementById("loader");
const bookBtn = document.getElementById("book-ticket-btn");

function showMovies() {
  //show movies
  console.log("showing movies");
  const divEle = document.createElement("div");
  divEle.className = "movie-holder";
  const mainEle = document.querySelector("main");
  mainEle.appendChild(divEle);
  for (let movie of movies) {
    console.log(movie);
    const movieElement = document.createElement("div");
    movieElement.innerHTML = `<a class="movie-link">
        <div class="movie" data-id="${movie.name}">
        <div class="movie-img-wrapper" style="background-image:url(${movie.imgUrl}); background-size:cover">
        </div>
        <h4>${movie.name}</h4>
        </div>
        </a>`;

    movieElement.addEventListener("click", async function () {
      selectedMovie = movie;
      unavailableSeats = await fetchMovieAvailability(movie.name);
      console.log(unavailableSeats);
      const selectorEle = document.getElementById("selector-text");
      selectorEle.className = "";
      showSeats();
    });

    divEle.appendChild(movieElement);
    // const imageWrapper = document.querySelector(".movie-img-wrapper")
    // imageWrapper.style.backgroundImage=`url(${movie.imgUrl})`
    // imageWrapper.style.backgroundSize = "cover"
  }
}
function showSeats() {
  console.log("show seats");
  const gridHolderEle = document.getElementById("booker-grid-holder");
  const firstGrid = document.createElement("div");
  firstGrid.className = "booking-grid";
  gridHolderEle.innerHTML = "";
  gridHolderEle.appendChild(firstGrid);
  for (let i = 0; i < 12; i++) {
    const seat = document.createElement("div");
    seat.innerText = i + 1;
    seat.className = "booking-grid-gridNumber";
    seat.style.padding = "10px";
    seat.style.border = "1px solid black";

    if (unavailableSeats.includes(i + 1)) {
      seat.className = "unavailable-seat";
    } else {
      seat.className = "available-seat";
    }
    seat.addEventListener("click", function () {
      //if i+1 is not in unavailableSeats
      if (!unavailableSeats.includes(i + 1)) {
        if (selectedSeats.includes(i + 1)) {
          selectedSeats = selectedSeats.filter((selectedSeat) => {
            return selectedSeat !== i + 1;
          });
          seat.className = "available-seat";
          seat.style.border = "1px solid black";

          if (selectedSeats.length < 1) {
            bookBtn.className = "v-none";
          }
        } else {
          selectedSeats.push(i + 1);
          seat.className = "selected-seat";
          seat.style.border = "4px outset rgb(0, 0, 0)";
          bookBtn.className = "";
        }

        console.log(selectedSeats);
      }
    });

    firstGrid.appendChild(seat);
  }
}
function hideLoader() {
  loaderEle.className = "d-none";
}
async function getMovies() {
  //fetch movies
  movies = await fetchMovieList();
  console.log(movies);
  hideLoader();
  showMovies();
}

getMovies();

bookBtn.addEventListener("click", function () {
  console.log("book seats");
  const bookerDiv = document.getElementById("booker");
  bookerDiv.innerHTML = "";
  const purchaseElement = document.createElement("div");
  purchaseElement.id = "confirm-purchase";

  purchaseElement.innerHTML = `
    <h3>Confirm your booking for seat numbers:${selectedSeats.join(", ")}</h3>
    <form id="customer-detail-form">
        <label for="email">Email</label>
        <input type="email" id="email" class="email" required>
        <br>
        <br>
        <label for="phone_number">Phone number</label>
        <input type="text" id="phone" class="phone" required>
        <br>
        <br>
        <button type="submit">Purchase</button>
    </form>
    `;
  bookerDiv.appendChild(purchaseElement);

  document
    .getElementById("customer-detail-form")
    .addEventListener("submit", (e) => {
      e.preventDefault();
      console.log("submit");
      const successDiv = document.createElement("div");
      const number = document.querySelector("#phone").value;
      // console.log(number);

      const email = document.getElementById("email").value;
      bookerDiv.innerHTML = "";

      successDiv.id = "Success";
      successDiv.innerHTML = `
        <h3>Booking details</h3>
        <p>Seats: ${selectedSeats.join(",")}</p>
        <p>Phone number: ${number}</p>
        <p>Email: ${email}</p>
        `;
      bookerDiv.appendChild(successDiv);
    });
});

