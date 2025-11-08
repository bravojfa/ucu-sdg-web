window.addEventListener("load", () => {
  let hero = document.querySelector("#hero");
  if (hero) {
    hero.classList.add("show");
  }
});

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
        <a href="../index.html">
          <img src="../../images/ucu-logo.png" alt="UCU Logo" />
        </a>
        <section class="desktop">
          <a href="../index.html">BACK TO SDG REPORTS</a>
        </section>
        
        <section class="mobile">
          <a href="../index.html">SDG REPORTS</a>
        </section>
      </header>
  `;

  if (navigation) {
    navigation.appendChild(navigationContent);
  }
}

createNavigation();
