// =========================
// TRADE PLAN ENGINE
// =========================

function generateTradePlan(data) {

  const {

    verdict,

    setup,

    setupScore,

    ltp,

    ema20,
    ema50,

    rsi,

    momentumScore,

    weaknessDetected

  } = data;

  // =========================
  // DEFAULTS
  // =========================

  let entryZone =
    "N/A";

  let triggerZone =
    "N/A";

  let stopLoss =
    "N/A";

  let target =
    "N/A";

  let tradeAction =
    "No Trade Suggested";

  let riskLevel =
    "High";

  // =========================
  // BUY LOGIC
  // =========================

  if (verdict === "BUY") {

    tradeAction =
      "Fresh Entry Opportunity";

    riskLevel =
      "Moderate";

    // =========================
    // CB SETUP
    // =========================

    if (setup === "CB") {

      entryZone =
        (ltp * 0.995).toFixed(2) +
        " - " +
        (ltp * 1.005).toFixed(2);

      triggerZone =
        (ltp * 1.01).toFixed(2);

      stopLoss =
        ema20.toFixed(2);

      target =
        (ltp * 1.08).toFixed(2);

    }

    // =========================
    // PC SETUP
    // =========================

    else if (setup === "PC") {

      entryZone =
        ema20.toFixed(2) +
        " - " +
        ltp.toFixed(2);

      triggerZone =
        (ltp * 1.005).toFixed(2);

      stopLoss =
        (ema20 * 0.98).toFixed(2);

      target =
        (ltp * 1.06).toFixed(2);

    }

    // =========================
    // RB SETUP
    // =========================

    else if (setup === "RB") {

      entryZone =
        (ltp * 0.998).toFixed(2) +
        " - " +
        (ltp * 1.01).toFixed(2);

      triggerZone =
        (ltp * 1.015).toFixed(2);

      stopLoss =
        ema20.toFixed(2);

      target =
        (ltp * 1.10).toFixed(2);

    }

    // =========================
    // MOMENTUM BOOST
    // =========================

    if (

      momentumScore >= 75 &&

      !weaknessDetected

    ) {

      riskLevel =
        "Controlled";

    }

  }

  // =========================
  // WATCH LOGIC
  // =========================

  else if (
    verdict === "WATCH"
  ) {

    tradeAction =
      "Wait For Confirmation";

    riskLevel =
      "Moderate";

    triggerZone =
      (ltp * 1.01).toFixed(2);

    stopLoss =
      ema20.toFixed(2);

    target =
      "Pending Confirmation";

  }

  // =========================
  // AVOID LOGIC
  // =========================

  else {

    tradeAction =
      "Avoid Fresh Position";

    riskLevel =
      "High";

    stopLoss =
      "Structure Weak";

    target =
      "N/A";

  }

  // =========================
  // RSI WARNING
  // =========================

  let warning = "";

  if (rsi > 75) {

    warning =
      "Stock may be overextended based on RSI.";

  }

  if (weaknessDetected) {

    warning =
      "Weak participation detected in recent candles.";

  }

  // =========================
  // RETURN
  // =========================

  return {

    entryZone,

    triggerZone,

    stopLoss,

    target,

    tradeAction,

    riskLevel,

    warning

  };

}
