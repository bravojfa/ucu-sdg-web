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
  // Create navigation content
  const navigationContent = document.createElement("section");
  navigationContent.innerHTML = `
      <header>
        <a href="index.html">
          <img src="../images/ucu-logo.png" alt="UCU Logo" />
        </a>
        <section class="title">
          <h3>SDG Reports</h3>
        </section>
        <section class="desktop">
          <a href="../index.html">Home</a>
        </section>
        
        <section class="mobile">
          <a href="../index.html">Home</a>
        </section>
      </header>
  `;

  if (navigation) {
    navigation.appendChild(navigationContent);
  }
}

// Initialize everything when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  // Initialize navigation
  createNavigation();
});
