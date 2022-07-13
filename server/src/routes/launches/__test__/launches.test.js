const request = require("supertest");
const app = require("../../../app");

describe("Test GET /launches", () => {
  it("Should respond with 200 success", async () => {
    const response = await request(app)
      .get("/launches")
      .expect("Content-Type", /json/)
      .expect(200);
  });
});

describe("Test POST /launches", () => {
  const mockLaunch = {
    mission: "ZTMLeaderA1",
    rocket: "Space Alpha 01",
    launchDate: "December 20, 2030",
    target: "Kepler-186 f",
  };

  const mockLaunchWithOutAProperty = {
    mission: "ZTMLeaderA1",
    rocket: "Space Alpha 01",
    launchDate: "December 20, 2030",
  };

  it("Should respond with 201 created", async () => {
    const response = await request(app)
      .post("/launches")
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
      .post("/launches")
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
      .post("/launches")
      .send({ ...mockLaunch, launchDate: "time" })
      .expect("Content-Type", /json/)
      .expect(400);

    const launchCreated = response.body;

    expect(launchCreated).toMatchObject({
      error: "Invalid launch date",
    });
  });
});
