const launches = require("./launches.schema");
const planets = require("./planets.schema");
const launchesModel = {};
const DEFAULT_FLIGHT_NUMBER = 100;

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

const getLatestFlightNumber = async () => {
  const latestLaunch = await launches.findOne().sort("-flightNumber");
  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }

  return latestLaunch.flightNumber;
};

launchesModel.getAllLaunches = async () => {
  return await launches.find({}, { _id: 0, __v: 0 });
};

launchesModel.saveLaunch = async (launch) => {
  const planet = await planets.findOne({
    keplerName: launch.target,
  });

  if (!planet) {
    throw new Error("No matching planet found");
  }

  try {
    await launches.findOneAndUpdate(
      {
        flightNumber: launch.flightNumber,
      },
      launch,
      {
        upsert: true,
      }
    );
  } catch (error) {
    throw new Error(`launches do not added ${error}`);
  }
};

launchesModel.saveLaunch(launch);

launchesModel.scheduleNewLaunch = async (launch) => {
  const newFlightNumber = (await getLatestFlightNumber()) + 1;
  const newLaunch = Object.assign(launch, {
    upcoming: true,
    success: true,
    customer: ["ZTM", "NASA"],
    flightNumber: newFlightNumber,
  });
  await launchesModel.saveLaunch(newLaunch);
};

launchesModel.existLaunchWithId = async (id) => {
  return await launches.find({ flightNumber: id });
};

launchesModel.abortLaunchById = async (id) => {
  const aborted = await launches.updateOne(
    { flightNumber: id },
    {
      upcoming: false,
      success: false,
    }
  );
  return aborted.modifiedCount === 1;
};

module.exports = launchesModel;
