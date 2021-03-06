const request = require("supertest");
const app = require("../../../app");
const { mongoConnect, mongoDisconnect } = require("../../../services/mongo");
const { loadPlanets } = require("../../../models/planets.model");

describe("Launches tests", () => {
  beforeAll(async () => {
    await mongoConnect();
    await loadPlanets();
  });

  afterAll(async () => {
    await mongoDisconnect();
  });
  describe("Test GET /v1/launches", () => {
    it("Should respond with 200 success", async () => {
      const response = await request(app)
        .get("/v1/launches")
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });

  describe("Test POST /v1/launches", () => {
    const mockLaunch = {
      mission: "ZTMLeaderA1",
      rocket: "Space Alpha 01",
      launchDate: "December 20, 2030",
      target: "Kepler-296 f",
    };

    const mockLaunchWithOutAProperty = {
      mission: "ZTMLeaderA1",
      rocket: "Space Alpha 01",
      launchDate: "December 20, 2030",
    };

    it("Should respond with 201 created", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(mockLaunch)
        .expect("Content-Type", /json/)
        .expect(201);

      const launchCreated = response.body;

      expect({
        ...launchCreated,
        launchDate: new Date(launchCreated.launchDate).valueOf(),
      }).toMatchObject({
        ...mockLaunch,
        launchDate: new Date(mockLaunch.launchDate).valueOf(),
      });
    });

    it("Should respond with 400 catching missing properties", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(mockLaunchWithOutAProperty)
        .expect("Content-Type", /json/)
        .expect(400);

      const launchCreated = response.body;

      expect(launchCreated).toMatchObject({
        error: "Missing required launch property",
      });
    });

    it("Should respond with 400 catching invalid launch date", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send({ ...mockLaunch, launchDate: "time" })
        .expect("Content-Type", /json/)
        .expect(400);

      const launchCreated = response.body;

      expect(launchCreated).toMatchObject({
        error: "Invalid launch date",
      });
    });
  });
});
