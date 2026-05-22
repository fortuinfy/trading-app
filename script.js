// =====================================
// FINAL SETUP ENGINE
// =====================================

let setup = "None";
let setupScore = 0;

// RANGE BREAKOUT FIRST

if (
  emaCompressed &&
  rsi >= 45 &&
  rsi <= 55
) {

  setup = "RB";
  setupScore = rbScore;

}

// PULLBACK CONTINUATION SECOND

else if (
  nearEMA20 &&
  ema20 > ema50
) {

  setup = "PC";
  setupScore = pcScore;

}

// CONTINUATION BREAKOUT LAST

else if (
  ltp > ema20 &&
  ema20 > ema50 &&
  emaGap >= 0.5
) {

  setup = "CB";
  setupScore = cbScore;

}
