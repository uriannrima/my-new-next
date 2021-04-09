import fetch from "node-fetch";

function head(array = []) {
  return array[0];
}

function json(res) {
  return res.json();
}

function get(propertyName) {
  return function (data) {
    return data[propertyName];
  };
}

const getData = get("data");
const getBroadcasterType = get("broadcaster_type");

function getUser({ clientId, accessToken }) {
  return fetch("https://api.twitch.tv/helix/users", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Client-Id": clientId,
    },
  })
    .then(json)
    .then(getData)
    .then(head);
}

function getRewards({ clientId, accessToken }) {
  return fetch("https://api.twitch.tv/helix/channel_points/custom_rewards", {
    Authorization: `Bearer ${accessToken}`,
    "Client-Id": clientId,
  })
    .then(json)
    .then(getData);
}

function isValidBroadcaster(user) {
  const broadcasterType = getBroadcasterType(user);

  return broadcasterType !== "";
}

export default async function rewards(req, res) {
  const { AuthToken: accessToken } = req.cookies;

  const clientId = process.env.CLIENT_ID;

  try {
    const user = await getUser({
      accessToken,
      clientId,
    });

    if (isValidBroadcaster(user)) {
      const rewards = await getRewards({ clientId, accessToken });
      return res.json(rewards);
    }

    res.status(418).json([]);
  } catch (error) {
    res.status(500).json(error);
  }
}
