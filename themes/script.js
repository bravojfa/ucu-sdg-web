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

// Create the navigation content with dynamic year dropdown
function createNavigation() {
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
            <div class="themes-links">
              <a href="javascript:void(0)" class="themepick">Themes</a>
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
          <a href="#">Themes</a>
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
  const availableYears = createNavigation();

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
