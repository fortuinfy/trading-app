// =========================
// POSITION SIZE ENGINE
// =========================

function calculatePositionSize(data) {

  const {

    capital,

    riskPercent,

    entryPrice,

    stopLoss

  } = data;

  // =========================
  // VALIDATION
  // =========================

  if (

    !capital ||
    !riskPercent ||
    !entryPrice ||
    !stopLoss

  ) {

    return {

      quantity: 0,

      riskAmount: 0,

      positionValue: 0,

      perShareRisk: 0,

      message:
        "Incomplete Position Inputs"

    };

  }

  // =========================
  // RISK AMOUNT
  // =========================

  const riskAmount =

    (
      capital *
      riskPercent
    ) / 100;

  // =========================
  // PER SHARE RISK
  // =========================

  const perShareRisk =

    Math.abs(
      entryPrice - stopLoss
    );

  // =========================
  // SAFETY CHECK
  // =========================

  if (perShareRisk <= 0) {

    return {

      quantity: 0,

      riskAmount: riskAmount,

      positionValue: 0,

      perShareRisk: perShareRisk,

      message:
        "Invalid Stop Loss Structure"

    };

  }

  // =========================
  // QUANTITY
  // =========================

  const quantity =

    Math.floor(
      riskAmount / perShareRisk
    );

  // =========================
  // POSITION VALUE
  // =========================

  const positionValue =

    quantity * entryPrice;

  // =========================
  // CAPITAL CHECK
  // =========================

  let finalQuantity =
    quantity;

  let warning =
    "";

  if (

    positionValue > capital

  ) {

    finalQuantity =

      Math.floor(
        capital / entryPrice
      );

    warning =
      "Adjusted quantity due to capital limitation.";

  }

  // =========================
  // RETURN
  // =========================

  return {

    quantity:
      finalQuantity,

    riskAmount:
      riskAmount.toFixed(2),

    positionValue:
      (
        finalQuantity *
        entryPrice
      ).toFixed(2),

    perShareRisk:
      perShareRisk.toFixed(2),

    warning,

    message:
      "Position Size Calculated"

  };

}
