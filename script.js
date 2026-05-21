function toggleModeFields() {

  const mode = document.getElementById("mode").value;

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

  const chargesBuffer =
    timeframe === "Daily" ? 0.005 : 0.003;

  const distance =
    (ltp - ema20) / ema20;

  const emaGap =
    ((ema20 - ema50) / ema50) * 100;

  let cbScore = 0;
  let pcScore = 0;
  let rbScore = 0;

  // CB

  if (ltp > ema20) cbScore += 25;
  if (ema20 > ema50) cbScore += 25;
  if (emaGap >= 0.5) cbScore += 25;
  if (rsi >= 55 && rsi <= 70) cbScore += 25;

  // PC

  if (ema20 > ema50) pcScore += 30;
  if (Math.abs(distance) <= tolerance) pcScore += 40;
  if (rsi >= 50 && rsi <= 60) pcScore += 30;

  // RB

  if (Math.abs(emaGap) <= 0.5) rbScore += 40;
  if (rsi >= 45 && rsi <= 55) rbScore += 30;
  if (Math.abs(distance) <= tolerance) rbScore += 30;

  let setup = "None";
  let verdict = "AVOID";
  let priority = "Low";
  let reason = "No valid setup";
  let tradeStatus = "Inactive";

  // =================================
  // NEW SCAN
  // =================================

  if (mode === "new") {

    if (
      (timeframe === "Daily" && distance > 0.05) ||
      (timeframe === "15 Min" && distance > 0.01)
    ) {

      verdict = "AVOID";
      reason = "Overextended";
      tradeStatus = "Avoid Trade";

    }

    else if (
      ltp > ema20 &&
      ema20 > ema50 &&
      emaGap >= 0.5 &&
      rsi > 55
    ) {

      setup = "CB";
      verdict = "BUY";
      priority = "High";
      reason = "Strong continuation breakout";
      tradeStatus = "Fresh Setup";

    }

    else if (
      ema20 > ema50 &&
      Math.abs(distance) <= tolerance &&
      rsi >= 50 &&
      rsi <= 55
    ) {

      setup = "PC";
      verdict = "WATCH";
      priority = "Medium";
      reason = "Healthy pullback continuation";
      tradeStatus = "Awaiting Trigger";

    }

    else if (
      Math.abs(emaGap) <= 0.5 &&
      rsi >= 45 &&
      rsi <= 55
    ) {

      setup = "RB";
      verdict = "WATCH";
      priority = "Medium";
      reason = "Potential range breakout";
      tradeStatus = "Range Building";

    }

  }

  // =================================
  // WATCHLIST FOLLOW-UP
  // =================================

  if (mode === "watchlist") {

    const prevEntryHigh =
      parseFloat(
        document.getElementById("prevEntryHigh").value
      );

    const prevSL =
      parseFloat(
        document.getElementById("prevSL").value
      );

    if (
      isNaN(prevEntryHigh) ||
      isNaN(prevSL)
    ) {
      alert("Fill Watchlist fields");
      return;
    }

    if (
      ltp > prevEntryHigh &&
      ema20 > ema50 &&
      rsi > 55
    ) {

      verdict = "BUY";
      priority = "High";
      setup = "Watchlist Triggered";
      reason = "Trigger breakout confirmed";
      tradeStatus = "Execute Trade";

    }

    else if (
      ema20 > ema50 &&
      ltp > ema20 &&
      rsi >= 50
    ) {

      verdict = "WATCH";
      priority = "Medium";
      setup = "Watchlist Active";
      reason = "Setup still valid";
      tradeStatus = "Hold Watchlist";

    }

    else {

      verdict = "AVOID";
      priority = "Low";
      setup = "Watchlist Failed";
      reason = "Momentum weakened";
      tradeStatus = "Remove from Watchlist";

    }

  }

  // =================================
  // ACTIVE TRADE FOLLOW-UP
  // =================================

  if (mode === "active") {

    const executedEntry =
      parseFloat(
        document.getElementById("executedEntry").value
      );

    const currentTarget =
      parseFloat(
        document.getElementById("currentTarget").value
      );

    const currentSL =
      parseFloat(
        document.getElementById("currentSL").value
      );

    if (
      isNaN(executedEntry) ||
      isNaN(currentTarget) ||
      isNaN(currentSL)
    ) {
      alert("Fill Active Trade fields");
      return;
    }

    const profitDistance =
      ltp - executedEntry;

    const initialRisk =
      executedEntry - currentSL;

    // EXIT

    if (
      ltp < ema20 ||
      rsi < 45
    ) {

      verdict = "AVOID";
      priority = "High";
      setup = "Trade Breakdown";
      reason = "Trend weakening";
      tradeStatus = "Exit Trade";

    }

    // PARTIAL EXIT

    else if (
      ltp >= currentTarget * 0.95 ||
      rsi > 75
    ) {

      verdict = "WATCH";
      priority = "Medium";
      setup = "Target Near";
      reason = "Book partial profits";
      tradeStatus = "Partial Profit Zone";

    }

    // TRAIL SL

    else if (
      profitDistance >= initialRisk
    ) {

      verdict = "BUY";
      priority = "High";
      setup = "Trade in Profit";
      reason = "Trail stop loss";
      tradeStatus = "Trail SL";

    }

    // HOLD

    else {

      verdict = "BUY";
      priority = "Medium";
      setup = "Trade Active";
      reason = "Trend intact";
      tradeStatus = "Hold Trade";

    }

  }

  let entryLow;
  let entryHigh;
  let triggerLow = null;
  let triggerHigh = null;

  if (verdict === "BUY") {

    entryLow = ltp;
    entryHigh = ltp + (ltp * tolerance);

  } else {

    entryLow =
      ema20 - (ema20 * tolerance);

    entryHigh =
      ema20 + (ema20 * tolerance);

    triggerLow = entryHigh;

    triggerHigh =
      entryHigh +
      (entryHigh * tolerance * 0.5);

  }

  let stopLoss = ema50;

  if (stopLoss >= entryLow) {
    stopLoss = entryLow - (entryLow * 0.02);
  }

  const risk =
    entryLow - stopLoss;

  const targetBase =
    verdict === "WATCH"
      ? triggerHigh
      : entryHigh;

  const target =
    targetBase +
    (2 * risk) +
    (targetBase * chargesBuffer);

  let verdictClass = "avoid";

  if (verdict === "BUY") {
    verdictClass = "buy";
  }

  if (verdict === "WATCH") {
    verdictClass = "watch";
  }

  const resultContent =
    document.getElementById("resultContent");

  resultContent.innerHTML = `

    <div class="result-grid">

      <div class="result-item">
        <h4>Mode</h4>
        <p>${mode}</p>
      </div>

      <div class="result-item">
        <h4>Stock Name</h4>
        <p>${stockName}</p>
      </div>

      <div class="result-item">
        <h4>Setup</h4>
        <p>${setup}</p>
      </div>

      <div class="result-item">
        <h4>Action</h4>
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
        <h4>Trade Status</h4>
        <p>${tradeStatus}</p>
      </div>

    </div>
  `;

  document
    .getElementById("resultCard")
    .classList.remove("hidden");

  }
