// =========================
// GLOBAL APP CONFIGURATION
// =========================

window.APP_CONFIG = {

  // =========================
  // TIMEFRAME SETTINGS
  // =========================

  timeframeSettings: {

    daily: {

      emaTolerance: 0.02,

      overextendedLimit: 0.05

    },

    intraday15m: {

      emaTolerance: 0.005,

      overextendedLimit: 0.01

    }

  },

  // =========================
  // SETUP PRIORITY
  // =========================

  setupPriority: [

    "RB",
    "PC",
    "CB"

  ],

  // =========================
  // CB CONFIGURATION
  // =========================

  cb: {

    scoring: {

      ltpAboveEMA20: 25,

      emaAlignment: 25,

      emaGapStrength: 25,

      rsiStrength: 25

    },

    conditions: {

      minimumBuyScore: 75,

      minimumWatchScore: 50,

      emaGapMinimum: 0.5,

      rsiBuyMin: 58,

      rsiBuyMax: 70,

      rsiWatchMin: 50,

      rsiWatchMax: 57

    }

  },

  // =========================
  // PC CONFIGURATION
  // =========================

  pc: {

    scoring: {

      emaAlignment: 30,

      ema20Proximity: 40,

      rsiSupport: 30

    },

    conditions: {

      minimumBuyScore: 100,

      minimumWatchScore: 60,

      rsiBuyMin: 58,

      rsiBuyMax: 68,

      rsiWatchMin: 50,

      rsiWatchMax: 57

    }

  },

  // =========================
  // RB CONFIGURATION
  // =========================

  rb: {

    scoring: {

      emaCompression: 40,

      neutralRSI: 30,

      emaProximity: 30

    },

    conditions: {

      minimumBuyScore: 80,

      minimumWatchScore: 40,

      emaCompressionLimit: 0.5,

      rsiNeutralMin: 45,

      rsiNeutralMax: 55

    }

  },

  // =========================
  // ADVANCED MOMENTUM ENGINE
  // =========================

  momentum: {

    scoring: {

      higherClose: 10,

      bullishCandle: 10,

      highRelativeVolume: 20,

      risingVolumeParticipation: 20

    },

    conditions: {

      strongMomentumScore: 70,

      moderateMomentumScore: 50,

      weakMomentumScore: 49

    }

  },

  // =========================
  // RELATIVE VOLUME ENGINE
  // =========================

  relativeVolume: {

    low: {

      min: 0,

      max: 0.79

    },

    normal: {

      min: 0.8,

      max: 1.2

    },

    high: {

      min: 1.21,

      max: 999999

    }

  },

  // =========================
  // WEAKNESS ENGINE
  // =========================

  weaknessEngine: {

    consecutiveBearishCandles: 2,

    fallingCloseCount: 3,

    enableWeakMomentumDowngrade: true

  },

  // =========================
  // VERDICT ENGINE
  // =========================

  verdicts: {

    buy: "BUY",

    watch: "WATCH",

    avoid: "AVOID",

    continueHolding:
      "Continue Holding",

    trailStopLoss:
      "Trail Stop Loss",

    partialExit:
      "Partial Exit",

    fullExit:
      "Full Exit"

  },

  // =========================
  // PRIORITY ENGINE
  // =========================

  priority: {

    high: "High",

    medium: "Medium",

    low: "Low"

  },

  // =========================
  // TRADE MANAGEMENT ENGINE
  // =========================

  tradeManagement: {

    trailSL: {

      activationPercent: 1.05,

      rsiMin: 55,

      rsiMax: 65

    },

    partialExit: {

      targetReachPercent: 0.95,

      rsiMinimum: 65

    },

    fullExit: {

      rsiBreakdownLevel: 45

    }

  },

  // =========================
  // POSITION SIZING
  // =========================

  positionSizing: {

    defaultRiskPercent: 1

  },

  // =========================
  // UI SETTINGS
  // =========================

  ui: {

    showMomentumSection: true,

    showReasonSection: true,

    showTradePlan: true,

    showPositionSizing: true

  }

};
