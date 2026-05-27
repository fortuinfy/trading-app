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
// MODE FIELD TOGGLER
// =========================

function toggleModeFields() {

  const mode =
    document.getElementById("mode").value;

  document
    .getElementById("watchlistFields")
    .classList.add("hidden");

  document
    .getElementById("activeFields")
    .classList.add("hidden");

  if (mode === "watchlist") {

    document
      .getElementById("watchlistFields")
      .classList.remove("hidden");

  }

  if (mode === "active") {

    document
      .getElementById("activeFields")
      .classList.remove("hidden");

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
// INITIAL LOAD
// =========================

window.onload = function() {

  toggleModeFields();

  renderCandleInputs();

};

// =========================
// ANALYZE STOCK
// =========================

function analyzeStock() {

  const mode =
    document.getElementById("mode").value;

  const stockName =
    document.getElementById("stockName").value;

  const timeframe =
    document.getElementById("timeframe").value;

  const ltp =
    parseFloat(
      document.getElementById("ltp").value
    );

  const ema20 =
    parseFloat(
      document.getElementById("ema20").value
    );

  const ema50 =
    parseFloat(
      document.getElementById("ema50").value
    );

  const rsi =
    parseFloat(
      document.getElementById("rsi").value
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
  // ADVANCED MODE
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

    relativeVolume: 0,

    relativeVolumeStatus:
      "Not Enabled",

    momentumTrend:
      "Basic Engine Only",

    participationTrend:
      "Basic Engine Only",

    weaknessDetected: false,

    advancedReasons: []

  };

  if (advancedEnabled) {

    const candles = [

      {

        close: parseFloat(
          document.getElementById("close1").value
        ),

        nature:
          document.getElementById("nature1").value,

        volume:
          parseVolume(
            document.getElementById("volume1").value
          )

      },

      {

        close: parseFloat(
          document.getElementById("close2").value
        ),

        nature:
          document.getElementById("nature2").value,

        volume:
          parseVolume(
            document.getElementById("volume2").value
          )

      },

      {

        close: parseFloat(
          document.getElementById("close3").value
        ),

        nature:
          document.getElementById("nature3").value,

        volume:
          parseVolume(
            document.getElementById("volume3").value
          )

      },

      {

        close: parseFloat(
          document.getElementById("close4").value
        ),

        nature:
          document.getElementById("nature4").value,

        volume:
          parseVolume(
            document.getElementById("volume4").value
          )

      },

      {

        close: parseFloat(
          document.getElementById("close5").value
        ),

        nature:
          document.getElementById("nature5").value,

        volume:
          parseVolume(
            document.getElementById("volume5").value
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
  // REASON ENGINE
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
  // ACTIVE TRADE MODE
  // =========================

  if (mode === "active") {

    handleActiveTradeMode({

      ...setupData,

      ...momentumData,

      ...verdictData,

      reasons,

      ltp,
      ema20,
      ema50,
      rsi

    });

    return;

  }

  // =========================
  // NORMAL RESULT RENDER
  // =========================

  renderNewScanResults({

    stockName,
    timeframe,

    ...setupData,

    ...momentumData,

    ...verdictData,

    reasons,

    ltp,
    ema20,
    ema50,
    rsi

  });

}

// =========================
// NEW SCAN RENDERER
// =========================

function renderNewScanResults(
  data
) {

  const {

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

    tolerance,

    ltp,
    ema20,
    ema50

  } = data;

  const resultCard =
    document.getElementById(
      "resultCard"
    );

  const resultContent =
    document.getElementById(
      "resultContent"
    );

  let entryLow;
  let entryHigh;
  let stopLoss;
  let target;

  if (verdict === "BUY") {

    entryLow = ltp;

    entryHigh =
      ltp + (ltp * tolerance);

  }

  else {

    entryLow =
      ema20 -
      (ema20 * tolerance);

    entryHigh =
      ema20 +
      (ema20 * tolerance);

  }

  stopLoss = ema50;

  if (stopLoss >= entryLow) {

    stopLoss =
      entryLow -
      (entryLow * 0.02);

  }

  const risk =
    entryLow - stopLoss;

  target =
    entryHigh + (2 * risk);

  let verdictClass = "avoid";

  if (verdict === "BUY")
    verdictClass = "buy";

  if (verdict === "WATCH")
    verdictClass = "watch";

  resultContent.innerHTML = `

    <div class="result-grid">

      <div class="result-item">
        <h4>Detected Setup</h4>
        <p>${setup}</p>
      </div>

      <div class="result-item">
        <h4>Setup Score</h4>
        <p>${setupScore}/100</p>
      </div>

      <div class="result-item">
        <h4>Verdict</h4>
        <p class="${verdictClass}">
          ${verdict}
        </p>
      </div>

      <div class="result-item">
        <h4>Priority</h4>
        <p>${priority}</p>
      </div>

      <div class="result-item">
        <h4>CB Score</h4>
        <p>${cbScore}/100</p>
      </div>

      <div class="result-item">
        <h4>PC Score</h4>
        <p>${pcScore}/100</p>
      </div>

      <div class="result-item">
        <h4>RB Score</h4>
        <p>${rbScore}/100</p>
      </div>

      <div class="result-item">
        <h4>Momentum Score</h4>
        <p>${momentumScore}/100</p>
      </div>

      <div class="result-item">
        <h4>Relative Volume</h4>
        <p>${relativeVolumeStatus}</p>
      </div>

      <div class="result-item">
        <h4>Momentum Trend</h4>
        <p>${momentumTrend}</p>
      </div>

      <div class="result-item">
        <h4>Participation Trend</h4>
        <p>${participationTrend}</p>
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

    ${

      verdict !== "AVOID"

      ?

      `

      <div class="trade-plan">

        <h3>Trade Plan</h3>

        <div class="result-grid">

          <div class="result-item">
            <h4>Entry Range</h4>
            <p>
              ${entryLow.toFixed(2)}
              -
              ${entryHigh.toFixed(2)}
            </p>
          </div>

          ${

            verdict === "WATCH"

            ?

            `

            <div class="result-item">
              <h4>Trigger Zone</h4>
              <p>
                ${entryHigh.toFixed(2)}
                -
                ${(entryHigh * 1.01).toFixed(2)}
              </p>
            </div>

            `

            : ""

          }

          <div class="result-item">
            <h4>Stop Loss</h4>
            <p>${stopLoss.toFixed(2)}</p>
          </div>

          <div class="result-item">
            <h4>Target</h4>
            <p>${target.toFixed(2)}</p>
          </div>

        </div>

      </div>

      `

      : ""

    }

  `;

  if (verdict === "BUY") {

    resultContent.innerHTML += `

      <div class="position-box">

        <h3>
          Position Size Calculator
        </h3>

        <label>
          Capital
        </label>

        <input
          type="number"
          id="capital"
        />

        <label>
          Risk %
        </label>

        <input
          type="number"
          id="riskPercent"
          value="1"
        />

        <button
          class="calc-btn"
          onclick="
            calculatePosition(
              ${entryLow},
              ${stopLoss}
            )
          "
        >

          Calculate Quantity

        </button>

        <div
          class="qty-result"
          id="qtyResult"
        ></div>

      </div>

    `;

  }

  resultCard.classList.remove(
    "hidden"
  );

}

// =========================
// ACTIVE TRADE RENDERER
// =========================

function handleActiveTradeMode(
  data
) {

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

      ...data,

      executedEntry,
      currentSL,
      currentTarget,
      quantity

    });

  renderTradeResults({

    ...data,

    ...tradeData

  });

}

// =========================
// ACTIVE TRADE OUTPUT
// =========================

function renderTradeResults(
  data
) {

  const {

    setup,

    momentumScore,

    relativeVolumeStatus,

    tradeVerdict,
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

    <div class="result-grid">

      <div class="result-item">
        <h4>Detected Setup</h4>
        <p>${setup}</p>
      </div>

      <div class="result-item">
        <h4>Trade Verdict</h4>
        <p>${tradeVerdict}</p>
      </div>

      <div class="result-item">
        <h4>Momentum Score</h4>
        <p>${momentumScore}/100</p>
      </div>

      <div class="result-item">
        <h4>Relative Volume</h4>
        <p>${relativeVolumeStatus}</p>
      </div>

    </div>

    <div class="reason-box">

      <h3>
        Why This Verdict?
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

// =========================
// POSITION SIZING
// =========================

function calculatePosition(
  entry,
  stopLoss
) {

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

  const riskAmount =
    capital *
    (riskPercent / 100);

  const riskPerShare =
    entry - stopLoss;

  const quantity =
    Math.floor(
      riskAmount / riskPerShare
    );

  if (quantity < 1) {

    document.getElementById(
      "qtyResult"
    ).innerHTML =
      "Capital insufficient.";

  }

  else {

    document.getElementById(
      "qtyResult"
    ).innerHTML =

      "Suggested Quantity: " +

      quantity +

      " Shares";

  }

}
