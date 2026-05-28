// =========================
// SETUP ENGINE
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
  // EMA STRUCTURE
  // =========================

  // STRONG BULLISH TREND

  if (

    ltp > ema20 &&
    ema20 > ema50

  ) {

    cbScore += 35;

    pcScore += 35;

    rbScore += 20;

  }

  // MODERATE TREND

  else if (

    ltp > ema20

  ) {

    cbScore += 20;

    pcScore += 25;

    rbScore += 15;

  }

  // WEAK TREND

  else {

    cbScore += 5;

    pcScore += 5;

    rbScore += 10;

  }

  // =========================
  // RSI ANALYSIS
  // =========================

  // STRONG MOMENTUM

  if (

    rsi >= 60 &&
    rsi <= 75

  ) {

    cbScore += 30;

    pcScore += 25;

    rbScore += 20;

  }

  // MODERATE MOMENTUM

  else if (

    rsi >= 50

  ) {

    cbScore += 15;

    pcScore += 20;

    rbScore += 15;

  }

  // OVERBOUGHT

  else if (

    rsi > 75

  ) {

    cbScore += 10;

    pcScore += 5;

    rbScore += 5;

  }

  // WEAK MOMENTUM

  else {

    cbScore += 0;

    pcScore += 5;

    rbScore += 10;

  }

  // =========================
  // EMA DISTANCE ANALYSIS
  // =========================

  const distanceFromEMA20 =

    (
      (ltp - ema20) / ema20
    ) * 100;

  // CONTINUATION BREAKOUT

  if (

    distanceFromEMA20 >= 2 &&
    distanceFromEMA20 <= 6

  ) {

    cbScore += 30;

  }

  // PULLBACK CONTINUATION

  if (

    distanceFromEMA20 >= -2 &&
    distanceFromEMA20 <= 2

  ) {

    pcScore += 35;

  }

  // RANGE BREAKOUT

  if (

    distanceFromEMA20 >= 6

  ) {

    rbScore += 35;

  }

  // =========================
  // TIMEFRAME ADJUSTMENTS
  // =========================

  if (timeframe === "15 Min") {

    // MORE VOLATILITY

    rbScore += 5;

  }

  else if (
    timeframe === "Daily"
  ) {

    // MORE RELIABLE TREND

    cbScore += 5;

    pcScore += 5;

  }

  // =========================
  // SCORE LIMITS
  // =========================

  cbScore = Math.min(
    cbScore,
    100
  );

  pcScore = Math.min(
    pcScore,
    100
  );

  rbScore = Math.min(
    rbScore,
    100
  );

  // =========================
  // RETURN
  // =========================

  return {

    cbScore,

    pcScore,

    rbScore

  };

}
