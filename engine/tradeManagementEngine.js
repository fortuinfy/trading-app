// =========================
// TRADE MANAGEMENT ENGINE
// =========================

window.manageActiveTrade =
function(data) {

  // =========================
  // INPUTS
  // =========================

  const {

    ltp,
    ema20,
    ema50,
    rsi,

    executedEntry,
    currentSL,
    currentTarget,
    quantity

  } = data;

  // =========================
  // CONFIG
  // =========================

  const config =
    window.APP_CONFIG;

  // =========================
  // INITIAL VALUES
  // =========================

  let tradeVerdict =
    config.verdicts.continueHolding;

  let tradeReasons = [];

  let managementPlan = {};

  // =========================
  // FULL EXIT
  // =========================

  if (

    ltp <= currentSL

    ||

    ltp < ema20

    ||

    rsi <
    config.tradeManagement
      .fullExit
      .rsiBreakdownLevel

    ||

    ema20 < ema50

  ) {

    tradeVerdict =
      config.verdicts.fullExit;

    tradeReasons.push(
      "Trend structure weakening."
    );

    tradeReasons.push(
      "Capital protection prioritized."
    );

    if (ltp <= currentSL) {

      tradeReasons.push(
        "Price breached stop loss zone."
      );

    }

    if (ema20 < ema50) {

      tradeReasons.push(
        "EMA trend alignment turned bearish."
      );

    }

    managementPlan = {

      exitQuantity:
        quantity,

      exitPrice:
        ltp.toFixed(2)

    };

    return {

      tradeVerdict,
      tradeReasons,
      managementPlan

    };

  }

  // =========================
  // PARTIAL EXIT
  // =========================

  if (

    ltp >=
    currentTarget *
    config.tradeManagement
      .partialExit
      .targetReachPercent

    &&

    rsi >=
    config.tradeManagement
      .partialExit
      .rsiMinimum

  ) {

    tradeVerdict =
      config.verdicts.partialExit;

    tradeReasons.push(
      "Price approaching target zone."
    );

    tradeReasons.push(
      "Partial profit booking advised."
    );

    tradeReasons.push(
      "Extension risk increasing."
    );

    const partialQty =
      Math.floor(quantity / 2);

    managementPlan = {

      exitQuantity:
        partialQty,

      holdQuantity:
        quantity - partialQty,

      suggestedTrailSL:
        ema20.toFixed(2)

    };

    return {

      tradeVerdict,
      tradeReasons,
      managementPlan

    };

  }

  // =========================
  // TRAIL STOP LOSS
  // =========================

  if (

    ltp >=
    executedEntry *
    config.tradeManagement
      .trailSL
      .activationPercent

    &&

    rsi >=
    config.tradeManagement
      .trailSL
      .rsiMin

    &&

    rsi <=
    config.tradeManagement
      .trailSL
      .rsiMax

  ) {

    tradeVerdict =
      config.verdicts.trailStopLoss;

    tradeReasons.push(
      "Trade moved favorably."
    );

    tradeReasons.push(
      "Profit protection recommended."
    );

    tradeReasons.push(
      "Momentum remains stable."
    );

    managementPlan = {

      currentSL:
        currentSL.toFixed(2),

      suggestedNewSL:
        ema20.toFixed(2)

    };

    return {

      tradeVerdict,
      tradeReasons,
      managementPlan

    };

  }

  // =========================
  // CONTINUE HOLDING
  // =========================

  tradeVerdict =
    config.verdicts.continueHolding;

  tradeReasons.push(
    "Trend structure remains healthy."
  );

  tradeReasons.push(
    "Trade holding above EMA20."
  );

  tradeReasons.push(
    "Momentum remains supportive."
  );

  managementPlan = {

    currentSL:
      currentSL.toFixed(2),

    currentTarget:
      currentTarget.toFixed(2)

  };

  // =========================
  // RETURN
  // =========================

  return {

    tradeVerdict,
    tradeReasons,
    managementPlan

  };

};
