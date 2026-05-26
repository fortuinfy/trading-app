// =========================
// SETUP ENGINE
// =========================

window.calculateSetupScores =
function(data) {

  // =========================
  // INPUTS
  // =========================

  const {

    ltp,
    ema20,
    ema50,
    rsi,
    timeframe

  } = data;

  // =========================
  // CONFIG
  // =========================

  const config =
    window.APP_CONFIG;

  const timeframeConfig =

    timeframe === "Daily"

      ?

      config.timeframeSettings.daily

      :

      config.timeframeSettings.intraday15m;

  const tolerance =
    timeframeConfig.emaTolerance;

  // =========================
  // CALCULATIONS
  // =========================

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

    emaGap <=
    config.rb.conditions
      .emaCompressionLimit;

  // =========================
  // INITIAL SCORES
  // =========================

  let cbScore = 0;
  let pcScore = 0;
  let rbScore = 0;

  // =========================
  // CB SCORING
  // =========================

  if (ltp > ema20) {

    cbScore +=
      config.cb.scoring
        .ltpAboveEMA20;

  }

  if (ema20 > ema50) {

    cbScore +=
      config.cb.scoring
        .emaAlignment;

  }

  if (

    emaGap >=
    config.cb.conditions
      .emaGapMinimum

  ) {

    cbScore +=
      config.cb.scoring
        .emaGapStrength;

  }

  if (

    rsi >=
    config.cb.conditions
      .rsiBuyMin

    &&

    rsi <=
    config.cb.conditions
      .rsiBuyMax

  ) {

    cbScore +=
      config.cb.scoring
        .rsiStrength;

  }

  // =========================
  // PC SCORING
  // =========================

  if (ema20 > ema50) {

    pcScore +=
      config.pc.scoring
        .emaAlignment;

  }

  if (nearEMA20) {

    pcScore +=
      config.pc.scoring
        .ema20Proximity;

  }

  if (

    rsi >=
    config.pc.conditions
      .rsiWatchMin

    &&

    rsi <=
    config.pc.conditions
      .rsiBuyMax

  ) {

    pcScore +=
      config.pc.scoring
        .rsiSupport;

  }

  // =========================
  // RB SCORING
  // =========================

  if (emaCompressed) {

    rbScore +=
      config.rb.scoring
        .emaCompression;

  }

  if (

    rsi >=
    config.rb.conditions
      .rsiNeutralMin

    &&

    rsi <=
    config.rb.conditions
      .rsiNeutralMax

  ) {

    rbScore +=
      config.rb.scoring
        .neutralRSI;

  }

  if (nearEMA20) {

    rbScore +=
      config.rb.scoring
        .emaProximity;

  }

  // =========================
  // SETUP DETECTION
  // =========================

  let setup = "None";
  let setupScore = 0;

  // =========================
  // RB PRIORITY
  // =========================

  if (

    emaCompressed

    &&

    rsi >=
    config.rb.conditions
      .rsiNeutralMin

    &&

    rsi <=
    config.rb.conditions
      .rsiNeutralMax

  ) {

    setup = "RB";
    setupScore = rbScore;

  }

  // =========================
  // PC PRIORITY
  // =========================

  else if (

    nearEMA20

    &&

    ema20 > ema50

  ) {

    setup = "PC";
    setupScore = pcScore;

  }

  // =========================
  // CB PRIORITY
  // =========================

  else if (

    ltp > ema20

    &&

    ema20 > ema50

  ) {

    setup = "CB";
    setupScore = cbScore;

  }

  // =========================
  // RETURN
  // =========================

  return {

    cbScore,
    pcScore,
    rbScore,

    setup,
    setupScore,

    distance,
    emaGap,

    nearEMA20,
    emaCompressed,

    tolerance

  };

};
