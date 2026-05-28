// =========================
// TRADE MANAGEMENT ENGINE
// =========================

function manageActiveTrade(data) {

  const {

    ltp,

    executedEntry,
    currentSL,
    currentTarget,

    momentumScore,

    momentumTrend,
    participationTrend,

    relativeVolumeStatus,

    weaknessDetected,

    rsi,
    ema20,
    ema50

  } = data;

  // =========================
  // INITIAL VARIABLES
  // =========================

  let tradeVerdict =
    "CONTINUE HOLDING";

  let priority =
    "MEDIUM";

  let suggestedSL =
    currentSL;

  let suggestedTarget =
    currentTarget;

  let tradeHealth =
    "Healthy";

  let tradeReasons = [];

  // =========================
  // PROFIT CALCULATION
  // =========================

  const pnlPercent =

    (
      (ltp - executedEntry) /
      executedEntry
    ) * 100;

  // =========================
  // DISTANCE ANALYSIS
  // =========================

  const targetDistance =

    (
      (currentTarget - ltp) /
      ltp
    ) * 100;

  const slDistance =

    (
      (ltp - currentSL) /
      ltp
    ) * 100;

  // =========================
  // TREND HEALTH
  // =========================

  const bullishTrend =

    ltp > ema20 &&
    ema20 > ema50;

  // =========================
  // CONTINUE HOLDING
  // =========================

  if (

    bullishTrend &&

    momentumScore >= 65 &&

    !weaknessDetected

  ) {

    tradeVerdict =
      "CONTINUE HOLDING";

    priority =
      "HIGH";

    tradeHealth =
      "Strong";

    tradeReasons.push(

      "Trend structure remains bullish with strong momentum continuation."

    );

  }

  // =========================
  // TRAIL STOP LOSS
  // =========================

  if (

    pnlPercent >= 5 &&

    bullishTrend &&

    momentumScore >= 50

  ) {

    tradeVerdict =
      "TRAIL STOP LOSS";

    priority =
      "HIGH";

    suggestedSL =
      ema20;

    tradeHealth =
      "Profitable";

    tradeReasons.push(

      "Trade is in healthy profit zone. Trailing stop loss recommended to protect gains."

    );

  }

  // =========================
  // PARTIAL EXIT
  // =========================

  if (

    targetDistance <= 3 &&

    momentumScore < 65

  ) {

    tradeVerdict =
      "PARTIAL EXIT";

    priority =
      "MEDIUM";

    tradeHealth =
      "Extended";

    tradeReasons.push(

      "Price is approaching target zone with slowing momentum characteristics."

    );

  }

  // =========================
  // FULL EXIT CONDITIONS
  // =========================

  if (

    ltp < ema20 ||

    weaknessDetected ||

    momentumScore < 40 ||

    rsi < 45

  ) {

    tradeVerdict =
      "FULL EXIT";

    priority =
      "HIGH";

    tradeHealth =
      "Weak";

    tradeReasons.push(

      "Trend structure and momentum conditions are weakening significantly."

    );

  }

  // =========================
  // PARTICIPATION ANALYSIS
  // =========================

  tradeReasons.push(

    "Participation Trend: " +
    participationTrend

  );

  tradeReasons.push(

    "Relative Volume Status: " +
    relativeVolumeStatus

  );

  tradeReasons.push(

    "Momentum Trend: " +
    momentumTrend

  );

  // =========================
  // RISK ANALYSIS
  // =========================

  if (

    slDistance <= 2

  ) {

    tradeReasons.push(

      "Current price is trading close to stop loss zone."

    );

  }

  if (

    pnlPercent > 0

  ) {

    tradeReasons.push(

      "Trade is currently profitable by approximately " +

      pnlPercent.toFixed(2) +

      "%."

    );

  }

  else {

    tradeReasons.push(

      "Trade is currently under pressure with unrealized loss."

    );

  }

  // =========================
  // RETURN
  // =========================

  return {

    tradeVerdict,

    priority,

    suggestedSL,

    suggestedTarget,

    tradeHealth,

    tradeReasons,

    pnlPercent,

    targetDistance,

    slDistance

  };

}
