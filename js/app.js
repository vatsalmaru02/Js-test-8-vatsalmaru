const USER_API = "https://randomuser.me/api/";
const UNIVERSITY_API = "http://universities.hipolabs.com/search?country=";

const avatar = document.querySelector("#avatar");
const nameEl = document.querySelector("#name");
const emailEl = document.querySelector("#email");
const phoneEl = document.querySelector("#phone");
const usernameEl = document.querySelector("#username");

let universities = [];
let filtered = [];
let currentPage = 1;
const perPage = 6;

fetch(USER_API)
  .then((res) => res.json())
  .then((data) => {
    const user = data.results[0];

    avatar.src = user.picture.large;
    nameEl.textContent = `${user.name.title} ${user.name.first} ${user.name.last}`;
    emailEl.textContent = user.email;
    phoneEl.textContent = user.phone;
    usernameEl.textContent = user.login.username;

    fullName.textContent = `${user.name.first} ${user.name.last}`;
    gender.textContent = user.gender;
    dob.textContent = user.dob.date.split("T")[0];
    age.textContent = user.dob.age;
    nationality.textContent = user.nat;

    contactEmail.textContent = user.email;
    contactPhone.textContent = user.phone;
    cell.textContent = user.cell;

    street.textContent = `${user.location.street.number} ${user.location.street.name}`;
    city.textContent = user.location.city;
    state.textContent = user.location.state;
    country.textContent = user.location.country;
    postcode.textContent = user.location.postcode;

    accUsername.textContent = user.login.username;
    uuid.textContent = user.login.uuid;

    fetchUniversities(user.location.country);
  });

function fetchUniversities(country) {
  fetch(UNIVERSITY_API + country)
    .then((res) => res.json())
    .then((data) => {
      universities = data;
      filtered = data;
      renderUniversities();
    });
}

function renderUniversities() {
  universities.innerHTML = "";

  const start = (currentPage - 1) * perPage;
  const pageData = filtered.slice(start, start + perPage);

  pageData.forEach((u) => {
    universityList.innerHTML += `
      <div class="info-card">
        <h3>${u.name}</h3>
        <p>${u.country}</p>
        <a href="${u.web_pages[0]}" target="_blank">Visit Website</a>
      </div>
    `;
  });

  renderPagination();
}

function renderPagination() {
  pagination.innerHTML = "";
  const pages = Math.ceil(filtered.length / perPage);

  for (let i = 1; i <= pages; i++) {
    pagination.innerHTML += `
      <button class="page-btn ${i === currentPage ? "active" : ""}"
        onclick="changePage(${i})">${i}</button>
    `;
  }
}

sort.addEventListener("change", (e) => {
  filtered.sort((a, b) =>
    e.target.value === "asc"
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name)
  );
  renderUniversities();
});

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document
      .querySelectorAll(".tab, .tab-content")
      .forEach((el) => el.classList.remove("active"));

    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.add("active");
  });
});
