// This file aggregates all yearly research data
const researchData = {
  2022: research2022,
  2023: research2023,
  2024: research2024,
};

// Function to render research for a specific year
function renderResearch(year) {
  const container = document.querySelector(".container");
  if (!container) return;

  container.innerHTML = ""; // Clear existing content

  const yearData = researchData[year];
  if (!yearData || yearData.length === 0) {
    container.innerHTML = "<p>No research available for this year.</p>";
    return;
  }

  yearData.forEach((research) => {
    const section = document.createElement("section");
    section.className = "content";

    // Research Header
    const header = `
      <div class="research-header">
        <h1>${research.title}</h1>
        <div class="authors">${research.authors}</div>
      </div>
    `;

    // SDG Cards
    const sdgCards = research.sdgs
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
