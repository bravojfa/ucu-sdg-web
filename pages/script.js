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
