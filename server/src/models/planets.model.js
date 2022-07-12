const path = require("node:path");
const { createReadStream } = require("node:fs");
const { parse } = require("csv-parse");

const planetsModel = {};
let habitablePlanets = [];

const isHabitablePlanet = (planet) => {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
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
          habitablePlanets.push(data);
        }
      })
      .on("error", (err) => {
        reject({
          error: err,
        });
      })
      .on("end", () => {
        resolve();
        console.log(`${habitablePlanets.length} habitable planets found!!`);
      });
  });
};

planetsModel.getAllPlanets = () => {
  return habitablePlanets;
};

module.exports = planetsModel;
