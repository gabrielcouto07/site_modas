const regionMap: Record<string, "N" | "NE" | "CO" | "SE" | "S"> = {
  AC: "N",
  AL: "NE",
  AP: "N",
  AM: "N",
  BA: "NE",
  CE: "NE",
  DF: "CO",
  ES: "SE",
  GO: "CO",
  MA: "NE",
  MT: "CO",
  MS: "CO",
  MG: "SE",
  PA: "N",
  PB: "NE",
  PR: "S",
  PE: "NE",
  PI: "NE",
  RJ: "SE",
  RN: "NE",
  RS: "S",
  RO: "N",
  RR: "N",
  SC: "S",
  SP: "SE",
  SE: "NE",
  TO: "N",
};

const fallbackTable = {
  N: { economico: 34.9, expresso: 47.9, days: [9, 5] },
  NE: { economico: 28.9, expresso: 41.9, days: [8, 4] },
  CO: { economico: 24.9, expresso: 36.9, days: [6, 3] },
  SE: { economico: 18.9, expresso: 29.9, days: [5, 2] },
  S: { economico: 22.9, expresso: 34.9, days: [6, 3] },
};

export function getRegionByState(state: string) {
  return regionMap[state.toUpperCase()] ?? "SE";
}

export function getFallbackShippingOptions(state: string) {
  const region = getRegionByState(state);
  const data = fallbackTable[region];

  return [
    {
      service: "Economico",
      carrier: "Correios",
      price: data.economico,
      deliveryDays: data.days[0],
      logo: "/logo-placeholder.svg",
      isFreeShipping: false,
    },
    {
      service: "Expresso",
      carrier: "Correios",
      price: data.expresso,
      deliveryDays: data.days[1],
      logo: "/logo-placeholder.svg",
      isFreeShipping: false,
    },
  ];
}
