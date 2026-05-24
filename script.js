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

window.onload = toggleModeFields;

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

  if (
    !stockName ||
    isNaN(ltp) ||
    isNaN(ema20) ||
    isNaN(ema50) ||
    isNaN(rsi)
  ) {

    alert("Please fill all fields");
    return;

  }

  const tolerance =
    timeframe === "Daily"
      ? 0.02
      : 0.005;

  const distance =
    Math.abs(
      (ltp - ema20) / ema20
    );

  const emaGap =
    Math.abs(
      ((ema20 - ema50) / ema50) * 100
    );

  const nearEMA20 =
    distance <= tolerance;

  const emaCompressed =
    emaGap <= 0.5;

  // ==============================
  // SCORES
  // ==============================

  let cbScore = 0;
  let pcScore = 0;
  let rbScore = 0;

  // CB

  if (ltp > ema20)
    cbScore += 25;

  if (ema20 > ema50)
    cbScore += 25;

  if (emaGap >= 0.5)
    cbScore += 25;

  if (rsi >= 55 && rsi <= 70)
    cbScore += 25;

  // PC

  if (ema20 > ema50)
    pcScore += 30;

  if (nearEMA20)
    pcScore += 40;

  if (rsi >= 50 && rsi <= 60)
    pcScore += 30;

  // RB

  if (emaCompressed)
    rbScore += 40;

  if (rsi >= 45 && rsi <= 55)
    rbScore += 30;

  if (nearEMA20)
    rbScore += 30;

  // ==============================
  // SETUP ENGINE
  // ==============================

  let setup = "None";
  let setupScore = 0;

  if (
    emaCompressed &&
    rsi >= 45 &&
    rsi <= 55
  ) {

    setup = "RB";
    setupScore = rbScore;

  }

  else if (
    nearEMA20 &&
    ema20 > ema50
  ) {

    setup = "PC";
    setupScore = pcScore;

  }

  else if (
    ltp > ema20 &&
    ema20 > ema50
  ) {

    setup = "CB";
    setupScore = cbScore;

  }

  const resultContent =
    document.getElementById("resultContent");

  // ==============================
  // ACTIVE TRADE ENGINE
  // ==============================

  if (mode === "active") {

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

    let managementVerdict =
      "Continue Holding";

    let priority =
      "Medium";

    let managementReason =
      "Trend remains healthy above EMA20 with strong momentum.";

    let managementPlan = "";

    // FULL EXIT

    if (
      ltp <= currentSL ||
      ltp < ema20 ||
      rsi < 45 ||
      ema20 < ema50
    ) {

      managementVerdict =
        "Full Exit";

      priority =
        "Very High";

      managementReason =
        "Trend structure weakening or stop loss breached.";

      managementPlan = `

        <div class="trade-plan">

          <h3>Exit Plan</h3>

          <div class="result-grid">

            <div class="result-item">
              <h4>Exit Quantity</h4>
              <p>${quantity}</p>
            </div>

            <div class="result-item">
              <h4>Exit Price</h4>
              <p>${ltp.toFixed(2)}</p>
            </div>

          </div>

        </div>

      `;

    }

    // PARTIAL EXIT

    else if (
      ltp >= currentTarget * 0.95 &&
      rsi >= 65
    ) {

      const partialQty =
        Math.floor(quantity / 2);

      managementVerdict =
        "Partial Exit";

      priority =
        "High";

      managementReason =
        "Stock near target zone with strong momentum.";

      managementPlan = `

        <div class="trade-plan">

          <h3>Partial Exit Plan</h3>

          <div class="result-grid">

            <div class="result-item">
              <h4>Exit Quantity</h4>
              <p>${partialQty}</p>
            </div>

            <div class="result-item">
              <h4>Hold Quantity</h4>
              <p>${quantity - partialQty}</p>
            </div>

            <div class="result-item">
              <h4>Suggested Trail SL</h4>
              <p>${ema20.toFixed(2)}</p>
            </div>

          </div>

        </div>

      `;

    }

    // TRAIL SL

    else if (
      ltp >= executedEntry * 1.05 &&
      rsi >= 55 &&
      rsi <= 65 &&
      ltp < currentTarget * 0.95
    ) {

      managementVerdict =
        "Trail Stop Loss";

      priority =
        "High";

      managementReason =
        "Trade progressing well. Protect profits.";

      managementPlan = `

        <div class="trade-plan">

          <h3>Trail Stop Loss</h3>

          <div class="result-grid">

            <div class="result-item">
              <h4>Current SL</h4>
              <p>${currentSL.toFixed(2)}</p>
            </div>

            <div class="result-item">
              <h4>Suggested New SL</h4>
              <p>${ema20.toFixed(2)}</p>
            </div>

          </div>

        </div>

      `;

    }

    resultContent.innerHTML = `

      <div class="result-grid">

        <div class="result-item">
          <h4>Stock Name</h4>
          <p>${stockName}</p>
        </div>

        <div class="result-item">
          <h4>Timeframe</h4>
          <p>${timeframe}</p>
        </div>

        <div class="result-item">
          <h4>Setup</h4>
          <p>${setup}</p>
        </div>

        <div class="result-item">
          <h4>Setup Score</h4>
          <p>${setupScore}/100</p>
        </div>

        <div class="result-item">
          <h4>Trade Management Verdict</h4>
          <p>${managementVerdict}</p>
        </div>

        <div class="result-item">
          <h4>Priority</h4>
          <p>${priority}</p>
        </div>

        <div class="result-item">
          <h4>Reason</h4>
          <p>${managementReason}</p>
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

      </div>

      ${managementPlan}

    `;

    document
      .getElementById("resultCard")
      .classList.remove("hidden");

    return;

  }

  // ==============================
  // NEW SCAN + WATCHLIST ENGINE
  // ==============================

  let verdict = "AVOID";
  let priority = "Low";
  let reason = "Weak structure";

  if (
    (timeframe === "Daily" &&
      distance > 0.05) ||

    (timeframe === "15 Min" &&
      distance > 0.01)
  ) {

    verdict = "AVOID";
    reason = "Overextended";

  }

  else if (setup === "CB") {

    if (
      cbScore >= 75 &&
      rsi >= 58
    ) {

      verdict = "BUY";
      priority = "High";
      reason =
        "Strong continuation breakout";

    }

    else {

      verdict = "WATCH";
      priority = "Medium";
      reason =
        "Breakout setup forming";

    }

  }

  else if (setup === "PC") {

    if (
      pcScore >= 100 &&
      rsi >= 58
    ) {

      verdict = "BUY";
      priority = "High";
      reason =
        "Pullback continuation confirmed";

    }

    else {

      verdict = "WATCH";
      priority = "Medium";
      reason =
        "Setup forming, monitor closely";

    }

  }

  else if (setup === "RB") {

    verdict = "WATCH";
    priority = "Medium";
    reason =
      "Range breakout developing";

  }

  let verdictClass = "avoid";

  if (verdict === "BUY")
    verdictClass = "buy";

  if (verdict === "WATCH")
    verdictClass = "watch";

  // ==============================
  // TRADE PLAN
  // ==============================

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
    entryHigh +
    (2 * risk);

  resultContent.innerHTML = `

    <div class="result-grid">

      <div class="result-item">
        <h4>Stock Name</h4>
        <p>${stockName}</p>
      </div>

      <div class="result-item">
        <h4>Timeframe</h4>
        <p>${timeframe}</p>
      </div>

      <div class="result-item">
        <h4>Setup</h4>
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
        <h4>Reason</h4>
        <p>${reason}</p>
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

    </div>

    ${
      verdict !== "AVOID"
      ? `

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
            ? `
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

        <label>Capital</label>

        <input
          type="number"
          id="capital"
        >

        <label>Risk %</label>

        <input
          type="number"
          id="riskPercent"
          value="1"
        >

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

  document
    .getElementById("resultCard")
    .classList.remove("hidden");

}

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
      riskAmount /
      riskPerShare
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
