const path = require("node:path");
const { createReadStream } = require("node:fs");
const { parse } = require("csv-parse");

const planets = require("./planets.schema");

const planetsModel = {};

const isHabitablePlanet = (planet) => {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
};

const savePlanet = async (planet) => {
  try {
    await planets.updateOne(
      {
        keplerName: planet.kepler_name,
      },
      {
        keplerName: planet.kepler_name,
      },
      {
        upsert: true,
      }
    );
  } catch (error) {
    console.error(`Could not save planet ${error}`);
  }
};

planetsModel.loadPlanets = async () => {
  return new Promise((resolve, reject) => {
    createReadStream(
      path.join(__dirname, "..", "..", "data", "kepler_data.csv")
    )
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      )
      .on("data", (data) => {
        if (isHabitablePlanet(data)) {
          savePlanet(data);
        }
      })
      .on("error", (err) => {
        reject({
          error: err,
        });
      })
      .on("end", async () => {
        resolve();
        const countPlanetsFound = (await planetsModel.getAllPlanets()).length;
        console.log(`${countPlanetsFound} habitable planets found!!`);
      });
  });
};

planetsModel.getAllPlanets = async () => {
  return await planets.find({});
};

module.exports = planetsModel;
