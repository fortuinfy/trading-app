// =========================
// VOLUME PARSER UTILITY
// =========================

window.parseVolume = function(volumeText) {

  // =========================
  // EMPTY CHECK
  // =========================

  if (
    volumeText === undefined ||
    volumeText === null ||
    volumeText === ""
  ) {

    return 0;

  }

  // =========================
  // CLEAN INPUT
  // =========================

  let value =
    volumeText
      .toString()
      .trim()
      .toUpperCase();

  value =
    value.replace(/\s+/g, "");

  // =========================
  // INVALID INPUT CHECK
  // =========================

  const validPattern =
    /^[0-9]*\.?[0-9]+(CR|L|M|K|B)?$/;

  if (!validPattern.test(value)) {

    console.warn(
      "Invalid volume format:",
      volumeText
    );

    return 0;

  }

  // =========================
  // CRORE
  // =========================

  if (value.includes("CR")) {

    return (
      parseFloat(
        value.replace("CR", "")
      ) * 10000000
    );

  }

  // =========================
  // LAKH
  // =========================

  if (value.includes("L")) {

    return (
      parseFloat(
        value.replace("L", "")
      ) * 100000
    );

  }

  // =========================
  // MILLION
  // =========================

  if (value.includes("M")) {

    return (
      parseFloat(
        value.replace("M", "")
      ) * 1000000
    );

  }

  // =========================
  // THOUSAND
  // =========================

  if (value.includes("K")) {

    return (
      parseFloat(
        value.replace("K", "")
      ) * 1000
    );

  }

  // =========================
  // BILLION
  // =========================

  if (value.includes("B")) {

    return (
      parseFloat(
        value.replace("B", "")
      ) * 1000000000
    );

  }

  // =========================
  // NORMAL NUMBER
  // =========================

  return parseFloat(value);

};

// =========================
// RELATIVE VOLUME STATUS
// =========================

window.getRelativeVolumeStatus =
function(relativeVolume) {

  const config =
    window.APP_CONFIG.relativeVolume;

  // LOW

  if (

    relativeVolume >= config.low.min &&
    relativeVolume <= config.low.max

  ) {

    return "Low";

  }

  // NORMAL

  if (

    relativeVolume >= config.normal.min &&
    relativeVolume <= config.normal.max

  ) {

    return "Normal";

  }

  // HIGH

  if (

    relativeVolume >= config.high.min &&
    relativeVolume <= config.high.max

  ) {

    return "High";

  }

  return "Unknown";

};
