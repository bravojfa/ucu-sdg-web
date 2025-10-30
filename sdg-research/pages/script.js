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
          <a href="../index.html">BACK TO SDG RESEARCH</a>
        </section>
        
        <section class="mobile">
          <a href="../index.html">SDG RESEARCH</a>
        </section>
      </header>
  `;

  if (navigation) {
    navigation.appendChild(navigationContent);
  }
}

createNavigation();

// Function to get SDG number from current page filename
function getCurrentSDGNumber() {
  const filename = window.location.pathname.split("/").pop();
  const match = filename.match(/sdg(\d+)\.html/);
  return match ? parseInt(match[1]) : null;
}

// Function to render research for a specific year, filtered by SDG number
function renderResearch(year, sdgNumber = null) {
  const container = document.querySelector(".container");
  if (!container) return;

  container.innerHTML = ""; // Clear existing content

  const yearData = researchData[year];
  if (!yearData || yearData.length === 0) {
    container.innerHTML = "<p>No research available for this year.</p>";
    return;
  }

  // Filter research based on SDG number if provided
  const filteredResearch = sdgNumber
    ? yearData.filter((research) =>
        research.sdgs.some((sdg) => sdg.number === sdgNumber)
      )
    : yearData;

  if (filteredResearch.length === 0) {
    container.innerHTML = `<p>No research available for SDG ${sdgNumber} in ${year}.</p>`;
    return;
  }

  filteredResearch.forEach((research) => {
    const section = document.createElement("section");
    section.className = "content";

    // Research Header
    const header = `
      <div class="research-header">
        <h1>${research.title}</h1>
        <div class="authors">${research.authors}</div>
      </div>
    `;

    // Filter SDG cards to show only the matching SDG if on a specific SDG page
    const sdgsToShow = sdgNumber
      ? research.sdgs.filter((sdg) => sdg.number === sdgNumber)
      : research.sdgs;

    // SDG Cards
    const sdgCards = sdgsToShow
      .map(
        (sdg) => `
      <div class="sdg-card sdg-${sdg.number}">
        <div class="sdg-header">
          <span class="sdg-icon">${sdg.icon}</span>
          <span class="sdg-title">SDG ${sdg.number}: ${sdg.title}</span>
        </div>
        <div class="sdg-target">${sdg.targets}</div>
        <div class="sdg-content">
          ${sdg.content.map((p) => `<p>${p}</p>`).join("")}
        </div>
        <div class="sdg-alignment">
          <h4>🧩 How it aligns:</h4>
          <p>${sdg.alignment}</p>
        </div>
      </div>
    `
      )
      .join("");

    // Abstract
    const abstract = `
      <div class="abstract-section">
        <h2>Abstract</h2>
        ${research.abstract.map((p) => `<p>${p}</p>`).join("")}
      </div>
    `;

    section.innerHTML = `
      ${header}
      <div class="sdg-grid">${sdgCards}</div>
      ${abstract}
    `;

    container.appendChild(section);
  });
}

// Year selector functionality
function createYearSelector() {
  const years = Object.keys(researchData).sort((a, b) => b - a);
  const navigation = document.querySelector(".navigation header");

  if (!navigation) return;

  const yearSelector = document.createElement("select");
  yearSelector.id = "yearSelector";
  yearSelector.className = "year-selector";

  years.forEach((year) => {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    yearSelector.appendChild(option);
  });

  // Get current SDG number from page
  const currentSDG = getCurrentSDGNumber();

  yearSelector.addEventListener("change", (e) => {
    renderResearch(e.target.value, currentSDG);
  });

  navigation.appendChild(yearSelector);

  // Render current year by default with SDG filter
  renderResearch(years[0], currentSDG);
}

// Initialize on page load
window.addEventListener("load", () => {
  createYearSelector();
});
