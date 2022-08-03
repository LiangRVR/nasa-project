const axios = require("axios").default;
const launches = require("./launches.schema");
const planets = require("./planets.schema");
const launchesModel = {};
const DEFAULT_FLIGHT_NUMBER = 100;
const SPACEX_API_URL = "https://api.spacexdata.com/v5/launches/query";

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

const getLaunchesFromResponse = async () => {
  console.log("Downloading Launches Data");
  const response = await fetchLaunchesFromSpaceXApi({ pagination: false });

  if (response.status !== 200) {
    throw new Error("There was a problem getting launches from SpaceX API");
  }

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

    launchesModel.saveLaunch(launch);
  });
};

launchesModel.getAllLaunches = async (skip, limit) => {
  return await launches.find({}, { _id: 0, __v: 0 }).sort({flightNumber: 1}).skip(skip).limit(limit);
};

launchesModel.saveLaunch = async (launch) => {
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

launchesModel.scheduleNewLaunch = async (launch) => {
  const planet = await planets.findOne({
    keplerName: launch.target,
  });

  if (!planet) {
    throw new Error("No matching planet found");
  }

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
  const latestLaunchInSpaceXApiResponse = await fetchLaunchesFromSpaceXApi({
    limit: 1,
    sort: {
      flight_number: "desc",
    },
  });

  if (latestLaunchInSpaceXApiResponse.status !== 200) {
    throw new Error(
      "There was a problem getting the latest launch from SpaceX API"
    );
  }

  const launchDoc = latestLaunchInSpaceXApiResponse.data.docs[0];

  const latestLaunch = await launchesModel.findLaunch({
    flightNumber: launchDoc.flight_number,
    mission: launchDoc.name,
    rocket: launchDoc.rocket.name,
  });

  if (latestLaunch.length) {
    console.log("Launches Data already loaded");
  } else {
    await getLaunchesFromResponse();
  }
};

module.exports = launchesModel;
