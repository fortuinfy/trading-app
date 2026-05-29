// =========================
// CALCULATE SETUP SCORES
// =========================

function calculateSetupScores(data) {

  const {

    ltp,
    ema20,
    ema50,
    rsi,
    timeframe

  } = data;

  // =========================
  // INITIAL SCORES
  // =========================

  let cbScore = 0;
  let pcScore = 0;
  let rbScore = 0;

  // =========================
  // TREND STRUCTURE
  // =========================

  const strongTrend =

    ltp > ema20 &&
    ema20 > ema50;

  const moderateTrend =

    ltp > ema20;

  // =========================
  // RSI STRUCTURE
  // =========================

  const bullishRSI =

    rsi >= 55 &&
    rsi <= 75;

  const strongRSI =

    rsi >= 60 &&
    rsi <= 72;

  const weakRSI =
    rsi < 45;

  const overExtendedRSI =
    rsi > 78;

  // =========================
  // CONTINUATION BREAKOUT
  // =========================

  if (strongTrend)
    cbScore += 40;

  if (strongRSI)
    cbScore += 30;

  if (
    ltp > ema20 &&
    ltp > ema50
  ) {
    cbScore += 20;
  }

  if (
    timeframe === "Daily"
  ) {
    cbScore += 10;
  }

  // =========================
  // PULLBACK CONTINUATION
  // =========================

  if (moderateTrend)
    pcScore += 30;

  if (bullishRSI)
    pcScore += 20;

  if (
    ltp >= ema20
  ) {
    pcScore += 15;
  }

  if (
    ema20 > ema50
  ) {
    pcScore += 20;
  }

  if (
    timeframe === "Daily"
  ) {
    pcScore += 15;
  }

  // =========================
  // REVERSAL BREAKOUT
  // =========================

  if (
    ltp > ema20
  ) {
    rbScore += 25;
  }

  if (
    rsi >= 50
  ) {
    rbScore += 20;
  }

  if (
    ema20 > ema50
  ) {
    rbScore += 20;
  }

  if (
    timeframe === "Daily"
  ) {
    rbScore += 15;
  }

  if (
    rsi >= 60
  ) {
    rbScore += 20;
  }

  // =========================
  // PENALTIES
  // =========================

  if (weakRSI) {

    cbScore -= 25;
    pcScore -= 25;
    rbScore -= 25;

  }

  if (overExtendedRSI) {

    cbScore -= 10;
    pcScore -= 15;

  }

  // =========================
  // CLAMP SCORES
  // =========================

  cbScore = Math.max(
    0,
    Math.min(
      100,
      Math.round(cbScore)
    )
  );

  pcScore = Math.max(
    0,
    Math.min(
      100,
      Math.round(pcScore)
    )
  );

  rbScore = Math.max(
    0,
    Math.min(
      100,
      Math.round(rbScore)
    )
  );

  // =========================
  // FINAL SETUP SCORE
  // =========================

  const setupScore = Math.max(

    cbScore,
    pcScore,
    rbScore

  );

  // =========================
  // RETURN OBJECT
  // =========================

  return {

    setupScore,

    cbScore,

    pcScore,

    rbScore

  };

}
