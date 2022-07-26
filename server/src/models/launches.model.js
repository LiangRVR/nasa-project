const launchesDataBase = require("./launches.schema");
const launchesModel = {};
const launches = new Map();
let lastFlightNumber = 100;

const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2030"),
  target: "Kepler-442 b",
  customer: ["ZTM", "NASA"],
  upcoming: true,
  success: true,
};

launches.set(launch.flightNumber, launch);

launchesModel.getAllLaunches = () => {
  return Array.from(launches.values());
};

launchesModel.addNewLaunch = (launch) => {
  lastFlightNumber++;
  launches.set(
    lastFlightNumber,
    Object.assign(launch, {
      upcoming: true,
      success: true,
      customer: ["ZTM", "NASA"],
      flightNumber: lastFlightNumber,
    })
  );
};

launchesModel.saveLaunch = async (launch) => {
  try {
    await launchesDataBase.updateOne(
      {
        lastFlightNumber: launch.lastFlightNumber,
      },
      launch,
      {
        upsert: true,
      }
    );
  } catch (error) {
    console.error(`launches do not added ${error}`);
  }
};

launchesModel.existLaunchWithId = (id) => {
  return launches.has(id);
};

launchesModel.abortLaunchById = (id) => {
  const aborted = launches.get(id);
  aborted.success = false;
  aborted.upcoming = false;
  return aborted;
};

module.exports = launchesModel;
