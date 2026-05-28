// =========================
// GENERATE REASONS
// =========================

function generateReasons(data) {

  const reasons = [];

  const {

    setup,

    verdict,

    cbScore,
    pcScore,
    rbScore,

    setupScore,

    momentumScore,

    momentumTrend,
    participationTrend,

    relativeVolumeStatus,

    weaknessDetected,

    ltp,
    ema20,
    ema50,
    rsi,

    advancedEnabled

  } = data;

  // =========================
  // TREND STRUCTURE
  // =========================

  if (
    ltp > ema20 &&
    ema20 > ema50
  ) {

    reasons.push(

      "Price is trading above EMA20 and EMA50, indicating bullish trend structure."

    );

  }

  else if (
    ltp > ema20
  ) {

    reasons.push(

      "Price is holding above EMA20 but broader trend strength remains moderate."

    );

  }

  else {

    reasons.push(

      "Price is trading below key moving averages, showing weak market structure."

    );

  }

  // =========================
  // RSI ANALYSIS
  // =========================

  if (
    rsi >= 60 &&
    rsi <= 75
  ) {

    reasons.push(

      "RSI is in bullish momentum zone with healthy buying strength."

    );

  }

  else if (
    rsi >= 50
  ) {

    reasons.push(

      "RSI remains supportive but momentum strength is moderate."

    );

  }

  else {

    reasons.push(

      "RSI is weak and does not support aggressive bullish positioning."

    );

  }

  // =========================
  // SETUP STRENGTH
  // =========================

  if (setup === "CB") {

    reasons.push(

      "Continuation Breakout structure detected with bullish continuation characteristics."

    );

  }

  else if (setup === "PC") {

    reasons.push(

      "Pullback Continuation structure detected near trend support zone."

    );

  }

  else if (setup === "RB") {

    reasons.push(

      "Range Breakout structure detected with expansion potential."

    );

  }

  // =========================
  // SCORE STRENGTH
  // =========================

  if (
    setupScore >= 75
  ) {

    reasons.push(

      "Overall setup quality is strong based on multi-engine scoring."

    );

  }

  else if (
    setupScore >= 55
  ) {

    reasons.push(

      "Setup quality is moderate and requires confirmation."

    );

  }

  else {

    reasons.push(

      "Setup quality is weak and lacks strong confirmation signals."

    );

  }

  // =========================
  // ADVANCED ENGINE
  // =========================

  if (advancedEnabled) {

    reasons.push(

      "Advanced momentum engine enabled for deeper participation analysis."

    );

    // =========================
    // MOMENTUM
    // =========================

    if (
      momentumScore >= 70
    ) {

      reasons.push(

        "Momentum structure is strong with healthy price continuation."

      );

    }

    else if (
      momentumScore >= 50
    ) {

      reasons.push(

        "Momentum structure is stable but lacks aggressive expansion."

      );

    }

    else {

      reasons.push(

        "Momentum structure is weak and continuation probability is lower."

      );

    }

    // =========================
    // PARTICIPATION
    // =========================

    reasons.push(

      "Participation Trend: " +
      participationTrend

    );

    // =========================
    // RELATIVE VOLUME
    // =========================

    reasons.push(

      "Relative Volume Status: " +
      relativeVolumeStatus

    );

    // =========================
    // WEAKNESS DETECTION
    // =========================

    if (weaknessDetected) {

      reasons.push(

        "Early weakness signals detected in recent candle participation."

      );

    }

  }

  // =========================
  // FINAL VERDICT LOGIC
  // =========================

  if (verdict === "BUY") {

    reasons.push(

      "Overall conditions support fresh bullish opportunity."

    );

  }

  else if (
    verdict === "WATCH"
  ) {

    reasons.push(

      "Setup requires additional confirmation before aggressive entry."

    );

  }

  else if (
    verdict === "AVOID"
  ) {

    reasons.push(

      "Risk-reward structure currently does not support fresh positioning."

    );

  }

  // =========================
  // RETURN
  // =========================

  return reasons;

}
