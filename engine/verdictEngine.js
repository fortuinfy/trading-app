// =========================
// GENERATE VERDICT
// =========================

function generateVerdict(data) {

  const {

    setupScore,
    cbScore,
    pcScore,
    rbScore,

    momentumScore,

    ltp,
    ema20,
    ema50,
    rsi,

    relativeVolumeStatus,
    momentumTrend,
    participationTrend,

    weaknessDetected

  } = data;

  // =========================
  // DEFAULT VALUES
  // =========================

  let verdict = "AVOID";

  let priority = "Low";

  let setup = "NONE";

  let tradeAction =
    "No Action";

  // =========================
  // SETUP IDENTIFICATION
  // =========================

  const maxScore = Math.max(

    cbScore,
    pcScore,
    rbScore

  );

  if (maxScore === cbScore)
    setup = "CB";

  if (maxScore === pcScore)
    setup = "PC";

  if (maxScore === rbScore)
    setup = "RB";

  // =========================
  // TREND ALIGNMENT
  // =========================

  const trendAligned =

    ltp > ema20 &&
    ema20 > ema50;

  // =========================
  // RSI QUALITY
  // =========================

  const strongRSI =
    rsi >= 55 &&
    rsi <= 75;

  const weakRSI =
    rsi < 45;

  // =========================
  // MOMENTUM QUALITY
  // =========================

  const strongMomentum =
    momentumScore >= 70;

  const mediumMomentum =
    momentumScore >= 50 &&
    momentumScore < 70;

  const weakMomentum =
    momentumScore < 40;

  // =========================
  // VOLUME QUALITY
  // =========================

  const strongVolume =

    relativeVolumeStatus ===
    "High Relative Volume";

  const weakVolume =

    relativeVolumeStatus ===
    "Low Relative Volume";

  // =========================
  // BUY CONDITIONS
  // =========================

  if (

    setupScore >= 75 &&

    trendAligned &&

    strongRSI &&

    !weaknessDetected &&

    (
      strongMomentum ||
      mediumMomentum
    )

  ) {

    verdict = "BUY";

    priority = "High";

    tradeAction =
      "Execute Trade";

  }

  // =========================
  // WATCH CONDITIONS
  // =========================

  else if (

    setupScore >= 55 &&

    trendAligned &&

    !weakRSI

  ) {

    verdict = "WATCH";

    priority = "Medium";

    tradeAction =
      "Monitor Closely";

  }

  // =========================
  // AVOID CONDITIONS
  // =========================

  else {

    verdict = "AVOID";

    priority = "Low";

    tradeAction =
      "Avoid Trade";

  }

  // =========================
  // EXECUTION CONFIDENCE
  // =========================

  let executionConfidence = 0;

  executionConfidence +=
    setupScore * 0.40;

  executionConfidence +=
    momentumScore * 0.25;

  if (trendAligned)
    executionConfidence += 15;

  if (strongRSI)
    executionConfidence += 10;

  if (strongVolume)
    executionConfidence += 10;

  if (weakVolume)
    executionConfidence -= 10;

  if (weaknessDetected)
    executionConfidence -= 15;

  executionConfidence =
    Math.max(
      0,
      Math.min(
        100,
        Math.round(
          executionConfidence
        )
      )
    );

  // =========================
  // SETUP GRADE
  // =========================

  let setupGrade = "Weak Setup";

  if (executionConfidence >= 85) {

    setupGrade = "A+ Setup";

  }

  else if (
    executionConfidence >= 75
  ) {

    setupGrade = "A Setup";

  }

  else if (
    executionConfidence >= 60
  ) {

    setupGrade = "B Setup";

  }

  else if (
    executionConfidence >= 45
  ) {

    setupGrade = "C Setup";

  }

  // =========================
  // SIGNAL BADGES
  // =========================

  const signalBadges = [];

  // =========================
  // TREND BADGES
  // =========================

  if (trendAligned) {

    signalBadges.push({

      text:
        "Strong Trend Alignment",

      type:
        "green"

    });

  }

  else {

    signalBadges.push({

      text:
        "Trend Misalignment",

      type:
        "red"

    });

  }

  // =========================
  // MOMENTUM BADGES
  // =========================

  if (strongMomentum) {

    signalBadges.push({

      text:
        "Momentum Expansion",

      type:
        "green"

    });

  }

  else if (weakMomentum) {

    signalBadges.push({

      text:
        "Weak Momentum",

      type:
        "red"

    });

  }

  // =========================
  // VOLUME BADGES
  // =========================

  if (strongVolume) {

    signalBadges.push({

      text:
        "High Volume Participation",

      type:
        "blue"

    });

  }

  if (weakVolume) {

    signalBadges.push({

      text:
        "Weak Participation",

      type:
        "yellow"

    });

  }

  // =========================
  // RSI BADGES
  // =========================

  if (strongRSI) {

    signalBadges.push({

      text:
        "Healthy RSI Structure",

      type:
        "green"

    });

  }

  if (weakRSI) {

    signalBadges.push({

      text:
        "Weak RSI Structure",

      type:
        "red"

    });

  }

  // =========================
  // WEAKNESS DETECTION
  // =========================

  if (weaknessDetected) {

    signalBadges.push({

      text:
        "Momentum Weakness Detected",

      type:
        "red"

    });

  }

  // =========================
  // BREAKOUT PROBABILITY
  // =========================

  if (

    setupScore >= 80 &&

    strongMomentum &&

    strongVolume

  ) {

    signalBadges.push({

      text:
        "Breakout Probability High",

      type:
        "green"

    });

  }

  // =========================
  // LATE ENTRY WARNING
  // =========================

  if (
    rsi > 78
  ) {

    signalBadges.push({

      text:
        "Late Entry Risk",

      type:
        "yellow"

    });

  }

  // =========================
  // RISK LEVEL
  // =========================

  let riskLevel = "Medium";

  if (

    trendAligned &&

    strongMomentum &&

    strongVolume &&

    !weaknessDetected

  ) {

    riskLevel = "Low";

  }

  if (

    weakMomentum ||

    weakRSI ||

    weaknessDetected

  ) {

    riskLevel = "High";

  }

  // =========================
  // RETURN OBJECT
  // =========================

  return {

    verdict,

    priority,

    setup,

    tradeAction,

    executionConfidence,

    setupGrade,

    signalBadges,

    riskLevel

  };

}
