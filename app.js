
import { fetchMovieAvailability, fetchMovieList } from "./api.js";
const bookTicketBtn = document.querySelector("#book-ticket-btn");
bookTicketBtn.addEventListener("click", (e) => handleBookTicket(e));
let selectedSeats = [];
function htmlToElement(html) {
  const template = document.createElement("template");
  html = html.trim(); // Never return a text node of whitespace as the result
  template.innerHTML = html;
  return template.content.firstChild;
}
const renderConfirmPurchaseForm = (seats) => {
  const booker = document.querySelector("#booker");
  booker.innerHTML = "";
  const confirmationFormEl = htmlToElement(
    `
        <div id="confirm-purchase">
        <h3>Confirm your booking for seat numbers:${seats.join(",")}</h3>
        <form id="customer-detail-form">
            <label for="email_input" >Email</label>
            <input type="email" id="email_input" required>
            <br>
            <br>
            <label for="phone_input">Phone number</label>
            <input type="tel" id="phone_input" required>
            <br>
            <br>
            <button type="submit">Purchase</button>
        </form>
        </div>
        `
  );
  booker.appendChild(confirmationFormEl);
  document
    .querySelector("#confirm-purchase form")
    .addEventListener("submit", () => {
      const email = document.querySelector('input[type="email"]').value;
      const tel = document.querySelector('input[type="tel"]').value;
      booker.innerHTML = "";
      const success = htmlToElement(
        `
            <div id="success">
                <h4>Booking details</h4>
                <p>Seats: ${seats.join(",")}</p>
                <p>Phone number:${tel}</p>
                <p>Email:${email}</p>
            </div>
            `
      );
      booker.appendChild(success);
    });
};
const loader = htmlToElement('<div id="loader">Loading...</div>');
const createMovieEl = (movieObj) => {
  const movieEl = htmlToElement(
    `
        <a class="movie-link" href="/${movieObj.name}">
        <div class="movie" data-id="${movieObj.name}">
            <div class="movie-img-wrapper" style="background-image:url('${movieObj.imgUrl}');background-size:cover;">
                
            </div>
            <h4>${movieObj.name}</h4>
        </div>
        </a>
        `
  );
  movieEl.addEventListener("click", (e) => {
    e.preventDefault();
    if (e.target.dataset.id) {
      renderSeatBooker(e.target.dataset.id);
    } else {
      renderSeatBooker(e.target.parentElement.dataset.id);
    }
  });
  return movieEl;
};
const renderMovieList = async () => {
  const main = document.querySelector("main");
  main.appendChild(loader);
  const movieHolder = htmlToElement(
    `<div class="movie-holder">
        </div>
        `
  );

  main.appendChild(movieHolder);
  fetchMovieList().then((data) => {
    loader.remove();
    data.forEach((movie) => {
      movieHolder.appendChild(createMovieEl(movie));
    });
  });
};

const renderSeatBooker = (id) => {
  //e.preventDefault()
  selectedSeats = [];
  const bookerHolder = document.querySelector("#booker");
  document.querySelector("#booker h3").classList.toggle("v-none");
  document.querySelector("#booker-grid-holder").innerHTML = "";
  bookerHolder.appendChild(loader);
  fetchMovieAvailability(id).then((availableSeatNumbers) => {
    renderSeatSelector(availableSeatNumbers, { start: 1, rows: 3, columns: 4 });
    renderSeatSelector(availableSeatNumbers, {
      start: 1,
      rows: 3,
      columns: 4,
      offset: 12
    });

    loader.remove();
  });
};
const renderSeatSelector = (
  availableSeatNumbers,
  { start = 1, rows = 3, columns = 4, boxSize = "80px", offset = 0 }
) => {
  const css = `display:grid;grid-template-rows:repeat(${rows},${boxSize});grid-template-columns:repeat(${columns},${boxSize});gap:10px;`;
  let boxMarkup = "";
  for (let i = start; i <= columns * rows; i++) {
    boxMarkup += `
        <div id="booking-grid-${i + offset}" class="${
      availableSeatNumbers.includes(i + offset)
        ? "unavailable-seat"
        : "available-seat"
    }">
        ${i + offset}
        </div>
        `;
  }
  const grid = htmlToElement(
    `
        <div class="booking-grid" style="${css}">
            ${boxMarkup}
        </div>
        `
  );
  document.querySelector("#booker-grid-holder").appendChild(grid);
  document
    .querySelectorAll(".available-seat")
    .forEach((el) => el.addEventListener("click", handleClickOnAvailableSeat));
};
const handleClickOnAvailableSeat = (e) => {
  e.target.classList.toggle("selected-seat");
  if (Array.from(e.target.classList).includes("selected-seat")) {
    selectedSeats.push(+e.target.innerText);
  } else {
    // add to seleceted seats
    selectedSeats = selectedSeats.filter((s) => s !== +e.target.innerText);
  }
  if (selectedSeats.length > 0) {
    if (bookTicketBtn.classList.contains("v-none")) {
      bookTicketBtn.classList.toggle("v-none");
    }
  } else {
    if (!bookTicketBtn.classList.contains("v-none")) {
      bookTicketBtn.classList.toggle("v-none");
    }
  }
};
const handleBookTicket = (e) => {
  renderConfirmPurchaseForm(selectedSeats);
};
const handleConfirmPurchase = (e) => {};
renderMovieList();

