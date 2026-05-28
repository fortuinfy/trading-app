// =========================
// GLOBAL MODE
// =========================

let currentMode = "new";

// =========================
// INITIAL LOAD
// =========================

window.onload = function() {

  updateTimestamp();

  renderCandleInputs();

  setMode("new");

};

// =========================
// TIMESTAMP ENGINE
// =========================

function updateTimestamp() {

  const now = new Date();

  const dateOptions = {

    day: "2-digit",
    month: "short",
    year: "numeric"

  };

  const timeOptions = {

    hour: "2-digit",
    minute: "2-digit"

  };

  document.getElementById(
    "currentDate"
  ).innerText =

    now.toLocaleDateString(
      "en-IN",
      dateOptions
    );

  document.getElementById(
    "currentTime"
  ).innerText =

    now.toLocaleTimeString(
      "en-IN",
      timeOptions
    );

}

// =========================
// MODE SWITCHER
// =========================

function setMode(mode) {

  currentMode = mode;

  // =========================
  // RESET BUTTON STATES
  // =========================

  document
    .getElementById("modeNew")
    .classList.remove("active-mode");

  document
    .getElementById("modeWatchlist")
    .classList.remove("active-mode");

  document
    .getElementById("modeActive")
    .classList.remove("active-mode");

  // =========================
  // HIDE ALL MODE SECTIONS
  // =========================

  document
    .getElementById("watchlistSection")
    .classList.add("hidden");

  document
    .getElementById("activeTradeSection")
    .classList.add("hidden");

  // =========================
  // MODE LOGIC
  // =========================

  if (mode === "new") {

    document
      .getElementById("modeNew")
      .classList.add("active-mode");

    document
      .getElementById("modeTitle")
      .innerText =

      "New Scan";

    document
      .getElementById("modeSubtitle")
      .innerText =

      "Analyze fresh market opportunities";

  }

  else if (mode === "watchlist") {

    document
      .getElementById("modeWatchlist")
      .classList.add("active-mode");

    document
      .getElementById("watchlistSection")
      .classList.remove("hidden");

    document
      .getElementById("modeTitle")
      .innerText =

      "Watchlist Follow-Up";

    document
      .getElementById("modeSubtitle")
      .innerText =

      "Review and revalidate shortlisted setups";

  }

  else if (mode === "active") {

    document
      .getElementById("modeActive")
      .classList.add("active-mode");

    document
      .getElementById("activeTradeSection")
      .classList.remove("hidden");

    document
      .getElementById("modeTitle")
      .innerText =

      "Active Trade Follow-Up";

    document
      .getElementById("modeSubtitle")
      .innerText =

      "Manage live running positions";

  }

}

// =========================
// ADVANCED TOGGLE
// =========================

function toggleAdvancedSection() {

  const toggle =

    document.getElementById(
      "advancedToggle"
    );

  const section =

    document.getElementById(
      "advancedSection"
    );

  if (toggle.checked) {

    section.classList.remove(
      "hidden"
    );

  }

  else {

    section.classList.add(
      "hidden"
    );

  }

}

// =========================
// DYNAMIC CANDLE RENDERER
// =========================

function renderCandleInputs() {

  const candleContainer =

    document.getElementById(
      "candleContainer"
    );

  const candleTitles = [

    "Most Recent Candle",

    "Previous Candle",

    "2 Candles Ago",

    "3 Candles Ago",

    "4 Candles Ago"

  ];

  let html = "";

  for (let i = 1; i <= 5; i++) {

    html += `

      <div class="candle-block">

        <h3>
          ${candleTitles[i - 1]}
        </h3>

        <div class="input-grid">

          <!-- CLOSE -->

          <div class="input-group">

            <label>
              Closing Price
            </label>

            <input
              type="number"
              id="close${i}"
              placeholder="Close Price"
            />

          </div>

          <!-- NATURE -->

          <div class="input-group">

            <label>
              Candle Nature
            </label>

            <select id="nature${i}">

              <option value="Bullish">
                Bullish
              </option>

              <option value="Bearish">
                Bearish
              </option>

            </select>

          </div>

          <!-- VOLUME -->

          <div class="input-group">

            <label>
              Volume
            </label>

            <input
              type="text"
              id="volume${i}"
              placeholder="10L / 15M / 1Cr"
            />

          </div>

        </div>

      </div>

    `;

  }

  candleContainer.innerHTML = html;

}

// =========================
// RESET ENGINE
// =========================

function resetAllFields() {

  const inputs =
    document.querySelectorAll(
      "input"
    );

  inputs.forEach(input => {

    if (
      input.type !== "checkbox"
    ) {

      input.value = "";

    }

  });

  const selects =
    document.querySelectorAll(
      "select"
    );

  selects.forEach(select => {

    select.selectedIndex = 0;

  });

  document.getElementById(
    "advancedToggle"
  ).checked = false;

  toggleAdvancedSection();

  document
    .getElementById("resultCard")
    .classList.add("hidden");

}

// =========================
// ANALYZE STOCK
// =========================

function analyzeStock() {

  alert(

    "Core rendering engine integration will now begin."

  );

}
