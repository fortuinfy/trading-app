function toggleModeFields() {

  const mode =
    document.getElementById("mode").value;

  const watchlistFields =
    document.getElementById("watchlistFields");

  const activeFields =
    document.getElementById("activeFields");

  watchlistFields.classList.add("hidden");
  activeFields.classList.add("hidden");

  if (mode === "watchlist") {
    watchlistFields.classList.remove("hidden");
  }

  if (mode === "active") {
    activeFields.classList.remove("hidden");
  }

}

window.onload = function () {
  toggleModeFields();
};

function analyzeStock() {

  const mode =
    document.getElementById("mode").value;

  const stockName =
    document.getElementById("stockName").value;

  const timeframe =
    document.getElementById("timeframe").value;

  const ltp =
    parseFloat(document.getElementById("ltp").value);

  const ema20 =
    parseFloat(document.getElementById("ema20").value);

  const ema50 =
    parseFloat(document.getElementById("ema50").value);

  const rsi =
    parseFloat(document.getElementById("rsi").value);

  if (
    !stockName ||
    isNaN(ltp) ||
    isNaN(ema20) ||
    isNaN(ema50) ||
    isNaN(rsi)
  ) {
    alert("Please fill all required fields");
    return;
  }

  const tolerance =
    timeframe === "Daily" ? 0.02 : 0.005;

  const distance =
    (ltp - ema20) / ema20;

  const emaGap =
    ((ema20 - ema50) / ema50) * 100;

  let cbScore = 0;
  let pcScore = 0;
  let rbScore = 0;

  // SCORING

  if (ltp > ema20) cbScore += 25;
  if (ema20 > ema50) cbScore += 25;
  if (emaGap >= 0.5) cbScore += 25;
  if (rsi >= 55 && rsi <= 70) cbScore += 25;

  if (ema20 > ema50) pcScore += 30;
  if (Math.abs(distance) <= tolerance) pcScore += 40;
  if (rsi >= 50 && rsi <= 60) pcScore += 30;

  if (Math.abs(emaGap) <= 0.5) rbScore += 40;
  if (rsi >= 45 && rsi <= 55) rbScore += 30;
  if (Math.abs(distance) <= tolerance) rbScore += 30;

  // SETUP DETECTION

  let setup = "None";

  if (
    ltp > ema20 &&
    ema20 > ema50 &&
    emaGap >= 0.5
  ) {
    setup = "CB";
  }

  else if (
    ema20 > ema50 &&
    Math.abs(distance) <= tolerance
  ) {
    setup = "PC";
  }

  else if (
    Math.abs(emaGap) <= 0.5
  ) {
    setup = "RB";
  }

  // VERDICT ENGINE

  let verdict = "AVOID";
  let priority = "Low";
  let reason = "Weak structure";

  if (
    cbScore >= 75 ||
    pcScore >= 80 ||
    rbScore >= 85
  ) {

    verdict = "BUY";
    priority = "High";
    reason = "Strong trade-ready setup";

  }

  else if (
    cbScore >= 50 ||
    pcScore >= 55 ||
    rbScore >= 60
  ) {

    verdict = "WATCH";
    priority = "Medium";
    reason = "Setup forming, monitor closely";

  }

  if (
    (timeframe === "Daily" && distance > 0.05) ||
    (timeframe === "15 Min" && distance > 0.01)
  ) {

    verdict = "AVOID";
    priority = "Low";
    reason = "Overextended";

  }

  // COLOR

  let verdictClass = "avoid";

  if (verdict === "BUY") {
    verdictClass = "buy";
  }

  if (verdict === "WATCH") {
    verdictClass = "watch";
  }

  // TRADE PLAN

  let tradePlanHTML = "";

  let entryLow;
  let entryHigh;
  let stopLoss;
  let target;

  if (
    verdict === "BUY" ||
    verdict === "WATCH"
  ) {

    if (verdict === "BUY") {

      entryLow = ltp;
      entryHigh =
        ltp + (ltp * tolerance);

    }

    else {

      entryLow =
        ema20 - (ema20 * tolerance);

      entryHigh =
        ema20 + (ema20 * tolerance);

    }

    stopLoss = ema50;

    if (stopLoss >= entryLow) {
      stopLoss =
        entryLow - (entryLow * 0.02);
    }

    const risk =
      entryLow - stopLoss;

    target =
      entryHigh + (2 * risk);

    tradePlanHTML = `

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

    `;
  }

  // RESULT

  const resultContent =
    document.getElementById("resultContent");

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

    ${tradePlanHTML}

  `;

  // POSITION SIZE

  if (verdict === "BUY") {

    resultContent.innerHTML += `

      <div class="position-box">

        <h3>Position Size Calculator</h3>

        <label>Capital</label>
        <input type="number" id="capital">

        <label>Risk %</label>
        <input type="number" id="riskPercent" value="1">

        <button class="calc-btn" onclick="calculatePosition(${entryLow}, ${stopLoss})">
          Calculate Quantity
        </button>

        <div class="qty-result" id="qtyResult"></div>

      </div>

    `;
  }

  document
    .getElementById("resultCard")
    .classList.remove("hidden");

}

function calculatePosition(entry, stopLoss) {

  const capital =
    parseFloat(
      document.getElementById("capital").value
    );

  const riskPercent =
    parseFloat(
      document.getElementById("riskPercent").value
    );

  if (
    isNaN(capital) ||
    isNaN(riskPercent)
  ) {
    alert("Fill Capital & Risk %");
    return;
  }

  const riskAmount =
    capital * (riskPercent / 100);

  const riskPerShare =
    entry - stopLoss;

  const qty =
    Math.floor(riskAmount / riskPerShare);

  if (qty < 1) {

    document.getElementById("qtyResult").innerHTML =
      "Capital insufficient for defined risk management.";

  }

  else {

    document.getElementById("qtyResult").innerHTML =
      "Suggested Quantity: " +
      qty +
      " shares";

  }

}
