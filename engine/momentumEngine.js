// =========================
// MOMENTUM ENGINE
// =========================

function calculateMomentum(data) {

  const {

    advancedEnabled,
    candles

  } = data;

  // =========================
  // DEFAULT RESPONSE
  // =========================

  if (!advancedEnabled) {

    return {

      momentumScore: 0,

      relativeVolumeStatus:
        "Not Enabled",

      momentumTrend:
        "Basic Engine Only",

      participationTrend:
        "Basic Engine Only",

      weaknessDetected: false

    };

  }

  // =========================
  // INITIAL VARIABLES
  // =========================

  let momentumScore = 0;

  let bullishCandles = 0;

  let bearishCandles = 0;

  let risingCloses = 0;

  let fallingCloses = 0;

  let increasingVolume = 0;

  let decreasingVolume = 0;

  let weaknessDetected = false;

  // =========================
  // BULLISH / BEARISH COUNT
  // =========================

  candles.forEach(candle => {

    if (
      candle.nature === "Bullish"
    ) {

      bullishCandles++;

    }

    else {

      bearishCandles++;

    }

  });

  // =========================
  // CLOSE ANALYSIS
  // =========================

  for (let i = 0; i < candles.length - 1; i++) {

    // =========================
    // PRICE MOMENTUM
    // =========================

    if (

      candles[i].close >

      candles[i + 1].close

    ) {

      risingCloses++;

    }

    else {

      fallingCloses++;

    }

    // =========================
    // VOLUME MOMENTUM
    // =========================

    if (

      candles[i].volume >

      candles[i + 1].volume

    ) {

      increasingVolume++;

    }

    else {

      decreasingVolume++;

    }

  }

  // =========================
  // BULLISH PARTICIPATION
  // =========================

  momentumScore +=
    bullishCandles * 10;

  // =========================
  // PRICE MOMENTUM
  // =========================

  momentumScore +=
    risingCloses * 10;

  // =========================
  // VOLUME PARTICIPATION
  // =========================

  momentumScore +=
    increasingVolume * 10;

  // =========================
  // MOMENTUM TREND
  // =========================

  let momentumTrend =
    "Neutral Momentum";

  if (

    bullishCandles >= 4 &&
    risingCloses >= 3

  ) {

    momentumTrend =
      "Strong Bullish Momentum";

  }

  else if (

    bullishCandles >= 3

  ) {

    momentumTrend =
      "Moderate Bullish Momentum";

  }

  else if (

    bearishCandles >= 4

  ) {

    momentumTrend =
      "Strong Bearish Momentum";

  }

  // =========================
  // PARTICIPATION TREND
  // =========================

  let participationTrend =
    "Neutral Participation";

  if (

    increasingVolume >= 3

  ) {

    participationTrend =
      "Strong Participation";

  }

  else if (

    increasingVolume >= 2

  ) {

    participationTrend =
      "Moderate Participation";

  }

  else {

    participationTrend =
      "Weak Participation";

  }

  // =========================
  // RELATIVE VOLUME
  // =========================

  const latestVolume =
    candles[0].volume;

  let averageVolume = 0;

  candles.forEach(candle => {

    averageVolume += candle.volume;

  });

  averageVolume =
    averageVolume /
    candles.length;

  const relativeVolume =

    latestVolume /
    averageVolume;

  let relativeVolumeStatus =
    "Normal";

  if (

    relativeVolume >= 1.8

  ) {

    relativeVolumeStatus =
      "Very High";

  }

  else if (

    relativeVolume >= 1.3

  ) {

    relativeVolumeStatus =
      "High";

  }

  else if (

    relativeVolume <= 0.7

  ) {

    relativeVolumeStatus =
      "Low";

  }

  // =========================
  // WEAKNESS DETECTION
  // =========================

  if (

    candles[0].nature === "Bearish" &&

    candles[0].volume >
    candles[1].volume

  ) {

    weaknessDetected = true;

    momentumScore -= 15;

  }

  // =========================
  // SCORE LIMITS
  // =========================

  if (momentumScore > 100) {

    momentumScore = 100;

  }

  if (momentumScore < 0) {

    momentumScore = 0;

  }

  // =========================
  // RETURN
  // =========================

  return {

    momentumScore,

    relativeVolumeStatus,

    momentumTrend,

    participationTrend,

    weaknessDetected

  };

}
