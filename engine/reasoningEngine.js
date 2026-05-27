// =========================
// REASONING ENGINE
// =========================

window.generateReasons =
function(data) {

  // =========================
  // INPUTS
  // =========================

  const {

    setup,
    verdict,
    priority,

    cbScore,
    pcScore,
    rbScore,

    ltp,
    ema20,
    ema50,
    rsi,

    momentumScore,
    momentumTrend,

    relativeVolumeStatus,
    participationTrend,

    weaknessDetected,

    advancedEnabled,

    advancedReasons

  } = data;

  // =========================
  // CONFIG
  // =========================

  const config =
    window.APP_CONFIG;

  // =========================
  // REASON STORAGE
  // =========================

  let reasons = [];

  // =========================
  // CB REASONS
  // =========================

  if (setup === "CB") {

    if (ltp > ema20) {

      reasons.push(
        "Price trading above EMA20."
      );

    }

    if (ema20 > ema50) {

      reasons.push(
        "Bullish trend alignment confirmed."
      );

    }

    if (

      rsi >=
      config.cb.conditions
        .rsiBuyMin

    ) {

      reasons.push(
        "RSI confirms bullish momentum."
      );

    }

    if (

      cbScore >=
      config.cb.conditions
        .minimumBuyScore

    ) {

      reasons.push(
        "Continuation breakout structure remains strong."
      );

    }

  }

  // =========================
  // PC REASONS
  // =========================

  if (setup === "PC") {

    reasons.push(
      "Price positioned near EMA20 support zone."
    );

    if (ema20 > ema50) {

      reasons.push(
        "Trend structure remains bullish."
      );

    }

    if (

      rsi >=
      config.pc.conditions
        .rsiWatchMin

    ) {

      reasons.push(
        "RSI indicates healthy pullback behavior."
      );

    }

    if (

      pcScore >=
      config.pc.conditions
        .minimumBuyScore

    ) {

      reasons.push(
        "Pullback continuation setup remains valid."
      );

    }

  }

  // =========================
  // RB REASONS
  // =========================

  if (setup === "RB") {

    reasons.push(
      "EMA compression detected."
    );

    reasons.push(
      "Breakout energy building gradually."
    );

    if (

      rsi >=
      config.rb.conditions
        .rsiNeutralMin

      &&

      rsi <=
      config.rb.conditions
        .rsiNeutralMax

    ) {

      reasons.push(
        "RSI remains neutral before breakout."
      );

    }

  }

  // =========================
  // VERDICT REASONS
  // =========================

  if (
    verdict === config.verdicts.buy
  ) {

    reasons.push(
      "Setup quality supports bullish opportunity."
    );

  }

  if (
    verdict === config.verdicts.watch
  ) {

    reasons.push(
      "Setup still requires additional confirmation."
    );

  }

  if (
    verdict === config.verdicts.avoid
  ) {

    reasons.push(
      "Risk-reward structure currently unfavorable."
    );

  }

  // =========================
  // PRIORITY REASONS
  // =========================

  if (
    priority === config.priority.high
  ) {

    reasons.push(
      "High-priority setup conditions satisfied."
    );

  }

  if (
    priority === config.priority.medium
  ) {

    reasons.push(
      "Moderate conviction setup detected."
    );

  }

  // =========================
  // MOMENTUM REASONS
  // =========================

  if (advancedEnabled) {

    if (

      momentumScore >=
      config.momentum.conditions
        .strongMomentumScore

    ) {

      reasons.push(
        "Strong momentum expansion detected."
      );

    }

    else if (

      momentumScore >=
      config.momentum.conditions
        .moderateMomentumScore

    ) {

      reasons.push(
        "Momentum remains supportive."
      );

    }

    else {

      reasons.push(
        "Momentum strength remains weak."
      );

    }

    // =========================
    // PARTICIPATION REASONS
    // =========================

    if (
      relativeVolumeStatus === "High"
    ) {

      reasons.push(
        "Strong participation volume detected."
      );

    }

    if (
      relativeVolumeStatus === "Normal"
    ) {

      reasons.push(
        "Market participation remains stable."
      );

    }

    if (
      relativeVolumeStatus === "Low"
    ) {

      reasons.push(
        "Participation volume remains weak."
      );

    }

    // =========================
    // WEAKNESS REASONS
    // =========================

    if (weaknessDetected) {

      reasons.push(
        "Weakness signals detected in recent candles."
      );

    }

    // =========================
    // ADVANCED ENGINE REASONS
    // =========================

    if (

      Array.isArray(
        advancedReasons
      )

    ) {

      advancedReasons.forEach(
        reason => {

          reasons.push(reason);

        }
      );

    }

  }

  // =========================
  // RSI EXTREMES
  // =========================

  if (rsi >= 75) {

    reasons.push(
      "RSI approaching overbought territory."
    );

  }

  if (rsi <= 40) {

    reasons.push(
      "RSI indicates weak momentum structure."
    );

  }

  // =========================
  // TREND WARNING
  // =========================

  if (ema20 < ema50) {

    reasons.push(
      "Trend alignment weakening."
    );

  }

  // =========================
  // REMOVE DUPLICATES
  // =========================

  reasons =
    [...new Set(reasons)];

  // =========================
  // RETURN
  // =========================

  return reasons;

};
