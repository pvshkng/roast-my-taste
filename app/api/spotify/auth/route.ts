import { NextResponse } from "next/server";

const baseUrl = process.env.BASE_URL;
const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = `${process.env.BASE_URL}/roast`;
const authCode = Buffer.from(client_id + ":" + client_secret).toString(
  "base64"
);

export async function POST(request: Request) {
  try {
    const req = await request.json();

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + authCode,
      },
      body: `grant_type=authorization_code&redirect_uri=${redirect_uri}&code=${req.code}`,
    };

    const res = await fetch("https://accounts.spotify.com/api/token", options);
    const data = await res.json();


    const query = await fetch(
      `${baseUrl}/api/spotify/query?access_token=${data.access_token}`,
      { method: "GET", headers: { "Content-Type": "application/json" } }
    );

    const output = await query.json();
    
    return NextResponse.json(output, {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
