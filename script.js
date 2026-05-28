// =========================
// GLOBAL MODE
// =========================

let currentMode = "new";

// =========================
// INITIAL LOAD
// =========================

window.onload = function () {

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
// CANDLE INPUTS
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
// RESET
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

    const candles = [];

    for (let i = 1; i <= 5; i++) {

      candles.push({

        close: parseFloat(
          document.getElementById(
            "close" + i
          ).value
        ),

        nature:
          document.getElementById(
            "nature" + i
          ).value,

        volume:
          parseVolume(
            document.getElementById(
              "volume" + i
            ).value
          )

      });

    }

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
  // TRADE PLAN ENGINE
  // =========================

  const tradePlan =

    generateTradePlan({

      ...setupData,

      ...momentumData,

      ...verdictData,

      ltp,
      ema20,
      ema50,
      rsi

    });

  // =========================
  // POSITION SIZE ENGINE
  // =========================

  const capital =
    parseFloat(
      document.getElementById(
        "capital"
      ).value
    );

  const riskPercent =
    parseFloat(
      document.getElementById(
        "riskPercent"
      ).value
    );

  const numericSL =
    parseFloat(
      tradePlan.stopLoss
    );

  let positionData = {

    quantity: 0,

    riskAmount: 0,

    positionValue: 0,

    perShareRisk: 0,

    warning: "",

    message:
      "Position Size Not Calculated"

  };

  if (

    !isNaN(capital) &&
    !isNaN(riskPercent) &&
    !isNaN(numericSL)

  ) {

    positionData =

      calculatePositionSize({

        capital,

        riskPercent,

        entryPrice: ltp,

        stopLoss: numericSL

      });

  }

  // =========================
  // ACTIVE TRADE MODE
  // =========================

  if (currentMode === "active") {

    const executedEntry =
      parseFloat(
        document.getElementById(
          "executedEntry"
        ).value
      );

    const currentSL =
      parseFloat(
        document.getElementById(
          "currentSL"
        ).value
      );

    const currentTarget =
      parseFloat(
        document.getElementById(
          "currentTarget"
        ).value
      );

    const quantity =
      parseFloat(
        document.getElementById(
          "quantityTraded"
        ).value
      );

    const tradeData =

      manageActiveTrade({

        ...setupData,

        ...momentumData,

        ...verdictData,

        ltp,
        ema20,
        ema50,
        rsi,

        executedEntry,
        currentSL,
        currentTarget,
        quantity

      });

    renderTradeResults({

      stockName,
      timeframe,

      ...setupData,

      ...momentumData,

      ...verdictData,

      ...tradeData

    });

    return;

  }

  // =========================
  // STANDARD RESULTS
  // =========================

  renderStandardResults({

    stockName,
    timeframe,

    ...setupData,

    ...momentumData,

    ...verdictData,

    ...tradePlan,

    ...positionData,

    reasons

  });

}

// =========================
// STANDARD RESULTS
// =========================

function renderStandardResults(data) {

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

    reasons,

    entryZone,
    triggerZone,
    stopLoss,
    target,

    tradeAction,
    riskLevel,
    warning,

    quantity,
    riskAmount,
    positionValue,
    perShareRisk

  } = data;

  const resultCard =
    document.getElementById(
      "resultCard"
    );

  const resultContent =
    document.getElementById(
      "resultContent"
    );

  const setupFullName =

    APP_CONFIG.SETUP_NAMES[
      setup
    ];

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
            Setup
          </h4>

          <p>
            ${setup}
          </p>

          <small>
            ${setupFullName}
          </small>

        </div>

      </div>

    </div>

    <div class="card">

      <div class="section-header">

        <h3>
          Setup Scores
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

    <div class="card">

      <div class="section-header">

        <h3>
          Trade Plan
        </h3>

      </div>

      <div class="result-grid">

        <div class="result-item">

          <h4>
            Entry Zone
          </h4>

          <p>
            ${entryZone}
          </p>

        </div>

        <div class="result-item">

          <h4>
            Trigger Zone
          </h4>

          <p>
            ${triggerZone}
          </p>

        </div>

        <div class="result-item">

          <h4>
            Stop Loss
          </h4>

          <p>
            ${stopLoss}
          </p>

        </div>

        <div class="result-item">

          <h4>
            Target
          </h4>

          <p>
            ${target}
          </p>

        </div>

        <div class="result-item">

          <h4>
            Risk Level
          </h4>

          <p>
            ${riskLevel}
          </p>

        </div>

        <div class="result-item">

          <h4>
            Trade Action
          </h4>

          <p>
            ${tradeAction}
          </p>

        </div>

      </div>

    </div>

    <div class="card">

      <div class="section-header">

        <h3>
          Position Size
        </h3>

      </div>

      <div class="result-grid">

        <div class="result-item">

          <h4>
            Suggested Quantity
          </h4>

          <p>
            ${quantity}
          </p>

        </div>

        <div class="result-item">

          <h4>
            Risk Amount
          </h4>

          <p>
            ₹${riskAmount}
          </p>

        </div>

        <div class="result-item">

          <h4>
            Position Value
          </h4>

          <p>
            ₹${positionValue}
          </p>

        </div>

        <div class="result-item">

          <h4>
            Per Share Risk
          </h4>

          <p>
            ₹${perShareRisk}
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

    ${warning ? `

      <div class="reason-box">

        <h3>
          Warning
        </h3>

        <ul>

          <li>
            ${warning}
          </li>

        </ul>

      </div>

    ` : ""}

  `;

  resultCard.classList.remove(
    "hidden"
  );

}

// =========================
// TRADE RESULTS
// =========================

function renderTradeResults(data) {

  const {

    stockName,
    timeframe,

    tradeVerdict,

    priority,

    tradeHealth,

    pnlPercent,

    suggestedSL,

    suggestedTarget,

    tradeReasons

  } = data;

  const resultCard =
    document.getElementById(
      "resultCard"
    );

  const resultContent =
    document.getElementById(
      "resultContent"
    );

  resultContent.innerHTML = `

    <div class="card">

      <div class="section-header">

        <h3>
          Trade Management Summary
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
            Trade Verdict
          </h4>

          <p>
            ${tradeVerdict}
          </p>

        </div>

        <div class="result-item">

          <h4>
            Trade Health
          </h4>

          <p>
            ${tradeHealth}
          </p>

        </div>

        <div class="result-item">

          <h4>
            P/L %
          </h4>

          <p>
            ${pnlPercent.toFixed(2)}%
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

      </div>

    </div>

    <div class="card">

      <div class="section-header">

        <h3>
          Trade Management Plan
        </h3>

      </div>

      <div class="result-grid">

        <div class="result-item">

          <h4>
            Suggested Stop Loss
          </h4>

          <p>
            ${suggestedSL}
          </p>

        </div>

        <div class="result-item">

          <h4>
            Suggested Target
          </h4>

          <p>
            ${suggestedTarget}
          </p>

        </div>

      </div>

    </div>

    <div class="reason-box">

      <h3>
        Why This Trade Verdict?
      </h3>

      <ul>

        ${tradeReasons
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
