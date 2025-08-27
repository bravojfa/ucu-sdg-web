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

// Create the navigation content with dynamic year dropdown and themes dropdown
function createNavigation() {
  // Available years for SDG content - easily expandable for future years
  const availableYears = ["2023", "2024"]; // Add new years here

  // Create year dropdown items HTML
  const yearOptions = availableYears
    .map(
      (year) =>
        `<a href="#" class="year-option" data-year="${year}">${year}</a>`
    )
    .join("");

  // Create themes dropdown items HTML
  const themesOptions = `
    <a href="../themes/planet.html">Planet</a>
    <a href="../themes/people.html">People</a>
    <a href="../themes/prosperity.html">Prosperity</a>
    <a href="../themes/peace.html">Peace</a>
    <a href="../themes/partnerships.html">Partnerships</a>
  `;

  // Create navigation content
  const navigationContent = document.createElement("section");
  navigationContent.innerHTML = `
      <header>
        <a href="../index.html">
          <img src="../images/ucu-logo.png" alt="UCU Logo" />
        </a>

        <section class="desktop">
          <a href="../index.html">Home</a>
          <a href="#">SDG Reports</a>
          <a href="#">SDG Research</a>
          <a href="../ucu-smart-eco-campus.html">Smart Eco Campus</a>
          <div class="themes-dropdown">
            <button class="dropbtn">Themes ▼</button>
            <div class="dropdown-content">
              ${themesOptions}
            </div>
          </div>
          <a href="#">About</a>
          <div class="dropdown">
            <button class="dropbtn year-dropdown-btn">Select Year ▼</button>
            <div class="dropdown-content">
              ${yearOptions}
            </div>
          </div>
        </section>

        <section class="mobile">
          <button>menu</button>
        </section>
      </header>

      <section class="links">
        <a href="../index.html">Home</a>
        <a href="#">SDG Reports</a>
        <a href="#">SDG Research</a>
        <a href="../ucu-smart-eco-campus.html">Smart Eco Campus</a>
        <div class="themes-dropdown">
            <button class="dropbtn">Themes ▼</button>
            <div class="dropdown-content">
              ${themesOptions}
            </div>
        </div>
        <a href="#">About</a>
        <div class="mobile-dropdown">
          <a href="#" class="dropdown-title mobile-year-dropdown">Select Year ▼</a>
          <div class="mobile-dropdown-content">
            ${yearOptions}
          </div>
        </div>
      </section>
  `;

  if (navigation) {
    navigation.appendChild(navigationContent);
  }

  return availableYears;
}

// Make sure all DOM content is loaded before initializing
document.addEventListener("DOMContentLoaded", () => {
  // Initialize navigation
  const availableYears = createNavigation();

  if (!availableYears || availableYears.length === 0) {
    console.warn("No SDG year options available");
    return;
  }

  const articlesContainer = document.getElementById("articles-container");
  const noProjectsIndicator = document.getElementById("no-projects-indicator");
  let allData = {}; // Object to store data for all years
  let currentSelectedYear = null; // Track current selected year

  // Get SDG number from body data attribute
  const sdgNumber = document.body.dataset.sdg;

  if (!sdgNumber) {
    console.error("The data-sdg attribute is missing from the <body> tag.");
    return;
  }

  // Function to fetch data for a specific year with better error handling
  async function fetchYearData(year) {
    const jsonUrl = `sdg${sdgNumber}-${year}.json`;

    try {
      const response = await fetch(jsonUrl);
      if (!response.ok) {
        // If file doesn't exist, return empty data instead of throwing error
        if (response.status === 404) {
          console.warn(`No data file found for year ${year}: ${jsonUrl}`);
          return null;
        }
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const data = await response.json();
      allData[year] = data;
      return data;
    } catch (error) {
      console.error(`Error fetching SDG articles for ${year}:`, error);
      return null;
    }
  }

  // Function to render 1st-style articles (array format)
  function render1stLayout(articles) {
    articles.forEach((article) => {
      const articleElement = document.createElement("section");
      articleElement.className = `project`;
      articleElement.setAttribute("data-year", article.year);

      const paragraphs = article.content.map((p) => `<p>${p}</p>`).join("");

      articleElement.innerHTML = `
        <h1>${article.title}</h1>
        <section class="content ${article.layout}">
          ${
            article.layout === "left-img"
              ? `<img src="${article.image}" alt="${article.title}" onerror="this.style.display='none'" />`
              : ""
          }
          <section class="text">
            ${paragraphs}
            <section class="file">
              <button onclick="openModal('${article.documentUrl}')">
                READ FULL DOCUMENT
              </button>
            </section>
          </section>
          ${
            article.layout === "right-img"
              ? `<img src="${article.image}" alt="${article.title}" onerror="this.style.display='none'" />`
              : ""
          }
        </section>
      `;
      articlesContainer.appendChild(articleElement);
    });
  }

  // Function to render 2024-style content (array of objects with sections format)
  function render2ndLayout(dataArray) {
    // Check if dataArray is actually an array
    if (!Array.isArray(dataArray)) {
      console.error("Expected array but got:", typeof dataArray);
      return;
    }

    dataArray.forEach((data) => {
      // Validate that each item has the expected structure
      if (!data.sections || !Array.isArray(data.sections)) {
        console.warn(
          "Invalid data structure for item:",
          data.title || "Unknown"
        );
        return;
      }

      const articleElement = document.createElement("section");
      articleElement.className = `project`;
      articleElement.setAttribute("data-year", data.year);

      let sectionsHtml = "";

      data.sections.forEach((section) => {
        switch (section.type) {
          case "intro_paragraph":
            sectionsHtml += `<div class="intro-section">`;
            section.content.forEach((paragraph) => {
              sectionsHtml += `<p>${paragraph}</p>`;
            });
            sectionsHtml += `</div>`;
            break;

          case "aims_list":
            sectionsHtml += `
            <div class="aims-section">
              <h3>${section.title}</h3>
              <ul>
                ${section.items.map((item) => `<li>${item}</li>`).join("")}
              </ul>
            </div>
          `;
            break;

          case "standard_section":
            sectionsHtml += `
            <div class="standard-section">
              <h3>${section.title}</h3>
              ${section.content
                .map((paragraph) => `<p>${paragraph}</p>`)
                .join("")}
            </div>
          `;
            break;

          case "two_column":
            sectionsHtml += `
            <div class="two-column-section">
              <div class="column-container">
                ${section.columns
                  .map(
                    (column) => `
                  <div class="column">
                    <h4>${column.title}</h4>
                    ${column.content
                      .map((paragraph) => `<p>${paragraph}</p>`)
                      .join("")}
                  </div>
                `
                  )
                  .join("")}
              </div>
            </div>
          `;
            break;

          default:
            console.warn(`Unknown section type: ${section.type}`);
        }
      });

      articleElement.innerHTML = `
      <h1>${data.title}</h1>
      <section class="content single-article">
        <section class="text">
          ${sectionsHtml}
        </section>
      </section>
    `;

      articlesContainer.appendChild(articleElement);
    });
  }

  // Enhanced function to display content for a selected year with better loading states
  async function displayContentForYear(selectedYear) {
    // Show loading state
    articlesContainer.innerHTML =
      '<div class="loading-content">Loading content for ' +
      selectedYear +
      "...</div>";
    noProjectsIndicator.style.display = "none";

    // Update current selected year
    currentSelectedYear = selectedYear;

    // Check if we already have the data for this year
    let yearData = allData[selectedYear];

    // If we don't have the data, fetch it
    if (!yearData) {
      yearData = await fetchYearData(selectedYear);
    }

    // Clear loading state
    articlesContainer.innerHTML = "";

    // Check if we have any content for this year
    if (!yearData) {
      noProjectsIndicator.style.display = "block";
      updateDropdownText(selectedYear);
      return;
    }

    const hasContent = Array.isArray(yearData)
      ? yearData.length > 0
      : yearData.sections && yearData.sections.length > 0;

    if (!hasContent) {
      noProjectsIndicator.style.display = "block";
    } else {
      noProjectsIndicator.style.display = "none";

      // Render content based on data structure
      try {
        if (Array.isArray(yearData)) {
          // Check if it's 2023-style (simple objects) or 2024-style (objects with sections)
          if (yearData.length > 0 && yearData[0].sections) {
            // 2024-style data (array of objects with sections)
            render2ndLayout(yearData);
          } else {
            // 2023-style data (array of simple articles)
            render1stLayout(yearData);
          }
        } else {
          console.warn(`Unknown data structure for year ${selectedYear}`);
          noProjectsIndicator.style.display = "block";
        }
      } catch (error) {
        console.error(
          `Error rendering content for year ${selectedYear}:`,
          error
        );
        noProjectsIndicator.style.display = "block";
      }
    }

    updateDropdownText(selectedYear);
    // Save the selected year to localStorage with SDG-specific key
    localStorage.setItem(`selectedSDGYear_${sdgNumber}`, selectedYear);
  }

  // Enhanced helper function to update dropdown button text
  function updateDropdownText(selectedYear) {
    // Update desktop dropdown
    const desktopDropbtn = document.querySelector(".year-dropdown-btn");
    if (desktopDropbtn) {
      desktopDropbtn.textContent = `${selectedYear} ▼`;
    }

    // Update mobile dropdown
    const mobileDropdownTitle = document.querySelector(".mobile-year-dropdown");
    if (mobileDropdownTitle) {
      mobileDropdownTitle.textContent = `${selectedYear} ▼`;
    }

    // Update visual state of year options
    document.querySelectorAll(".year-option").forEach((option) => {
      if (option.dataset.year === selectedYear) {
        option.classList.add("active");
      } else {
        option.classList.remove("active");
      }
    });
  }

  // Enhanced mobile menu functionality
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

  // Create or update no projects indicator element
  function ensureNoProjectsIndicator() {
    let indicator = document.getElementById("no-projects-indicator");
    if (!indicator) {
      const newNoProjectsIndicator = document.createElement("div");
      newNoProjectsIndicator.id = "no-projects-indicator";
      newNoProjectsIndicator.className = "no-projects-message";
      newNoProjectsIndicator.innerHTML = `
        <div class="message-content">
          <img src="../images/sdg-logo.png" alt="Information" onerror="this.style.opacity='0.4';">
          <p style="text-transform: uppercase">
            No projects found for the selected year.
          </p>
        </div>
      `;

      const mainElement = document.querySelector("main");
      if (mainElement) {
        mainElement.appendChild(newNoProjectsIndicator);
      }
      newNoProjectsIndicator.style.display = "none";
      return newNoProjectsIndicator;
    }
    return indicator;
  }

  // Ensure no projects indicator exists
  ensureNoProjectsIndicator();

  // Enhanced event listener for year selection with better event delegation
  document.addEventListener("click", function (e) {
    if (e.target && e.target.classList.contains("year-option")) {
      e.preventDefault();
      const selectedYear = e.target.dataset.year;

      // Only change if it's a different year
      if (selectedYear !== currentSelectedYear) {
        displayContentForYear(selectedYear);
      }

      // Close mobile menu if open
      const menuLinks = document.querySelector(".links");
      if (menuLinks && window.getComputedStyle(menuLinks).display === "grid") {
        menuLinks.style.display = "none";
      }

      // Close mobile dropdown if open
      const mobileDropdown = document.querySelector(".mobile-dropdown");
      if (mobileDropdown && mobileDropdown.classList.contains("active")) {
        mobileDropdown.classList.remove("active");
      }
    }
  });

  // Enhanced mobile dropdown toggle functionality
  document.addEventListener("click", function (e) {
    if (e.target && e.target.classList.contains("mobile-year-dropdown")) {
      e.preventDefault();
      const mobileDropdown = e.target.parentElement;
      if (mobileDropdown) {
        mobileDropdown.classList.toggle("active");
      }
    }
  });

  // Close dropdowns when clicking outside
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".mobile-dropdown")) {
      document.querySelectorAll(".mobile-dropdown").forEach((dropdown) => {
        dropdown.classList.remove("active");
      });
    }
  });

  // Initialize with stored year or default to most recent available year
  function initializeYear() {
    const storedYear = localStorage.getItem(`selectedSDGYear_${sdgNumber}`);
    let initialYear;

    if (storedYear && availableYears.includes(storedYear)) {
      initialYear = storedYear;
    } else {
      // Default to the most recent year (last in array)
      initialYear = availableYears[availableYears.length - 1];
    }

    console.log("Initializing with year:", initialYear);
    displayContentForYear(initialYear);
  }

  // Start the application
  initializeYear();
});

// Enhanced PDF Viewer Script with better error handling
let pdfDoc = null,
  pageNum = 1,
  pageIsRendering = false,
  pageNumIsPending = null,
  scale = 2.0;

const canvas = document.querySelector("#pdf-render");
const ctx = canvas ? canvas.getContext("2d") : null;
const modal = document.getElementById("pdfModal");
const loadingIndicator = document.getElementById("loading-indicator");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const zoomIn = document.getElementById("zoom-in");
const zoomOut = document.getElementById("zoom-out");
const zoomLevel = document.getElementById("zoom-level");

function openModal(pdfUrl) {
  if (!modal) return;

  modal.style.display = "flex";
  const fileName = pdfUrl.split("/").pop();
  const titleElement = document.getElementById("pdf-title");
  if (titleElement) {
    titleElement.textContent = fileName;
  }

  if (loadingIndicator) {
    loadingIndicator.style.display = "block";
  }

  if (prevButton) prevButton.disabled = true;
  if (nextButton) nextButton.disabled = true;

  updateZoomLevelDisplay();

  pdfjsLib
    .getDocument(pdfUrl)
    .promise.then((pdfDoc_) => {
      pdfDoc = pdfDoc_;
      const pageCountElement = document.querySelector("#page-count");
      if (pageCountElement) {
        pageCountElement.textContent = pdfDoc.numPages;
      }
      updateNavButtons();
      renderPage(pageNum);
    })
    .catch((error) => {
      console.error("Error loading PDF:", error);
      if (loadingIndicator) {
        loadingIndicator.style.display = "none";
      }
      alert("Failed to load the PDF document. Please try again later.");
    });
}

function closeModal() {
  if (!modal) return;

  modal.style.display = "none";
  pdfDoc = null;
  pageNum = 1;

  const pageNumElement = document.querySelector("#page-num");
  const pageCountElement = document.querySelector("#page-count");
  if (pageNumElement) pageNumElement.textContent = "0";
  if (pageCountElement) pageCountElement.textContent = "0";
}

function renderPage(num) {
  if (!pdfDoc || !canvas || !ctx) return;

  pageIsRendering = true;
  if (loadingIndicator) {
    loadingIndicator.style.display = "block";
  }

  pdfDoc.getPage(num).then((page) => {
    const viewport = page.getViewport({ scale });
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const renderContext = { canvasContext: ctx, viewport: viewport };
    const renderTask = page.render(renderContext);

    renderTask.promise.then(() => {
      pageIsRendering = false;
      if (loadingIndicator) {
        loadingIndicator.style.display = "none";
      }

      if (pageNumIsPending !== null) {
        renderPage(pageNumIsPending);
        pageNumIsPending = null;
      }
    });
  });

  const pageNumElement = document.querySelector("#page-num");
  if (pageNumElement) {
    pageNumElement.textContent = num;
  }
  updateNavButtons();
}

function updateNavButtons() {
  if (!pdfDoc) return;

  if (prevButton) prevButton.disabled = pageNum <= 1;
  if (nextButton) nextButton.disabled = pageNum >= pdfDoc.numPages;
}

function queueRenderPage(num) {
  if (pageIsRendering) {
    pageNumIsPending = num;
  } else {
    renderPage(num);
  }
}

function updateZoomLevelDisplay() {
  if (zoomLevel) {
    zoomLevel.textContent = Math.round(scale * 50) + "%";
  }
}

// PDF control event listeners
if (prevButton) {
  prevButton.addEventListener("click", () => {
    if (pageNum > 1) {
      pageNum--;
      queueRenderPage(pageNum);
    }
  });
}

if (nextButton) {
  nextButton.addEventListener("click", () => {
    if (pageNum < pdfDoc.numPages) {
      pageNum++;
      queueRenderPage(pageNum);
    }
  });
}

if (zoomIn) {
  zoomIn.addEventListener("click", () => {
    if (scale < 5) {
      scale += 0.25;
      updateZoomLevelDisplay();
      queueRenderPage(pageNum);
    }
  });
}

if (zoomOut) {
  zoomOut.addEventListener("click", () => {
    if (scale > 0.5) {
      scale -= 0.25;
      updateZoomLevelDisplay();
      queueRenderPage(pageNum);
    }
  });
}

// Keyboard shortcuts for PDF viewer
document.addEventListener("keydown", (e) => {
  if (!modal || modal.style.display !== "flex") return;

  if (e.key === "ArrowLeft" && prevButton && !prevButton.disabled) {
    prevButton.click();
  } else if (e.key === "ArrowRight" && nextButton && !nextButton.disabled) {
    nextButton.click();
  } else if (e.key === "Escape") {
    closeModal();
  } else if (e.key === "+" || e.key === "=") {
    if (zoomIn) zoomIn.click();
  } else if (e.key === "-") {
    if (zoomOut) zoomOut.click();
  }
});
