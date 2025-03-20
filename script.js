window.addEventListener("load", () => {
  let hero = document.querySelector("#hero");
  hero.classList.add("show");
});

let year = document.getElementById("year");
year.innerText = new Date().getFullYear();

let navigation = document.querySelector(".navigation");
let navigationContent = document.createElement("section");

navigationContent.innerHTML = `
      <header>
        <a href="index.html">
          <img src="images/ucu-logo.png" alt="UCU Logo" />
        </a>

        <section class="desktop">
          <a href="index.html">Home</a>
          <a href="ucu-smart-eco-campus.html">UCU Smart Eco Campus</a>
          <a href="#">Projects</a>
          <a href="#">About</a>
          <div class="dropdown">
            <button class="dropbtn">Select Year ▼</button>
            <div class="dropdown-content">
              <a href="#">2023</a>
              <a href="#">2024</a>
              <a href="#">2025</a>
            </div>
          </div>
        </section>

        <section class="mobile">
          <button>menu</button>
        </section>
      </header>

      <section class="links">
        <a href="index.html">Home</a>
        <a href="ucu-smart-eco-campus.html">UCU Smart Eco Campus</a>
        <a href="#">Projects</a>
        <a href="#">About</a>
        <div class="mobile-dropdown">
          <a href="#" class="dropdown-title">Select Year ▼</a>
          <div class="mobile-dropdown-content">
            <a href="#">2023</a>
            <a href="#">2024</a>
            <a href="#">2025</a>
          </div>
        </div>
      </section>
`;

navigation.appendChild(navigationContent);

let showMenu = document.querySelector(".mobile button");
let menuLinks = document.querySelector(".links");

showMenu.onclick = () => {
  if (menuLinks.style.display === "grid") {
    menuLinks.style.display = "none";
  } else {
    menuLinks.style.display = "grid";
  }
};

// Add this to your existing script.js file
document.addEventListener("DOMContentLoaded", () => {
  // Mobile dropdown functionality
  const mobileDropdown = document.querySelector(".mobile-dropdown");
  const dropdownTitle = document.querySelector(".dropdown-title");

  if (dropdownTitle) {
    dropdownTitle.addEventListener("click", (e) => {
      e.preventDefault();
      mobileDropdown.classList.toggle("active");
    });
  }

  // Optional: Add functionality to update the selected year
  const dropdownLinks = document.querySelectorAll(
    ".dropdown-content a, .mobile-dropdown-content a"
  );
  const dropbtn = document.querySelector(".dropbtn");
  const dropdownTitle2 = document.querySelector(".dropdown-title");

  dropdownLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const selectedYear = e.target.textContent;
      if (dropbtn) dropbtn.textContent = `${selectedYear} ▼`;
      if (dropdownTitle2) dropdownTitle2.textContent = `${selectedYear} ▼`;
      // Add your year selection logic here
      // For example, you might want to redirect to a year-specific page
      // or update content based on the selected year
    });
  });
});
