const fromSelect = document.getElementById("from");
const toSelect = document.getElementById("to");
const convertBtn = document.getElementById("convert-btn");
const result = document.getElementById("result");
const fromFlag = document.getElementById("from-flag");
const toFlag = document.getElementById("to-flag");

const API_URL = "https://api.frankfurter.app";

// 🌍 Currency → Country code mapping (for flag images)
const countryCodes = {
  USD: "US",
  EUR: "EU",
  GBP: "GB",
  INR: "IN",
  BDT: "BD",
  AUD: "AU",
  CAD: "CA",
  CNY: "CN",
  JPY: "JP",
  PKR: "PK",
  SAR: "SA",
  AED: "AE",
  CHF: "CH",
  MYR: "MY",
  THB: "TH",
  SGD: "SG",
  KRW: "KR",
  ZAR: "ZA"
};

// 🌐 Function to load available currencies
async function loadCurrencies() {
  const res = await fetch(`${API_URL}/currencies`);
  const data = await res.json();
  const currencies = Object.keys(data);

  currencies.forEach(code => {
    const option1 = document.createElement("option");
    const option2 = document.createElement("option");

    option1.value = option2.value = code;
    option1.textContent = `${code} - ${data[code]}`;
    option2.textContent = `${code} - ${data[code]}`;

    fromSelect.appendChild(option1);
    toSelect.appendChild(option2);
  });

  fromSelect.value = "USD";
  toSelect.value = "BDT";

  updateFlag(fromSelect, fromFlag);
  updateFlag(toSelect, toFlag);
}

// 🏁 Update flag image when currency changes
function updateFlag(selectElement, imgElement) {
  const code = selectElement.value;
  const countryCode = countryCodes[code] || "UN";
  imgElement.src = `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;
}

// 💱 Convert Currency
async function convertCurrency() {
  const amount = document.getElementById("amount").value;
  const from = fromSelect.value;
  const to = toSelect.value;

  if (!amount || from === to) {
    result.innerHTML = "⚠️ Please enter a valid amount and choose different currencies.";
    return;
  }

  const res = await fetch(`${API_URL}/latest?amount=${amount}&from=${from}&to=${to}`);
  const data = await res.json();

  result.innerHTML = `
    <span class="fade-in">
      <img src="${fromFlag.src}" width="25"> ${amount} ${from} = 
      <strong><img src="${toFlag.src}" width="25"> ${data.rates[to]} ${to}</strong>
    </span>
  `;
}

// 🎯 Event Listeners
fromSelect.addEventListener("change", () => updateFlag(fromSelect, fromFlag));
toSelect.addEventListener("change", () => updateFlag(toSelect, toFlag));
convertBtn.addEventListener("click", convertCurrency);

// Load on startup
loadCurrencies();