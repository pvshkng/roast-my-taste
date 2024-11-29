import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const topArtistNum = 3;
  const access_token = request.nextUrl.searchParams.get("access_token");

  const base = "https://api.spotify.com";
  const options = {
    method: "GET",
    headers: {
      Authorization: "Bearer " + access_token,
      "Content-Type": "application/json",
    },
  };

  const queryResult = {
    profileData: {},
    artistData: {
      names: [],
      images: [],
    },
    songData: {},
  };

  try {
    //QUERY USER PROFILE
    const profile = await fetch(`${base}/v1/me`, options);
    const profileData = await profile.json();

    queryResult["profileData"]["name"] = profileData["display_name"];

    if (profileData["images"].length > 0 && profileData["images"][0]["url"]) {
      queryResult["profileData"]["image"] = profileData["images"][0]["url"];
    } else {
      queryResult["profileData"]["image"] = null;
    }

    //QURTY TOP ARTISTS
    const artist = await fetch(`${base}/v1/me/top/artists`, options);
    const artistData = await artist.json();

    const names: string[] = [];
    const images: string[] = [];

    for (let i = 0; i < topArtistNum; i++) {
      const name = artistData["items"][i]["name"];
      const image = artistData["items"][i]["images"][0]["url"];
      names.push(name);
      images.push(image);
    }

    queryResult["artistData"]["names"] = names;
    queryResult["artistData"]["images"] = images;

    //QUERY SONGS

    //SEND QUERIED DATA TO LLM
    const llm = await fetch(`${process.env.BASE_URL}/api/spotify/llm`, {
      method: "POST",
      body: JSON.stringify({ names: names }),
      headers: { "Content-Type": "application/json" },
    });
    //return with llm response
    const output = await llm.json();

    return NextResponse.json(
      { names: names, images: images, answer: output.answer },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
