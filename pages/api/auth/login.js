function getRedirectUrl({ clientId, redirectUri, scopes }) {
  return `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scopes}`;
}
export default function login(req, res) {
  const url = getRedirectUrl({
    clientId: process.env.CLIENT_ID,
    redirectUri: process.env.REDIRECT_URI,
    scopes: process.env.SCOPES,
  });

  res.redirect(url);
  return;
}
