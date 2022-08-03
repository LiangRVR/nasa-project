const axios = require("axios").default;
const launches = require("./launches.schema");
const planets = require("./planets.schema");
const launchesModel = {};
const DEFAULT_FLIGHT_NUMBER = 100;
const SPACEX_API_URL = "https://api.spacexdata.com/v5/launches/query";

const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2030"),
  target: "Kepler-442 b",
  customers: ["ZTM", "NASA"],
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

const fetchLaunchesFromSpaceXApi = async (queryOptionsToAdd) => {
  return await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      ...queryOptionsToAdd,
      populate: [
        {
          path: "rocket",
          select: ["name"],
        },
        {
          path: "payloads",
          select: ["customers"],
        },
      ],
    },
  });
};

const getLaunches = async () => {
  console.log("Downloading Launches Data");
  const response = await fetchLaunchesFromSpaceXApi({ pagination: false });

  const launchDocs = response.data.docs;
  launchDocs.map((launchDoc) => {
    const customers = launchDoc.payloads.flatMap(
      (payload) => payload.customers
    );

    const launch = {
      flightNumber: launchDoc.flight_number,
      mission: launchDoc.name,
      rocket: launchDoc.rocket.name,
      launchDate: launchDoc.date_local,
      customers,
      upcoming: launchDoc.upcoming,
      success: launchDoc.success,
    };

    console.log(launch.flightNumber, launch.mission);
  });
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
    customers: ["ZTM", "NASA"],
    flightNumber: newFlightNumber,
  });
  await launchesModel.saveLaunch(newLaunch);
};

launchesModel.findLaunch = async (launch) => {
  return await launches.find(launch);
};

launchesModel.existLaunchWithId = async (id) => {
  return await launchesModel.findLaunch({ flightNumber: id });
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

launchesModel.loadLaunchesData = async () => {
  await getLaunches()
};

module.exports = launchesModel;
