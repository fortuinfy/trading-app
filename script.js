function analyzeStock() {

  const stockName = document.getElementById("stockName").value;
  const timeframe = document.getElementById("timeframe").value;

  const ltp = parseFloat(document.getElementById("ltp").value);
  const ema20 = parseFloat(document.getElementById("ema20").value);
  const ema50 = parseFloat(document.getElementById("ema50").value);
  const rsi = parseFloat(document.getElementById("rsi").value);

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

  const tolerance = timeframe === "Daily" ? 0.02 : 0.005;
  const chargesBuffer = timeframe === "Daily" ? 0.005 : 0.003;

  const distance = (ltp - ema20) / ema20;
  const emaGap = ((ema20 - ema50) / ema50) * 100;

  let cbScore = 0;
  let pcScore = 0;
  let rbScore = 0;

  // CB Score
  if (ltp > ema20) cbScore += 25;
  if (ema20 > ema50) cbScore += 25;
  if (emaGap >= 0.5) cbScore += 25;
  if (rsi >= 55 && rsi <= 70) cbScore += 25;

  // PC Score
  if (ema20 > ema50) pcScore += 30;
  if (Math.abs(distance) <= tolerance) pcScore += 40;
  if (rsi >= 50 && rsi <= 60) pcScore += 30;

  // RB Score
  if (Math.abs(emaGap) <= 0.5) rbScore += 40;
  if (rsi >= 45 && rsi <= 55) rbScore += 30;
  if (Math.abs(distance) <= tolerance) rbScore += 30;

  let setup = "None";
  let verdict = "AVOID";
  let priority = "Low";
  let reason = "No valid setup";

  // Extension Rule
  if (
    (timeframe === "Daily" && distance > 0.05) ||
    (timeframe === "15 Min" && distance > 0.01)
  ) {

    verdict = "AVOID";
    reason = "Overextended";

  } else {

    // CB
    if (
      ltp > ema20 &&
      ema20 > ema50 &&
      emaGap >= 0.5 &&
      rsi > 55
    ) {

      setup = "CB";
      verdict = "BUY";
      priority = "High";
      reason = "Strong continuation breakout setup";

    }

    // PC
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

    }

    // RB
    else if (
      Math.abs(emaGap) <= 0.5 &&
      rsi >= 45 &&
      rsi <= 55
    ) {

      setup = "RB";
      verdict = "WATCH";
      priority = "Medium";
      reason = "Potential range breakout setup";

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

    entryLow = ema20 - (ema20 * tolerance);
    entryHigh = ema20 + (ema20 * tolerance);

    triggerLow = entryHigh;
    triggerHigh = entryHigh + (entryHigh * tolerance * 0.5);

  }

  let stopLoss = ema50;

  if (stopLoss >= entryLow) {
    stopLoss = entryLow - (entryLow * 0.02);
  }

  const risk = entryLow - stopLoss;

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

  const resultContent = document.getElementById("resultContent");

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
        <h4>Action</h4>
        <p class="${verdictClass}">${verdict}</p>
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

    <div class="trade-plan">

      <h3>Trade Plan</h3>

      <div class="result-grid">

        <div class="result-item">
          <h4>Entry Range</h4>
          <p>${entryLow.toFixed(2)} - ${entryHigh.toFixed(2)}</p>
        </div>

        ${
          verdict === "WATCH"
            ? `
              <div class="result-item">
                <h4>Trigger Zone</h4>
                <p>${triggerLow.toFixed(2)} - ${triggerHigh.toFixed(2)}</p>
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
  `;

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

  document.getElementById("resultCard").classList.remove("hidden");

}

function calculatePosition(entry, stopLoss) {

  const capital = parseFloat(document.getElementById("capital").value);
  const riskPercent = parseFloat(document.getElementById("riskPercent").value);

  const riskPerShare = entry - stopLoss;
  const riskAmount = capital * (riskPercent / 100);

  const qty = Math.floor(riskAmount / riskPerShare);

  document.getElementById("qtyResult").innerHTML =
    "Suggested Quantity: " + qty + " shares";

}
