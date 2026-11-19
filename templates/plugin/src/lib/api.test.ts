import { answerFromSamples } from "../tests/samples";
import { getJson, sendJson, serverUrl } from "./api";

describe("api, on the samples", () => {
  it("answers a call from samples.json, and a state's error status", async () => {
    const calls = answerFromSamples({ "GET /api/things": [{ id: 1 }] });
    expect(await getJson(serverUrl("api/things"))).toEqual([{ id: 1 }]);
    expect(calls).toEqual([{ method: "GET", path: "/api/things" }]);

    answerFromSamples({ "POST /api/things": { $status: 503 } });
    await expect(sendJson("POST", serverUrl("api/things"), {})).rejects.toThrow(
      /503/,
    );
  });
});
