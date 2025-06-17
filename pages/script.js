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
  // Available years for SDG content
  const availableYears = ["2023", "2024"];

  // Create year dropdown items HTML
  const yearOptions = availableYears
    .map(
      (year) =>
        `<a href="#" class="year-option" data-year="${year}">${year}</a>`
    )
    .join("");

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
            <div class="dropdown-content">
              ${yearOptions}
            </div>
          </div>
          <a href="#">About</a>
          <div class="dropdown">
            <button class="dropbtn">Select Year ▼</button>
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
        <a href="../ucu-smart-eco-campus.html">UCU Smart Eco Campus</a>
        <a href="#">Themes</a>
        <a href="#">About</a>
        <div class="mobile-dropdown">
          <button href="#" class="dropbtn">Select Year ▼</button>
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

  // Create no projects indicator element if it doesn't exist
  let noProjectsIndicator = document.getElementById("no-projects-indicator");
  if (!noProjectsIndicator) {
    noProjectsIndicator = document.createElement("div");
    noProjectsIndicator.id = "no-projects-indicator";
    noProjectsIndicator.className = "no-projects-message";
    noProjectsIndicator.innerHTML = `
      <div class="message-content">
        <img src="../images/sdg-logo.png" alt="Information" onerror="this.src='../images/sdg-logo.png'; this.style.opacity='0.4';">
      </div>
    `;

    // Insert after the divider section
    const dividerSection = document.querySelector("no-project");
    if (dividerSection) {
      dividerSection.parentNode.insertBefore(
        noProjectsIndicator,
        dividerSection.nextSibling
      );
    } else {
      // Fallback - add to main
      const mainElement = document.querySelector("main");
      if (mainElement) {
        mainElement.appendChild(noProjectsIndicator);
      }
    }

    // Initially hide it
    noProjectsIndicator.style.display = "none";
  }

  // MODIFIED FUNCTION: Updated to show indicator when no projects are available for selected year
  function displayContentForYear(selectedYear) {
    console.log("Displaying content for year:", selectedYear);

    // Get all project sections
    const projectSections = document.querySelectorAll(".project");

    // Check if any project has the data-year attribute
    const hasDataYearAttributes = Array.from(projectSections).some((section) =>
      section.hasAttribute("data-year")
    );

    let visibleProjects = 0;

    // If no project has data-year attribute, show all projects
    if (!hasDataYearAttributes) {
      projectSections.forEach((section) => {
        section.style.display = "block"; // Show all projects
        visibleProjects++;
      });
    } else {
      // Show only projects with matching data-year attribute
      projectSections.forEach((section) => {
        const projectYear = section.getAttribute("data-year");
        if (projectYear === selectedYear) {
          section.style.display = "block";
          visibleProjects++;
        } else {
          section.style.display = "none";
        }
      });
    }

    // Show or hide the no projects indicator
    const noProjectsIndicator = document.getElementById(
      "no-projects-indicator"
    );
    if (noProjectsIndicator) {
      if (visibleProjects === 0) {
        noProjectsIndicator.style.display = "block";
      } else {
        noProjectsIndicator.style.display = "none";
      }
    }

    // Update dropdown button text
    const dropbtn = document.querySelector(".dropbtn");
    const dropdownTitle = document.querySelector(".dropdown-title");

    if (dropbtn) dropbtn.textContent = `${selectedYear} ▼`;
    if (dropdownTitle) dropdownTitle.textContent = `${selectedYear} ▼`;

    // Store the selection in localStorage for persistence across page loads
    localStorage.setItem("selectedSDGYear", selectedYear);
  }

  // Clear any previous event listeners by using delegated events
  document.addEventListener("click", function (e) {
    // Check if clicked element is a year option
    if (e.target && e.target.classList.contains("year-option")) {
      e.preventDefault();
      const selectedYear = e.target.dataset.year;
      displayContentForYear(selectedYear);

      // Close the mobile menu if it's open
      const menuLinks = document.querySelector(".links");
      if (menuLinks && window.g.etComputedStyle(menuLinks).display === "grid") {
        menuLinks.style.display = "none";
      }
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

  // Initialize the display based on stored preference or default to the oldest year
  const storedYear = localStorage.getItem("selectedSDGYear");

  // Use stored year if valid, otherwise use the oldest year
  const initialYear =
    storedYear && availableYears.includes(storedYear)
      ? storedYear
      : availableYears[0];

  console.log("Initial year:", initialYear);

  // Initial display
  displayContentForYear(initialYear);
});

// PDF Viewer Script
let pdfDoc = null,
  pageNum = 1,
  pageIsRendering = false,
  pageNumIsPending = null,
  scale = 2.0; // Increased default scale for better readability

const canvas = document.querySelector("#pdf-render");
const ctx = canvas.getContext("2d");
const modal = document.getElementById("pdfModal");
const loadingIndicator = document.getElementById("loading-indicator");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const zoomIn = document.getElementById("zoom-in");
const zoomOut = document.getElementById("zoom-out");
const zoomLevel = document.getElementById("zoom-level");

function openModal(pdfUrl) {
  modal.style.display = "flex";

  // Extract filename from URL to set as title
  const fileName = pdfUrl.split("/").pop();
  document.getElementById("pdf-title").textContent = fileName;

  // Show loading indicator
  loadingIndicator.style.display = "block";

  // Disable buttons until document is loaded
  prevButton.disabled = true;
  nextButton.disabled = true;

  // Reset zoom level display
  updateZoomLevelDisplay();

  pdfjsLib
    .getDocument(pdfUrl)
    .promise.then((pdfDoc_) => {
      pdfDoc = pdfDoc_;
      document.querySelector("#page-count").textContent = pdfDoc.numPages;

      // Update button states
      updateNavButtons();

      renderPage(pageNum);
    })
    .catch((error) => {
      console.error("Error loading PDF:", error);
      loadingIndicator.style.display = "none";
      alert("Failed to load the PDF document. Please try again later.");
    });
}

function closeModal() {
  modal.style.display = "none";
  pdfDoc = null;
  pageNum = 1;
  document.querySelector("#page-num").textContent = "0";
  document.querySelector("#page-count").textContent = "0";
}

function renderPage(num) {
  pageIsRendering = true;
  loadingIndicator.style.display = "block";

  pdfDoc.getPage(num).then((page) => {
    const viewport = page.getViewport({ scale });

    // Set canvas size dynamically
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const renderContext = { canvasContext: ctx, viewport: viewport };
    const renderTask = page.render(renderContext);

    renderTask.promise.then(() => {
      pageIsRendering = false;
      loadingIndicator.style.display = "none";

      if (pageNumIsPending !== null) {
        renderPage(pageNumIsPending);
        pageNumIsPending = null;
      }
    });
  });

  document.querySelector("#page-num").textContent = num;
  updateNavButtons();
}

function updateNavButtons() {
  if (!pdfDoc) return;

  prevButton.disabled = pageNum <= 1;
  nextButton.disabled = pageNum >= pdfDoc.numPages;
}

function queueRenderPage(num) {
  if (pageIsRendering) {
    pageNumIsPending = num;
  } else {
    renderPage(num);
  }
}

function updateZoomLevelDisplay() {
  zoomLevel.textContent = Math.round(scale * 50) + "%";
}

// Event listeners
prevButton.addEventListener("click", () => {
  if (pageNum > 1) {
    pageNum--;
    queueRenderPage(pageNum);
  }
});

nextButton.addEventListener("click", () => {
  if (pageNum < pdfDoc.numPages) {
    pageNum++;
    queueRenderPage(pageNum);
  }
});

// Zoom controls
zoomIn.addEventListener("click", () => {
  if (scale < 5) {
    // Maximum zoom level
    scale += 0.25;
    updateZoomLevelDisplay();
    queueRenderPage(pageNum);
  }
});

zoomOut.addEventListener("click", () => {
  if (scale > 0.5) {
    // Minimum zoom level
    scale -= 0.25;
    updateZoomLevelDisplay();
    queueRenderPage(pageNum);
  }
});

// Add keyboard navigation support
document.addEventListener("keydown", (e) => {
  if (modal.style.display !== "flex") return;

  if (e.key === "ArrowLeft" && !prevButton.disabled) {
    prevButton.click();
  } else if (e.key === "ArrowRight" && !nextButton.disabled) {
    nextButton.click();
  } else if (e.key === "Escape") {
    closeModal();
  } else if (e.key === "+" || e.key === "=") {
    zoomIn.click();
  } else if (e.key === "-") {
    zoomOut.click();
  }
});
