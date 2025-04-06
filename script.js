
const solBinance = document.getElementById("sol-binance");
const solKucoin = document.getElementById("sol-kucoin");
const solDiff = document.getElementById("sol-diff");

const ethBinance = document.getElementById("eth-binance");
const ethKucoin = document.getElementById("eth-kucoin");
const ethDiff = document.getElementById("eth-diff");

const alertSound = document.getElementById("alert-sound");

async function fetchPrice(url, path) {
  const res = await fetch(url);
  const data = await res.json();
  return parseFloat(path.split('.').reduce((o, k) => o[k], data));
}

async function updatePrices() {
  try {
    const [solB, solK, ethB, ethK] = await Promise.all([
      fetchPrice("https://api.binance.com/api/v3/ticker/price?symbol=SOLUSDT", "price"),
      fetchPrice("https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=SOL-USDT", "data.price"),
      fetchPrice("https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT", "price"),
      fetchPrice("https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=ETH-USDT", "data.price")
    ]);

    solBinance.textContent = solB.toFixed(2);
    solKucoin.textContent = solK.toFixed(2);
    const solDifference = solK - solB;
    solDiff.textContent = solDifference.toFixed(2);
    if (Math.abs(solDifference) >= 0.5) alertSound.play();

    ethBinance.textContent = ethB.toFixed(2);
    ethKucoin.textContent = ethK.toFixed(2);
    const ethDifference = ethK - ethB;
    ethDiff.textContent = ethDifference.toFixed(2);
    if (Math.abs(ethDifference) >= 5) alertSound.play();

  } catch (err) {
    console.error("Erro ao buscar preços:", err);
  }
}

setInterval(updatePrices, 5000);
updatePrices();
