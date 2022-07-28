const request = require("supertest");
const app = require("../../../app");

const { mongoConnect, mongoDisconnect } = require("../../../services/mongo");
const { loadPlanets } = require("../../../models/planets.model");

describe("Planets tests", () => {
  beforeAll(async () => {
    await mongoConnect();
    await loadPlanets();
  });

  afterAll(async () => {
    await mongoDisconnect();
  });

  describe("Test GET /planets", () => {
    it("Should respond with 200 success", async () => {
      const response = await request(app)
        .get("/planets")
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });
});
