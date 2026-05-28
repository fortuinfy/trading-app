// =========================
// GENERATE VERDICT
// =========================

function generateVerdict(data) {

  const {

    cbScore,
    pcScore,
    rbScore,

    momentumScore,

    weaknessDetected,

    advancedEnabled

  } = data;

  // =========================
  // SETUP DETECTION
  // =========================

  let setup = "CB";

  let highestScore = cbScore;

  if (pcScore > highestScore) {

    setup = "PC";

    highestScore = pcScore;

  }

  if (rbScore > highestScore) {

    setup = "RB";

    highestScore = rbScore;

  }

  // =========================
  // FINAL SETUP SCORE
  // =========================

  let setupScore = highestScore;

  // =========================
  // ADVANCED ENGINE IMPACT
  // =========================

  if (advancedEnabled) {

    setupScore +=
      Math.floor(
        momentumScore * 0.20
      );

  }

  // =========================
  // WEAKNESS PENALTY
  // =========================

  if (weaknessDetected) {

    setupScore -= 10;

  }

  // =========================
  // SCORE LIMITS
  // =========================

  if (setupScore > 100) {

    setupScore = 100;

  }

  if (setupScore < 0) {

    setupScore = 0;

  }

  // =========================
  // VERDICT GENERATION
  // =========================

  let verdict = "AVOID";

  let priority = "LOW";

  // =========================
  // BUY CONDITIONS
  // =========================

  if (

    setupScore >= 75 &&

    (
      !advancedEnabled ||

      momentumScore >= 65
    ) &&

    !weaknessDetected

  ) {

    verdict = "BUY";

    priority = "HIGH";

  }

  // =========================
  // WATCH CONDITIONS
  // =========================

  else if (

    setupScore >= 55

  ) {

    verdict = "WATCH";

    priority = "MEDIUM";

  }

  // =========================
  // AVOID CONDITIONS
  // =========================

  else {

    verdict = "AVOID";

    priority = "LOW";

  }

  // =========================
  // RETURN
  // =========================

  return {

    setup,

    setupScore,

    verdict,

    priority

  };

}
