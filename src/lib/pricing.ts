export type PlanId = "starter" | "growth";

type CurrencyCode = "GBP" | "USD" | "EUR" | "CAD" | "AUD" | "NGN" | "ZAR";

type LocalizedPrice = {
  amount: number;
  currency: CurrencyCode;
};

const planBasePrices: Record<PlanId, number> = {
  starter: 19,
  growth: 39,
};

const currencyByCountry: Record<string, CurrencyCode> = {
  AU: "AUD",
  CA: "CAD",
  DE: "EUR",
  ES: "EUR",
  FR: "EUR",
  IE: "EUR",
  IT: "EUR",
  NG: "NGN",
  NL: "EUR",
  US: "USD",
  ZA: "ZAR",
};

// Marketing display rates until Stripe prices are connected per currency.
const exchangeRatesFromGbp: Record<CurrencyCode, number> = {
  AUD: 2,
  CAD: 1.8,
  EUR: 1.16,
  GBP: 1,
  NGN: 1900,
  USD: 1.3,
  ZAR: 24,
};

const localeByCurrency: Record<CurrencyCode, string> = {
  AUD: "en-AU",
  CAD: "en-CA",
  EUR: "en-IE",
  GBP: "en-GB",
  NGN: "en-NG",
  USD: "en-US",
  ZAR: "en-ZA",
};

function roundPrice(amount: number, currency: CurrencyCode) {
  if (currency === "NGN") {
    return Math.round(amount / 1000) * 1000;
  }

  return Math.round(amount);
}

export function getCurrencyForCountry(countryCode?: string | null): CurrencyCode {
  if (!countryCode) {
    return "GBP";
  }

  return currencyByCountry[countryCode.toUpperCase()] ?? "GBP";
}

export function getLocalizedPlanPrices(countryCode?: string | null): Record<PlanId, LocalizedPrice> {
  const currency = getCurrencyForCountry(countryCode);
  const rate = exchangeRatesFromGbp[currency];

  return {
    growth: {
      amount: roundPrice(planBasePrices.growth * rate, currency),
      currency,
    },
    starter: {
      amount: roundPrice(planBasePrices.starter * rate, currency),
      currency,
    },
  };
}

export function formatPlanPrice({ amount, currency }: LocalizedPrice) {
  return new Intl.NumberFormat(localeByCurrency[currency], {
    currency,
    maximumFractionDigits: 0,
    style: "currency",
  }).format(amount);
}
