// =========================
// VERDICT ENGINE
// =========================

window.generateVerdict =
function(data) {

  // =========================
  // INPUTS
  // =========================

  const {

    setup,
    setupScore,

    cbScore,
    pcScore,
    rbScore,

    ltp,
    ema20,
    ema50,
    rsi,

    timeframe,

    distance,

    momentumScore,
    weaknessDetected,
    advancedEnabled

  } = data;

  // =========================
  // CONFIG
  // =========================

  const config =
    window.APP_CONFIG;

  // =========================
  // TIMEFRAME CONFIG
  // =========================

  const timeframeConfig =

    timeframe === "Daily"

      ?

      config.timeframeSettings.daily

      :

      config.timeframeSettings.intraday15m;

  // =========================
  // INITIAL VALUES
  // =========================

  let verdict =
    config.verdicts.avoid;

  let priority =
    config.priority.low;

  let reasonList = [];

  // =========================
  // OVEREXTENDED FILTER
  // =========================

  if (

    distance >
    timeframeConfig
      .overextendedLimit

  ) {

    verdict =
      config.verdicts.avoid;

    priority =
      config.priority.low;

    reasonList.push(
      "Price excessively extended above EMA20."
    );

    return {

      verdict,
      priority,
      reasonList

    };

  }

  // =========================
  // CB VERDICT ENGINE
  // =========================

  if (setup === "CB") {

    // BUY

    if (

      cbScore >=
      config.cb.conditions
        .minimumBuyScore

      &&

      rsi >=
      config.cb.conditions
        .rsiBuyMin

    ) {

      verdict =
        config.verdicts.buy;

      priority =
        config.priority.high;

      reasonList.push(
        "Strong EMA continuation structure detected."
      );

      reasonList.push(
        "RSI confirms bullish momentum."
      );

    }

    // WATCH

    else {

      verdict =
        config.verdicts.watch;

      priority =
        config.priority.medium;

      reasonList.push(
        "Breakout structure developing."
      );

    }

  }

  // =========================
  // PC VERDICT ENGINE
  // =========================

  if (setup === "PC") {

    // BUY

    if (

      pcScore >=
      config.pc.conditions
        .minimumBuyScore

      &&

      rsi >=
      config.pc.conditions
        .rsiBuyMin

    ) {

      verdict =
        config.verdicts.buy;

      priority =
        config.priority.high;

      reasonList.push(
        "Healthy pullback continuation detected."
      );

      reasonList.push(
        "Trend structure remains supportive."
      );

    }

    // WATCH

    else {

      verdict =
        config.verdicts.watch;

      priority =
        config.priority.medium;

      reasonList.push(
        "Pullback setup still developing."
      );

    }

  }

  // =========================
  // RB VERDICT ENGINE
  // =========================

  if (setup === "RB") {

    // BUY

    if (

      rbScore >=
      config.rb.conditions
        .minimumBuyScore

      &&

      momentumScore >=
      config.momentum.conditions
        .moderateMomentumScore

    ) {

      verdict =
        config.verdicts.buy;

      priority =
        config.priority.high;

      reasonList.push(
        "Breakout energy building strongly."
      );

      reasonList.push(
        "Momentum expansion confirms breakout probability."
      );

    }

    // WATCH

    else {

      verdict =
        config.verdicts.watch;

      priority =
        config.priority.medium;

      reasonList.push(
        "Range breakout structure forming."
      );

    }

  }

  // =========================
  // ADVANCED REFINEMENT
  // =========================

  if (advancedEnabled) {

    // BUY DOWNGRADE

    if (

      verdict ===
      config.verdicts.buy

      &&

      weaknessDetected

      &&

      config.weaknessEngine
        .enableWeakMomentumDowngrade

    ) {

      verdict =
        config.verdicts.watch;

      priority =
        config.priority.medium;

      reasonList.push(
        "Advanced candle analysis downgraded BUY due to weakening momentum."
      );

    }

    // MOMENTUM CONFIRMATION

    if (

      momentumScore >=
      config.momentum.conditions
        .strongMomentumScore

    ) {

      reasonList.push(
        "Momentum score confirms strong bullish participation."
      );

    }

    // WEAK MOMENTUM

    if (

      momentumScore <
      config.momentum.conditions
        .moderateMomentumScore

    ) {

      reasonList.push(
        "Momentum score indicates weak continuation strength."
      );

    }

  }

  // =========================
  // EMA STRUCTURE WARNING
  // =========================

  if (ema20 < ema50) {

    reasonList.push(
      "Trend alignment weakening."
    );

  }

  // =========================
  // LOW RSI WARNING
  // =========================

  if (rsi < 45) {

    reasonList.push(
      "RSI indicates weak momentum structure."
    );

  }

  // =========================
  // RETURN
  // =========================

  return {

    verdict,
    priority,
    reasonList

  };

};
