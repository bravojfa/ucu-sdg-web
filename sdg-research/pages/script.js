// This file aggregates all yearly research data
const researchData = {
  1: batch1,
  2: batch2,
  3: batch3,
};

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

// Create the navigation content without year selector
function createNavigation() {
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

function slugify(str) {
  if (!str) return "";
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Function to get SDG number from current page filename
function getCurrentSDGNumber() {
  const filename = window.location.pathname.split("/").pop();
  const match = filename.match(/sdg(\d+)\.html/);
  return match ? parseInt(match[1]) : null;
}

// Function to render ALL research across all years for a specific SDG
function renderAllResearchForSDG(sdgNumber) {
  const container = document.querySelector(".container");
  if (!container) return;

  container.innerHTML = "";

  // Get all years sorted in descending order
  const years = Object.keys(researchData).sort((a, b) => b - a);

  // Collect all research from all years that match the SDG
  let allFilteredResearch = [];

  years.forEach((year) => {
    const yearData = researchData[year];
    if (yearData && yearData.length > 0) {
      const filteredResearch = yearData.filter((research) =>
        research.sdgs.some((sdg) => sdg.number === sdgNumber)
      );

      // Add year information to each research item
      filteredResearch.forEach((research) => {
        allFilteredResearch.push({
          ...research,
          year: year,
        });
      });
    }
  });

  // Check if any research was found
  if (allFilteredResearch.length === 0) {
    container.innerHTML = `<p>No research available for SDG ${sdgNumber}.</p>`;
    return;
  }

  // Render all filtered research
  allFilteredResearch.forEach((research) => {
    const section = document.createElement("section");
    section.className = "content";

    // Create unique ID with year
    const projectSlug = slugify(research.title);
    const projectId = `${research.year}-${projectSlug}`;
    section.id = projectId;

    // Research Header
    const header = `
      <div class="research-header">
        <h1>
          <a href="#${projectId}" class="project-title-link">${research.title}</a>
        </h1>
        <div class="authors">${research.authors}</div>
      </div>
    `;

    // Filter SDG cards to show only the matching SDG
    const sdgsToShow = research.sdgs.filter((sdg) => sdg.number === sdgNumber);

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

// Initialize on page load
window.addEventListener("load", () => {
  const currentSDG = getCurrentSDGNumber();

  if (currentSDG) {
    renderAllResearchForSDG(currentSDG);

    // Handle URL hash for direct linking to specific research
    const urlHash = window.location.hash.substring(1);
    if (urlHash) {
      setTimeout(() => {
        try {
          const targetElement = document.getElementById(urlHash);
          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        } catch (e) {
          console.warn("Could not scroll to element:", urlHash, e);
        }
      }, 100);
    }
  }
});
