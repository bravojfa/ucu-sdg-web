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
        <a href="../../index.html">
          <img src="../images/ucu-logo.png" alt="UCU Logo" />
        </a>

        <section class="desktop">
          <a href="../../index.html">Home</a>
          <a href="../../ucu-smart-eco-campus.html">UCU Smart Eco Campus</a>
          <a href="#">Projects</a>
          <a href="#">About</a>
        </section>

        <section class="mobile">
          <button>menu</button>
        </section>
      </header>

      <section class="links">
        <a href="../../index.html">Home</a>
        <a href="../../ucu-smart-eco-campus.html">UCU Smart Eco Campus</a>
        <a href="#">Projects</a>
        <a href="#">About</a>
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
