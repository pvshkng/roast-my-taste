import { generateRandomString } from "@/lib/utils";

const baseUrl = "https://accounts.spotify.com/authorize?";
const client_id = process.env.SPOTIFY_CLIENT_ID;
const redirect_uri = `${process.env.BASE_URL}/roast`;
const scope =
  "playlist-read-private user-follow-read user-top-read user-read-recently-played";

export async function GET() {
  const state = generateRandomString(16);
  const endpoint =
    baseUrl +
    `client_id=${client_id}` +
    `&response_type=code` +
    `&redirect_uri=${redirect_uri}` +
    `&state=${state}` +
    `&show_dialog=false` +
    `&scope=${encodeURIComponent(scope)}`;

  return Response.json({ endpoint: endpoint });
}
