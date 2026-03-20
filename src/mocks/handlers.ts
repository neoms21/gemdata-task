import { ws } from "msw";

// Create a WebSocket link for our specific mock endpoint
export const chat = ws.link("ws://localhost:8080/ws");

export const handlers = [
  // Intercept WebSocket connections
  chat.addEventListener("connection", ({ client }) => {
    console.log("[MSW] WebSocket connected!");

    // Send an initial mock initialization message
    const initialData = [
      {
        id: "IRS-USD-10Y-001",
        ticker: "USD SWAP 10Y",
        assetClass: "Rates",
        valuation: {
          mid: 3.8452,
          bid: 3.841,
          ask: 3.8494,
          currency: "USD",
        },
        lastUpdated: new Date().toISOString(),
        status: "Verified",
        confidenceScore: 0.98,
      },
      {
        id: "FX-EURUSD-SPOT",
        ticker: "EUR/USD",
        assetClass: "FX",
        valuation: {
          mid: 1.0821,
          bid: 1.082,
          ask: 1.0822,
          currency: "EUR",
        },
        lastUpdated: new Date().toISOString(),
        status: "Pending",
        confidenceScore: 0.75,
      },
      {
        id: "CDS-FORD-5Y",
        ticker: "FORD MOTOR CO",
        assetClass: "Credit",
        valuation: {
          mid: 142.5,
          bid: null,
          ask: 145.0,
          currency: "USD",
        },
        lastUpdated: new Date().toISOString(),
        status: "Outlier",
        confidenceScore: 0.42,
      },
    ];

    client.send(
      JSON.stringify({
        type: "INIT",
        data: initialData,
      }),
    );

    // Set up an interval to periodically push updates to the client
    const interval = setInterval(() => {
      // Pick a random instrument to update
      const updateIndex = Math.floor(Math.random() * initialData.length);
      const targetInstrument = initialData[updateIndex];

      // Slightly fluctuate the mid price
      const fluctuation = (Math.random() - 0.5) * 0.01;
      const newMid = Number(
        (targetInstrument.valuation.mid + fluctuation).toFixed(4),
      );

      const updatePayload = {
        id: targetInstrument.id,
        valuation: {
          ...targetInstrument.valuation,
          mid: newMid,
        },
        lastUpdated: new Date().toISOString(),
      };

      client.send(
        JSON.stringify({
          type: "UPDATE",
          data: updatePayload,
        }),
      );
    }, 2000);

    // Clean up the interval when the client disconnects
    client.addEventListener("close", () => {
      console.log("[MSW] WebSocket disconnected");
      clearInterval(interval);
    });
  }),
];
