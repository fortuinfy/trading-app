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

function toggleAdvancedSection() {

  const toggle =
    document.getElementById("advancedToggle");

  const advancedSection =
    document.getElementById("advancedSection");

  if (toggle.checked) {

    advancedSection.classList.remove("hidden");

  }

  else {

    advancedSection.classList.add("hidden");

  }

}

window.onload = function () {

  toggleModeFields();

};

/* =========================
   VOLUME PARSER
========================= */

function parseVolume(volumeText) {

  if (!volumeText)
    return 0;

  let value =
    volumeText
      .toString()
      .trim()
      .toUpperCase();

  value =
    value.replace(/\s+/g, "");

  if (value.includes("CR")) {

    return (
      parseFloat(
        value.replace("CR", "")
      ) * 10000000
    );

  }

  if (value.includes("L")) {

    return (
      parseFloat(
        value.replace("L", "")
      ) * 100000
    );

  }

  if (value.includes("M")) {

    return (
      parseFloat(
        value.replace("M", "")
      ) * 1000000
    );

  }

  if (value.includes("K")) {

    return (
      parseFloat(
        value.replace("K", "")
      ) * 1000
    );

  }

  if (value.includes("B")) {

    return (
      parseFloat(
        value.replace("B", "")
      ) * 1000000000
    );

  }

  return parseFloat(value);

}

/* =========================
   ANALYZE STOCK
========================= */

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

    alert("Please fill all mandatory fields.");

    return;

  }

  /* =========================
     BASIC ENGINE
  ========================= */

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

  /* =========================
     SETUP SCORES
  ========================= */

  let cbScore = 0;
  let pcScore = 0;
  let rbScore = 0;

  /* CB */

  if (ltp > ema20)
    cbScore += 25;

  if (ema20 > ema50)
    cbScore += 25;

  if (emaGap >= 0.5)
    cbScore += 25;

  if (rsi >= 55 && rsi <= 70)
    cbScore += 25;

  /* PC */

  if (ema20 > ema50)
    pcScore += 30;

  if (nearEMA20)
    pcScore += 40;

  if (rsi >= 50 && rsi <= 60)
    pcScore += 30;

  /* RB */

  if (emaCompressed)
    rbScore += 40;

  if (rsi >= 45 && rsi <= 55)
    rbScore += 30;

  if (nearEMA20)
    rbScore += 30;

  /* =========================
     SETUP DETECTION
  ========================= */

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

  /* =========================
     ADVANCED CANDLE ENGINE
  ========================= */

  const advancedEnabled =
    document.getElementById(
      "advancedToggle"
    ).checked;

  let momentumScore = 0;

  let relativeVolumeStatus =
    "Not Enabled";

  let momentumTrend =
    "Basic Engine Only";

  let participationTrend =
    "Basic Engine Only";

  let weaknessDetected = false;

  let advancedReasons = [];

  if (advancedEnabled) {

    const close1 =
      parseFloat(
        document.getElementById("close1").value
      );

    const close2 =
      parseFloat(
        document.getElementById("close2").value
      );

    const close3 =
      parseFloat(
        document.getElementById("close3").value
      );

    const close4 =
      parseFloat(
        document.getElementById("close4").value
      );

    const close5 =
      parseFloat(
        document.getElementById("close5").value
      );

    const nature1 =
      document.getElementById("nature1").value;

    const nature2 =
      document.getElementById("nature2").value;

    const nature3 =
      document.getElementById("nature3").value;

    const nature4 =
      document.getElementById("nature4").value;

    const nature5 =
      document.getElementById("nature5").value;

    const volume1 =
      parseVolume(
        document.getElementById("volume1").value
      );

    const volume2 =
      parseVolume(
        document.getElementById("volume2").value
      );

    const volume3 =
      parseVolume(
        document.getElementById("volume3").value
      );

    const volume4 =
      parseVolume(
        document.getElementById("volume4").value
      );

    const volume5 =
      parseVolume(
        document.getElementById("volume5").value
      );

    const avgVolume =
      (
        volume2 +
        volume3 +
        volume4 +
        volume5
      ) / 4;

    const relativeVolume =
      volume1 / avgVolume;

    /* Relative Volume */

    if (relativeVolume < 0.8) {

      relativeVolumeStatus = "Low";

    }

    else if (
      relativeVolume >= 0.8 &&
      relativeVolume <= 1.2
    ) {

      relativeVolumeStatus = "Normal";

    }

    else {

      relativeVolumeStatus = "High";

    }

    /* Momentum Score */

    if (close1 > close2)
      momentumScore += 10;

    if (close2 > close3)
      momentumScore += 10;

    if (close3 > close4)
      momentumScore += 10;

    if (close4 > close5)
      momentumScore += 10;

    if (nature1 === "Bullish")
      momentumScore += 10;

    if (nature2 === "Bullish")
      momentumScore += 10;

    if (relativeVolumeStatus === "High")
      momentumScore += 20;

    if (
      volume1 > volume2 &&
      volume2 > volume3
    ) {

      momentumScore += 20;

    }

    /* Momentum Trend */

    if (momentumScore >= 70) {

      momentumTrend =
        "Strong Bullish Momentum";

    }

    else if (momentumScore >= 50) {

      momentumTrend =
        "Moderate Momentum";

    }

    else {

      momentumTrend =
        "Weak Momentum";

    }

    /* Participation Trend */

    if (
      relativeVolumeStatus === "High"
    ) {

      participationTrend =
        "Strong Participation";

    }

    else if (
      relativeVolumeStatus === "Normal"
    ) {

      participationTrend =
        "Stable Participation";

    }

    else {

      participationTrend =
        "Weak Participation";

    }

    /* Weakness Detection */

    if (
      nature1 === "Bearish" &&
      nature2 === "Bearish"
    ) {

      weaknessDetected = true;

      advancedReasons.push(
        "Consecutive bearish candles detected."
      );

    }

    if (
      close1 < close2 &&
      close2 < close3
    ) {

      weaknessDetected = true;

      advancedReasons.push(
        "Recent candle closes weakening."
      );

    }

    if (
      relativeVolumeStatus === "Low"
    ) {

      weaknessDetected = true;

      advancedReasons.push(
        "Participation volume remains weak."
      );

    }

  }

  /* =========================
     RESULT ENGINE
  ========================= */

  const resultContent =
    document.getElementById("resultContent");

  let verdict = "AVOID";
  let priority = "Low";

  let reasonList = [];

  /* OVEREXTENDED */

  if (

    (timeframe === "Daily" &&
      distance > 0.05)

    ||

    (timeframe === "15 Min" &&
      distance > 0.01)

  ) {

    verdict = "AVOID";

    reasonList.push(
      "Price excessively extended above EMA20."
    );

  }

  /* CB */

  else if (setup === "CB") {

    if (

      cbScore >= 75 &&
      rsi >= 58

    ) {

      verdict = "BUY";
      priority = "High";

      reasonList.push(
        "Strong EMA continuation structure detected."
      );

      reasonList.push(
        "RSI confirms bullish momentum."
      );

    }

    else {

      verdict = "WATCH";
      priority = "Medium";

      reasonList.push(
        "Breakout structure developing."
      );

    }

  }

  /* PC */

  else if (setup === "PC") {

    if (

      pcScore >= 100 &&
      rsi >= 58

    ) {

      verdict = "BUY";
      priority = "High";

      reasonList.push(
        "Healthy pullback continuation detected."
      );

    }

    else {

      verdict = "WATCH";
      priority = "Medium";

      reasonList.push(
        "Pullback setup still developing."
      );

    }

  }

  /* RB */

  else if (setup === "RB") {

    verdict = "WATCH";
    priority = "Medium";

    reasonList.push(
      "Range breakout structure forming."
    );

  }

  /* =========================
     ADVANCED VERDICT REFINEMENT
  ========================= */

  if (advancedEnabled) {

    if (
      weaknessDetected &&
      verdict === "BUY"
    ) {

      verdict = "WATCH";

      priority = "Medium";

      reasonList.push(
        "Advanced candle analysis downgraded BUY due to weakness."
      );

    }

    if (
      momentumScore >= 70
    ) {

      reasonList.push(
        "Momentum score confirms strong bullish participation."
      );

    }

    else if (
      momentumScore < 50
    ) {

      reasonList.push(
        "Momentum score indicates weak continuation strength."
      );

    }

  }

  /* =========================
     ACTIVE TRADE ENGINE
  ========================= */

  if (mode === "active") {

    const executedEntry =
      parseFloat(
        document.getElementById("executedEntry").value
      );

    const currentSL =
      parseFloat(
        document.getElementById("currentSL").value
      );

    const currentTarget =
      parseFloat(
        document.getElementById("currentTarget").value
      );

    const quantity =
      parseFloat(
        document.getElementById("quantityTraded").value
      );

    let tradeVerdict =
      "Continue Holding";

    let tradeReasons = [];

    let managementPlan = "";

    /* FULL EXIT */

    if (

      ltp <= currentSL ||
      ltp < ema20 ||
      rsi < 45 ||
      ema20 < ema50

    ) {

      tradeVerdict = "Full Exit";

      tradeReasons.push(
        "Trend structure weakening."
      );

      tradeReasons.push(
        "Capital protection prioritized."
      );

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

    /* PARTIAL EXIT */

    else if (

      ltp >= currentTarget * 0.95 &&
      rsi >= 65

    ) {

      tradeVerdict =
        "Partial Exit";

      tradeReasons.push(
        "Price approaching target zone."
      );

      tradeReasons.push(
        "Partial profit booking advised."
      );

      const partialQty =
        Math.floor(quantity / 2);

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

    /* TRAIL SL */

    else if (

      ltp >= executedEntry * 1.05 &&
      rsi >= 55 &&
      rsi <= 65

    ) {

      tradeVerdict =
        "Trail Stop Loss";

      tradeReasons.push(
        "Trade moved favorably."
      );

      tradeReasons.push(
        "Protecting profits."
      );

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

      ${managementPlan}

    `;

    document
      .getElementById("resultCard")
      .classList.remove("hidden");

    return;

  }

  /* =========================
     TRADE PLAN
  ========================= */

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

  /* =========================
     VERDICT COLORS
  ========================= */

  let verdictClass = "avoid";

  if (verdict === "BUY")
    verdictClass = "buy";

  if (verdict === "WATCH")
    verdictClass = "watch";

  /* =========================
     FINAL OUTPUT
  ========================= */

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

        ${reasonList
          .map(
            item =>
              `<li>${item}</li>`
          )
          .join("")}

        ${advancedReasons
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

  /* =========================
     POSITION SIZE
  ========================= */

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

  document
    .getElementById("resultCard")
    .classList.remove("hidden");

}

/* =========================
   POSITION SIZE
========================= */

function calculatePosition(
  entry,
  stopLoss
) {

  const capital =
    parseFloat(
      document.getElementById("capital").value
    );

  const riskPercent =
    parseFloat(
      document.getElementById("riskPercent").value
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
