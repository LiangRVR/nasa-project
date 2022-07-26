const launchesDataBase = require("./launches.schema");
const planets = require("./planets.schema");
const launchesModel = {};
const launches = new Map();
let latestFlightNumber = 100;

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

launchesModel.getAllLaunches = async () => {
  return await launchesDataBase.find({}, { _id: 0, __v: 0 });
};

launchesModel.addNewLaunch = (launch) => {
  latestFlightNumber++;
  launches.set(
    latestFlightNumber,
    Object.assign(launch, {
      upcoming: true,
      success: true,
      customer: ["ZTM", "NASA"],
      flightNumber: latestFlightNumber,
    })
  );
};

launchesModel.saveLaunch = async (launch) => {
  const planet = await planets.findOne({
    keplerName: launch.target,
  });

  if (!planet) {
    throw new Error("No matching planet found");
  }

  try {
    await launchesDataBase.updateOne(
      {
        flightNumber: launch.flightNumber,
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

launchesModel.saveLaunch(launch);

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
