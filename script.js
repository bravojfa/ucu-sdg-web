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

// Create the navigation content with themes dropdown only
function createNavigation() {
  // Create themes dropdown items HTML
  const themesOptions = `
    <a href="themes/planet.html">Planet</a>
    <a href="themes/people.html">People</a>
    <a href="themes/prosperity.html">Prosperity</a>
    <a href="themes/peace.html">Peace</a>
    <a href="themes/partnerships.html">Partnerships</a>
  `;

  // Create navigation content
  const navigationContent = document.createElement("section");
  navigationContent.innerHTML = `
      <header>
        <a href="index.html">
          <img src="images/ucu-logo.png" alt="UCU Logo" />
        </a>

        <section class="desktop">
          <a href="index.html">Home</a>
          <a href="#">SDG Reports</a>
          <a href="sdg-research/index.html">SDG Research</a>
          <a href="ucu-smart-eco-campus.html">Smart Eco Campus</a>
          <div class="themes-dropdown">
            <button class="dropbtn">Themes ▼</button>
            <div class="dropdown-content">
              ${themesOptions}
            </div>
          </div>
          <a href="#">News</a>
        </section>
        <section class="mobile">
          <button>menu</button>
        </section>
      </header>

      <section class="links">
        <a href="index.html">Home</a>
        <a href="#">SDG Reports</a>
        <a href="#">SDG Research</a>
        <a href="ucu-smart-eco-campus.html">Smart Eco Campus</a>
        <div class="mobile-themes-dropdown">
          <a href="#" class="dropdown-title">Themes ▼</a>
          <div class="mobile-dropdown-content">
            ${themesOptions}
          </div>
        </div>
        <a href="#">News</a>
      </section>
  `;

  if (navigation) {
    navigation.appendChild(navigationContent);
  }
}

// Initialize everything when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  // Initialize navigation
  createNavigation();

  // Mobile menu toggle functionality
  let showMenu = document.querySelector(".mobile button");
  let menuLinks = document.querySelector(".links");

  if (showMenu && menuLinks) {
    showMenu.addEventListener("click", () => {
      if (menuLinks.style.display === "grid") {
        menuLinks.style.display = "none";
      } else {
        menuLinks.style.display = "grid";
      }
    });
  }

  // Mobile themes dropdown functionality
  const mobileThemesTitle = document.querySelector(
    ".mobile-themes-dropdown .dropdown-title"
  );

  if (mobileThemesTitle) {
    mobileThemesTitle.addEventListener("click", function (e) {
      e.preventDefault();
      const mobileThemesDropdown = this.parentElement;
      if (mobileThemesDropdown) {
        mobileThemesDropdown.classList.toggle("active");
      }
    });
  }

  // Desktop themes dropdown - prevent default on button click
  const desktopThemesBtn = document.querySelector(".themes-dropdown .dropbtn");
  if (desktopThemesBtn) {
    desktopThemesBtn.addEventListener("click", function (e) {
      e.preventDefault();
    });
  }

  // Close mobile dropdown when clicking outside
  document.addEventListener("click", function (e) {
    const mobileDropdown = document.querySelector(".mobile-themes-dropdown");
    if (mobileDropdown && !mobileDropdown.contains(e.target)) {
      mobileDropdown.classList.remove("active");
    }
  });
});
