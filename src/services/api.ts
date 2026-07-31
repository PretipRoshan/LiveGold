// Example using a generic REST endpoint structure
export async function fetchLiveGoldPrice(): Promise<number | null> {
  const apiKey = process.env.FINNHUB_API_KEY;
// Get current timestamp and timestamp from 1 day ago to fetch recent candles
  const to = Math.floor(Date.now() / 1000);
  const from = to - (24 * 60 * 60);

  // Correct Finnhub endpoint for Forex (Gold/USD)
  const url = `https://finnhub.io/api/v1/forex/candle?symbol=OANDA:XAU_USD&resolution=60&from=${from}&to=${to}&token=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
       throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    // Finnhub returns an array of close prices 'c'. We want the most recent one.
    if (data.c && data.c.length > 0) {
      return data.c[data.c.length - 1];
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch live gold data:", error);
    return null;
  }
}