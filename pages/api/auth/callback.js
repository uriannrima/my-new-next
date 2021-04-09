import { serialize } from "cookie";
import fetch from "node-fetch";

function getUrl({ clientId, clientSecret, redirectUri, code }) {
  return `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&code=${code}&grant_type=authorization_code&redirect_uri=${redirectUri}`;
}

export function setCookie(res, name, value, options = {}) {
  const stringValue =
    typeof value === "object" ? "j:" + JSON.stringify(value) : String(value);

  if ("maxAge" in options) {
    options.expires = new Date(Date.now() + options.maxAge);
    options.maxAge /= 1000;
  }

  res.setHeader("Set-Cookie", serialize(name, String(stringValue), options));
}

export default async function callback(req, res) {
  const { code } = req.query;

  const url = getUrl({
    clientId: process.env.CLIENT_ID,
    redirectUri: process.env.REDIRECT_URI,
    clientSecret: process.env.CLIENT_SECRET,
    code,
  });

  try {
    const { access_token } = await fetch(url, {
      method: "POST",
    }).then((r) => r.json());

    setCookie(res, "AuthToken", access_token, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });

    res.redirect("/rewards");
  } catch (error) {
    res.status(500).send();
  }
}
