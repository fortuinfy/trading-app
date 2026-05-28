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

  document
    .getElementById("modeNew")
    .classList.remove("active-mode");

  document
    .getElementById("modeWatchlist")
    .classList.remove("active-mode");

  document
    .getElementById("modeActive")
    .classList.remove("active-mode");

  document
    .getElementById("watchlistSection")
    .classList.add("hidden");

  document
    .getElementById("activeTradeSection")
    .classList.add("hidden");

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

  // =========================
  // BASIC INPUTS
  // =========================

  const stockName =
    document.getElementById(
      "stockName"
    ).value;

  const timeframe =
    document.getElementById(
      "timeframe"
    ).value;

  const ltp =
    parseFloat(
      document.getElementById(
        "ltp"
      ).value
    );

  const ema20 =
    parseFloat(
      document.getElementById(
        "ema20"
      ).value
    );

  const ema50 =
    parseFloat(
      document.getElementById(
        "ema50"
      ).value
    );

  const rsi =
    parseFloat(
      document.getElementById(
        "rsi"
      ).value
    );

  // =========================
  // VALIDATION
  // =========================

  if (

    !stockName ||
    isNaN(ltp) ||
    isNaN(ema20) ||
    isNaN(ema50) ||
    isNaN(rsi)

  ) {

    alert(
      "Please fill all mandatory fields."
    );

    return;

  }

  // =========================
  // ADVANCED ENGINE
  // =========================

  const advancedEnabled =

    document.getElementById(
      "advancedToggle"
    ).checked;

  // =========================
  // SETUP ENGINE
  // =========================

  const setupData =

    calculateSetupScores({

      ltp,
      ema20,
      ema50,
      rsi,
      timeframe

    });

  // =========================
  // MOMENTUM ENGINE
  // =========================

  let momentumData = {

    momentumScore: 0,

    relativeVolumeStatus:
      "Not Enabled",

    momentumTrend:
      "Basic Engine Only",

    participationTrend:
      "Basic Engine Only",

    weaknessDetected: false

  };

  if (advancedEnabled) {

    const candles = [

      {

        close: parseFloat(
          document.getElementById(
            "close1"
          ).value
        ),

        nature:
          document.getElementById(
            "nature1"
          ).value,

        volume:
          parseVolume(
            document.getElementById(
              "volume1"
            ).value
          )

      },

      {

        close: parseFloat(
          document.getElementById(
            "close2"
          ).value
        ),

        nature:
          document.getElementById(
            "nature2"
          ).value,

        volume:
          parseVolume(
            document.getElementById(
              "volume2"
            ).value
          )

      },

      {

        close: parseFloat(
          document.getElementById(
            "close3"
          ).value
        ),

        nature:
          document.getElementById(
            "nature3"
          ).value,

        volume:
          parseVolume(
            document.getElementById(
              "volume3"
            ).value
          )

      },

      {

        close: parseFloat(
          document.getElementById(
            "close4"
          ).value
        ),

        nature:
          document.getElementById(
            "nature4"
          ).value,

        volume:
          parseVolume(
            document.getElementById(
              "volume4"
            ).value
          )

      },

      {

        close: parseFloat(
          document.getElementById(
            "close5"
          ).value
        ),

        nature:
          document.getElementById(
            "nature5"
          ).value,

        volume:
          parseVolume(
            document.getElementById(
              "volume5"
            ).value
          )

      }

    ];

    momentumData =

      calculateMomentum({

        advancedEnabled,
        candles

      });

  }

  // =========================
  // VERDICT ENGINE
  // =========================

  const verdictData =

    generateVerdict({

      ...setupData,

      ...momentumData,

      ltp,
      ema20,
      ema50,
      rsi,
      timeframe,

      advancedEnabled

    });

  // =========================
  // REASONING ENGINE
  // =========================

  const reasons =

    generateReasons({

      ...setupData,

      ...momentumData,

      ...verdictData,

      ltp,
      ema20,
      ema50,
      rsi,

      advancedEnabled

    });

  // =========================
  // MODE ROUTING
  // =========================

  if (currentMode === "new") {

    renderNewScanResults({

      stockName,
      timeframe,

      ...setupData,

      ...momentumData,

      ...verdictData,

      reasons

    });

  }

  else if (
    currentMode === "watchlist"
  ) {

    renderWatchlistResults({

      stockName,
      timeframe,

      ...setupData,

      ...momentumData,

      ...verdictData,

      reasons

    });

  }

  else if (
    currentMode === "active"
  ) {

    renderActiveTradeResults({

      stockName,
      timeframe,

      ...setupData,

      ...momentumData,

      ...verdictData,

      reasons

    });

  }

}

// =========================
// NEW SCAN RESULTS
// =========================

function renderNewScanResults(
  data
) {

  renderGenericResults(
    data,
    "New Scan"
  );

}

// =========================
// WATCHLIST RESULTS
// =========================

function renderWatchlistResults(
  data
) {

  renderGenericResults(
    data,
    "Watchlist Follow-Up"
  );

}

// =========================
// ACTIVE TRADE RESULTS
// =========================

function renderActiveTradeResults(
  data
) {

  renderGenericResults(
    data,
    "Active Trade Follow-Up"
  );

}

// =========================
// GENERIC RESULT ENGINE
// =========================

function renderGenericResults(
  data,
  modeName
) {

  const {

    stockName,
    timeframe,

    setup,
    setupScore,

    cbScore,
    pcScore,
    rbScore,

    verdict,
    priority,

    momentumScore,

    relativeVolumeStatus,

    momentumTrend,

    participationTrend,

    reasons

  } = data;

  const resultCard =
    document.getElementById(
      "resultCard"
    );

  const resultContent =
    document.getElementById(
      "resultContent"
    );

  let verdictClass = "avoid";

  if (verdict === "BUY")
    verdictClass = "buy";

  if (verdict === "WATCH")
    verdictClass = "watch";

  resultContent.innerHTML = `

    <div class="card">

      <div class="section-header">

        <h3>
          Result Summary
        </h3>

      </div>

      <div class="result-grid">

        <div class="result-item">

          <h4>
            Stock Name
          </h4>

          <p>
            ${stockName}
          </p>

        </div>

        <div class="result-item">

          <h4>
            Timeframe
          </h4>

          <p>
            ${timeframe}
          </p>

        </div>

        <div class="result-item">

          <h4>
            Analysis Mode
          </h4>

          <p>
            ${modeName}
          </p>

        </div>

        <div class="result-item">

          <h4>
            Verdict
          </h4>

          <p class="${verdictClass}">
            ${verdict}
          </p>

        </div>

        <div class="result-item">

          <h4>
            Priority
          </h4>

          <p>
            ${priority}
          </p>

        </div>

        <div class="result-item">

          <h4>
            Detected Setup
          </h4>

          <p>
            ${setup}
          </p>

        </div>

      </div>

    </div>

    <div class="card">

      <div class="section-header">

        <h3>
          Setup & Momentum Scores
        </h3>

      </div>

      <div class="result-grid">

        <div class="result-item">

          <h4>
            Setup Score
          </h4>

          <p>
            ${setupScore}/100
          </p>

        </div>

        <div class="result-item">

          <h4>
            CB Score
          </h4>

          <p>
            ${cbScore}/100
          </p>

        </div>

        <div class="result-item">

          <h4>
            PC Score
          </h4>

          <p>
            ${pcScore}/100
          </p>

        </div>

        <div class="result-item">

          <h4>
            RB Score
          </h4>

          <p>
            ${rbScore}/100
          </p>

        </div>

        <div class="result-item">

          <h4>
            Momentum Score
          </h4>

          <p>
            ${momentumScore}/100
          </p>

        </div>

      </div>

    </div>

    <div class="card">

      <div class="section-header">

        <h3>
          Momentum Analysis
        </h3>

      </div>

      <div class="result-grid">

        <div class="result-item">

          <h4>
            Momentum Trend
          </h4>

          <p>
            ${momentumTrend}
          </p>

        </div>

        <div class="result-item">

          <h4>
            Participation Trend
          </h4>

          <p>
            ${participationTrend}
          </p>

        </div>

        <div class="result-item">

          <h4>
            Relative Volume
          </h4>

          <p>
            ${relativeVolumeStatus}
          </p>

        </div>

      </div>

    </div>

    <div class="reason-box">

      <h3>
        Why This Verdict?
      </h3>

      <ul>

        ${reasons
          .map(
            item =>
              `<li>${item}</li>`
          )
          .join("")}

      </ul>

    </div>

  `;

  resultCard.classList.remove(
    "hidden"
  );

}
