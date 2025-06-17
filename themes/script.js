// Base script functions remain the same
window.addEventListener("load", () => {
  let hero = document.querySelector("#hero");
  if (hero) {
    hero.classList.add("show");
  }
});

let year = document.getElementById("year");
if (year) {
  year.innerText = new Date().getFullYear();
}

// Clear any existing navigation content to prevent duplicates
let navigation = document.querySelector(".navigation");
if (navigation) {
  navigation.innerHTML = "";
}

// Function to get current page from URL
function getCurrentPage() {
  const path = window.location.pathname;
  const filename = path.split("/").pop().replace(".html", "");
  return filename;
}

// Create themes dropdown items HTML based on current page
function createThemesOptions() {
  const currentPage = getCurrentPage();
  const themes = [
    { key: "planet", label: "Planet", href: "planet.html" },
    { key: "people", label: "People", href: "people.html" },
    { key: "prosperity", label: "Prosperity", href: "prosperity.html" },
    { key: "peace", label: "Peace", href: "peace.html" },
    {
      key: "partnerships",
      label: "Partnerships",
      href: "partnerships.html",
    },
  ];

  return themes
    .map((theme) => {
      if (theme.key === currentPage) {
        // Current page - make it non-clickable and styled differently
        return `<span class="dropdown-current">${theme.label} (Current)</span>`;
      } else {
        // Other pages - normal clickable links
        return `<a href="${theme.href}">${theme.label}</a>`;
      }
    })
    .join("");
}

// Create the navigation content with dynamic year dropdown
function createNavigation() {
  const currentPage = getCurrentPage();
  const themesOptions = createThemesOptions();

  // Create navigation content
  const navigationContent = document.createElement("section");
  navigationContent.innerHTML = `
        <header>
          <a href="../index.html">
            <img src="../images/ucu-logo.png" alt="UCU Logo" />
          </a>
  
          <section class="desktop">
            <a href="../index.html">Home</a>
            <a href="../ucu-smart-eco-campus.html">UCU Smart Eco Campus</a>
            <div class="themes-dropdown">
              <button class="dropbtn">Themes ▼</button>
              <div class="dropdown-content">
                ${themesOptions}
              </div>
            </div>
            <a href="#">About</a>
          </section>
  
          <section class="mobile">
            <button>menu</button>
          </section>
        </header>
  
        <section class="links">
          <a href="../index.html">Home</a>
          <a href="../ucu-smart-eco-campus.html">UCU Smart Eco Campus</a>
          <div class="themes-dropdown">
            <button class="dropbtn">Themes ▼</button>
            <div class="dropdown-content">
              ${themesOptions}
            </div>
          </div>
          <a href="#">About</a>
        </section>
    `;

  if (navigation) {
    navigation.appendChild(navigationContent);
  }
}

// Make sure all DOM content is loaded before initializing
document.addEventListener("DOMContentLoaded", () => {
  // Initialize navigation
  createNavigation();

  let showMenu = document.querySelector(".mobile button");
  let menuLinks = document.querySelector(".links");

  if (showMenu && menuLinks) {
    showMenu.onclick = () => {
      if (menuLinks.style.display === "grid") {
        menuLinks.style.display = "none";
      } else {
        menuLinks.style.display = "grid";
      }
    };
  }

  // Clear any previous event listeners by using delegated events
  document.addEventListener("click", function (e) {
    // Close the mobile menu if it's open
    const menuLinks = document.querySelector(".links");
    if (menuLinks && window.getComputedStyle(menuLinks).display === "grid") {
      menuLinks.style.display = "none";
    }
  });

  // Add click handler for mobile dropdown toggle
  const mobileDropdownTitle = document.querySelector(".dropdown-title");
  if (mobileDropdownTitle) {
    mobileDropdownTitle.addEventListener("click", function (e) {
      e.preventDefault();
      const mobileDropdown = this.parentElement;
      if (mobileDropdown) {
        mobileDropdown.classList.toggle("active");
      }
    });
  }

  const questions = document.querySelectorAll(".content-title");
  questions.forEach((question) => {
    question.addEventListener("click", function () {
      const answer = this.nextElementSibling;
      answer.classList.toggle("active");
    });
  });
});
