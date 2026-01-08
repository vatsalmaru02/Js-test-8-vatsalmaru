const { createElement } = require("react");

const APP_CONFIG = {
  api: "https://randomuser.me/api/",
  tabs: [
    { name: "Profile" },
    {
      name: "University",
      api: "http://universities.hipolabs.com/search?country=SELECTED_USER_COUNTRY",
    },
  ],
};

let currentUser = null;
let universities = [];
let filtered = [];
let currentPage = 1;
let isLoading = false;
const perPage = 6;

document.addEventListener("DOMContentLoaded", init);

function init() {
  injectLoaderStyles();
  showGlobalLoader();
  try {
    fetch(APP_CONFIG.api)
      .then((res) => res.json())
      .then((data) => {
        currentUser = data.results[0];
        renderHeader();
        buildTabs();
        activateTab(APP_CONFIG.tabs[0].name);
        hideGlobalLoader();
      });
  } catch (error) {
    // show error message in the ui to user.
    console.error("Error fetching user data:", error);
    createElement("div", null, "Failed to load user data.");
    hideGlobalLoader();
  } finally {
    hideGlobalLoader();
  }
}

function renderHeader() {
  document.getElementById("avatar").src = currentUser.picture.large;

  document.getElementById(
    "name"
  ).textContent = `${currentUser.name.title} ${currentUser.name.first} ${currentUser.name.last}`;

  document.getElementById("email").textContent = currentUser.email;
  document.getElementById("phone").textContent = currentUser.phone;
  document.getElementById("username").textContent = currentUser.login.username;
}

function buildTabs() {
  const tabsEl = document.querySelector(".tabs");
  tabsEl.innerHTML = "";

  APP_CONFIG.tabs.forEach((tab, index) => {
    const btn = document.createElement("button");
    btn.className = `tab ${index === 0 ? "active" : ""}`;
    btn.textContent = tab.name;
    btn.onclick = () => activateTab(tab.name);
    tabsEl.appendChild(btn);

    const section = document.createElement("section");
    section.id = tab.name;
    section.className = `tab-content ${index === 0 ? "active" : ""}`;
    document.querySelector(".container").appendChild(section);
  });
}

function activateTab(tabName) {
  document
    .querySelectorAll(".tab")
    .forEach((t) => t.classList.remove("active"));
  document
    .querySelectorAll(".tab-content")
    .forEach((c) => c.classList.remove("active"));

  document
    .querySelectorAll(".tab")
    .forEach((t) => t.textContent === tabName && t.classList.add("active"));

  const section = document.getElementById(tabName);
  section.classList.add("active");

  const tabConfig = APP_CONFIG.tabs.find((t) => t.name === tabName);

  if (tabName === "Profile") renderProfile(section);
  else if (tabName === "University") renderUniversity(section);
  else if (tabConfig.api) renderGenericApi(section, tabConfig.api);
}

function renderProfile(el) {
  const user = currentUser;

  el.innerHTML = `
    <div class="card-grid">
      <div class="info-card">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div class="icon-container">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
          </div>
          <h3 class = "info-card--title">Personal Information</h3>
        </div>
        <p class = "info-card--details"><span>Full Name:</span><b>${
          user.name.first
        } ${user.name.last}</b></p>
        <p class = "info-card--details"><span>Gender:</span><b>${
          user.gender
        }</b></p>
        <p class = "info-card--details"><span>DOB:</span><b>${
          user.dob.date.split("T")[0]
        }</b></p>
        <p class = "info-card--details"><span>Age:</span><b>${
          user.dob.age
        }</b></p>
        <p class = "info-card--details"><span>Nationality:</span><b>${
          user.nat
        }</b></p>
      </div>

      <div class="info-card">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div class="icon-container">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
          </svg>

          </div>
          <h3 class = "info-card--title">Contact Information</h3>
        </div>
        <p class = "info-card--details"><span>Email:</span><b>${
          user.email
        }</b></p>
        <p class = "info-card--details"><span>Phone:</span><b>${
          user.phone
        }</b></p>
        <p class = "info-card--details"><span>Cell:</span><b>${
          user.cell
        }</b></p>
      </div>

      <div class="info-card">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div class="icon-container">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
          <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>

          </div>
          <h3 class = "info-card--title">Address</h3>
        </div>
        <p class = "info-card--details"><span>Street:</span><b>${
          user.location.street.number
        } ${user.location.street.name}</b></p>
        <p class = "info-card--details"><span>City:</span><b>${
          user.location.city
        }</b></p>
        <p class = "info-card--details"><span>State:</span><b>${
          user.location.state
        }</b></p>
        <p class = "info-card--details"><span>Country:</span><b>${
          user.location.country
        }</b></p>
        <p class = "info-card--details"><span>Postcode:</span><b>${
          user.location.postcode
        }</b></p>
      </div>

      <div class="info-card">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div class="icon-container">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
        <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
      </svg>

      </div>
          <h3 class = "info-card--title">Account Information</h3>
        </div>
        <p class = "info-card--details"><span>Username:</span><b>${
          user.login.username
        }</b></p>
        <p class = "info-card--details uuid"><span>UUID:</span><b>${
          user.login.uuid
        }</b></p>
      </div>
    </div>
  `;
}

function renderUniversity(el) {
  el.innerHTML = `
    <div class="controls">
      <input id="search" placeholder="Search university" />
      <select id="sort">
        <option value="asc">Sort A–Z</option>
        <option value="desc">Sort Z–A</option>
      </select>
    </div>

    <div class="card-grid" id="universityList">
      <div class="loader-container"><span class="loader"></span></div>
    </div>
    <div class="pagination" id="pagination"></div>
  `;

  const url = APP_CONFIG.tabs
    .find((t) => t.name === "University")
    .api.replace("SELECTED_USER_COUNTRY", currentUser.location.country);

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      universities = filtered = data;
      currentPage = 1;
      renderUniversities();
    });

  const search = document.getElementById("search");
  search.oninput = onSearch;

  const sort = document.getElementById("sort");
  sort.onchange = onSort;
}

function renderUniversities() {
  const list = document.getElementById("universityList");
  list.innerHTML = "";

  filtered
    .slice((currentPage - 1) * perPage, currentPage * perPage)
    .forEach((u) => {
      list.innerHTML += `
        <div class="info-card">
          <h3 class="info-card--title">${u.name}</h3>
          <p class = "info-card--details">${u.country}</p>
          <a class = "info-card--link" href="${u.web_pages[0]}" target="_blank">Visit Website</a>
        </div>
      `;
    });

  renderPagination();
}

function renderPagination() {
  const p = document.getElementById("pagination");
  p.innerHTML = "";

  const totalPages = Math.ceil(filtered.length / perPage);
  if (totalPages <= 1) return;

  const maxVisible = 3;

  if (currentPage > 1) {
    p.appendChild(createPageBtn("<", currentPage - 1));
  }

  let start = Math.max(1, currentPage);
  let end = Math.min(start + maxVisible - 1, totalPages);

  if (end === totalPages) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    p.appendChild(createPageBtn(i, i));
  }

  if (end < totalPages - 1) {
    const dots = document.createElement("span");
    dots.textContent = "...";
    dots.style.padding = "0 6px";
    p.appendChild(dots);
  }

  if (end < totalPages) {
    p.appendChild(createPageBtn(totalPages, totalPages));
  }

  if (currentPage < totalPages) {
    p.appendChild(createPageBtn(">", currentPage + 1));
  }
}

function createPageBtn(label, page) {
  const btn = document.createElement("button");
  btn.className = `page-btn ${page === currentPage ? "active" : ""}`;
  btn.textContent = label;
  btn.onclick = () => {
    currentPage = page;
    renderUniversities();
  };
  return btn;
}

function onSearch(e) {
  filtered = universities.filter((u) =>
    u.name.toLowerCase().includes(e.target.value.toLowerCase())
  );
  currentPage = 1;
  renderUniversities();
}

function onSort(e) {
  filtered.sort((a, b) =>
    e.target.value === "asc"
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name)
  );
  renderUniversities();
}

function renderGenericApi(el, api) {
  el.innerHTML = `<div class="loader-container"><span class="loader"></span></div>`;

  fetch(api)
    .then((res) => res.json())
    .then((data) => {
      el.innerHTML = `
          <div class="info-card">
            <h3>API Response</h3>
            <pre>${JSON.stringify(data, null, 2)}</pre>
          </div>
        `;
    });
}

function injectLoaderStyles() {
  const style = document.createElement("style");
  style.textContent = `
    .loader {
      width: 48px;
      height: 48px;
      border: 5px solid #FFF;
      border-bottom-color: transparent;
      border-radius: 50%;
      display: inline-block;
      box-sizing: border-box;
      animation: rotation 1s linear infinite;
    }

    @keyframes rotation {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .loader-container {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
      background: rgba(0, 0, 0, 0.7);
      border-radius: 8px;
      margin: 20px auto;
      width: fit-content;
    }
  `;
  document.head.appendChild(style);
}

function showGlobalLoader() {
  this.isLoading = true;
  const loader = document.createElement("div");
  loader.id = "global-loader";
  Object.assign(loader.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.8)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: "9999",
  });
  loader.innerHTML = '<span class="loader"></span>';
  document.body.appendChild(loader);
}

function hideGlobalLoader() {
  const loader = document.getElementById("global-loader");
  if (loader) loader.remove();
  this.isLoading = false;
}
