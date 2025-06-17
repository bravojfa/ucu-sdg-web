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
  // Log all section classes to help debug
  console.log("All sections on page:");
  document.querySelectorAll("section").forEach((section) => {
    console.log(section.className);
  });

  // Detect available SDG years from the HTML structure
  // Check both for "sdg-YYYY" and "sdg-YYYY" (with any other classes)
  const availableYears = [];

  document.querySelectorAll("section").forEach((section) => {
    const classes = section.className.split(" ");

    for (const cls of classes) {
      const yearMatch = cls.match(/sdg-(\d{4})/);
      if (yearMatch) {
        availableYears.push(yearMatch[1]);
        console.log(`Found year section: ${yearMatch[1]} in class "${cls}"`);
      }
    }
  });

  console.log("Detected years:", availableYears);

  // If no years found, use hardcoded defaults from original HTML
  if (availableYears.length === 0) {
    console.log("No dynamic years found, using defaults");
    availableYears.push("2023", "2024");
  }

  // Sort years in ascending order (oldest first)
  availableYears.sort((a, b) => a - b);

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
        <a href="index.html">
          <img src="images/ucu-logo.png" alt="UCU Logo" />
        </a>

        <section class="desktop">
          <a href="index.html">Home</a>
          <a href="ucu-smart-eco-campus.html">UCU Smart Eco Campus</a>
          <a href="#">Themes</a>
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
        <a href="index.html">Home</a>
        <a href="ucu-smart-eco-campus.html">UCU Smart Eco Campus</a>
        <a href="#">Themes</a>
        <a href="#">About</a>
        <div class="mobile-dropdown">
          <a href="#" class="dropdown-title">Select Year ▼</a>
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
    console.warn("No SDG year sections found in the HTML");
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

  // Function to show SDGs for selected year and hide others
  function displaySDGsForYear(selectedYear) {
    console.log("Displaying SDGs for year:", selectedYear);

    // Get all sections that might contain SDG content for different years
    const sdgSections = {};

    document.querySelectorAll("section").forEach((section) => {
      const classes = section.className.split(" ");

      for (const cls of classes) {
        const yearMatch = cls.match(/sdg-(\d{4})/);
        if (yearMatch) {
          sdgSections[yearMatch[1]] = section;
        }
      }
    });

    console.log("Found SDG sections for years:", Object.keys(sdgSections));

    // Hide all SDG sections first
    Object.values(sdgSections).forEach((section) => {
      section.style.display = "none";
    });

    // Show only the selected year's SDGs
    if (sdgSections[selectedYear]) {
      sdgSections[selectedYear].style.display = "grid";
      console.log(`Displaying section for year ${selectedYear}`);
    } else {
      console.warn(`Section for year ${selectedYear} not found`);
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
      displaySDGsForYear(selectedYear);

      // Close the mobile menu if it's open
      const menuLinks = document.querySelector(".links");
      if (menuLinks && window.getComputedStyle(menuLinks).display === "grid") {
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
  console.log("Available years:", availableYears);

  // Initial display
  displaySDGsForYear(initialYear);
});
