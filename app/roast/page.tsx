"use client";
import Loading from "@/components/Loading/Loading";
import downloadAsPng from "@/lib/download-as-png";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import "./you-have-bad-taste.css";

export default function Page() {
  const [isLoading, setLoading] = useState(true); //default false
  const [isLoggedIn, setIsLoggedIn] = useState(false); //default false
  const [data, setData] = useState({});

  const router = useRouter();
  const code = useSearchParams().get("code") || "";
  const state = useSearchParams().get("state") || "";

  /* function refreshResult() {
    sessionStorage.removeItem("spotifyData");
    setData({});
    useRouter().reload();
  } */

  useEffect(() => {
    {
      (async () => {
        const spotifyData = sessionStorage.getItem("spotifyData");

        if (spotifyData) {
          setData(JSON.parse(spotifyData));
          setIsLoggedIn(true);
          setLoading(false);
        } else {
          //Callback
          if (code && state) {
            setLoading(true);

            const body = JSON.stringify({ code: code });
            const res = await fetch("/api/spotify/auth", {
              method: "POST",
              body: body,
              headers: { "Content-Type": "application/json" },
            });

            const spotify = await res.json();

            if (Object.keys(spotify).length === 0) {
              window.location.href = "/roast";
            } else {
              sessionStorage.setItem("spotifyData", JSON.stringify(spotify));
              setData(spotify);
              setIsLoggedIn(true);
              setLoading(false);
              router.push("/roast");
            }
          } else {
            setIsLoggedIn(false);
            setLoading(false);
          }
        }
      })();
    }
  }, []);

  async function login(app: string) {
    if (app === "spotify") {
      const res = await fetch("/api/spotify/login");
      const json = await res.json();
      const endpoint = json.endpoint;
      window.location.href = endpoint;
    } else {
      alert("This feature is not yet available");
      return;
    }
  }

  function navigateTab(direction: string) {
    const tabList = document.querySelectorAll(".card-tab");
    const cardList = document.querySelectorAll(".card");
    let activeTab;
    let targetTab;

    for (let i = 0; i < tabList.length; i++) {
      if (tabList[i].classList.contains("active")) {
        tabList[i].classList.remove("active");
        cardList[i].classList.remove("active");
        cardList[i].setAttribute("id", "");
        activeTab = i;
      }
    }

    if (direction === "next") {
      targetTab = activeTab + 1;
      if (targetTab > tabList.length - 1) {
        targetTab = 0;
      }
    } else {
      targetTab = activeTab - 1;
      if (targetTab < 0) {
        targetTab = tabList.length - 1;
      }
    }

    tabList[targetTab].classList.add("active");
    cardList[targetTab].classList.add("active");
    cardList[targetTab].setAttribute("id", "download");
  }

  if (isLoading) return <Loading />;
  else
    return (
      <>
        <main>
          <Suspense>
            <div className={`page-content`}>
              {isLoggedIn === false ? (
                <>
                  <div className="top-container">
                    <h1>How bad is your music taste?</h1>
                    <h2>Care to let AI music shame yours?</h2>
                  </div>

                  {/* blank space */}
                  <div style={{ height: "50px" }} />

                  <div className="btn-container">
                    <button
                      className={`login spotify`}
                      onClick={() => {
                        login("spotify");
                      }}
                    >
                      {/* login */}

                      <img src="icon/spotify.svg" />
                      <p>Login to Spotify</p>
                    </button>

                    <button
                      className={`login apple`}
                      onClick={() => {
                        login("apple");
                      }}
                    >
                      <img src="icon/applemusic.svg" />
                      <p>Login to Apple Music</p>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="tab-selector">
                    <div className="card-tab active"></div>
                    <div className="card-tab"></div>
                    <div className="card-tab"></div>
                  </div>

                  <div className="card-container">
                    {/* Navigation Buttons */}
                    <button
                      className="tab-nav previous"
                      onClick={() => {
                        navigateTab("previous");
                      }}
                    >
                      <img src="icon/caret-left.svg" />
                    </button>
                    <button
                      className="tab-nav next"
                      onClick={() => {
                        navigateTab("next");
                      }}
                    >
                      <img src="icon/caret-right.svg" />
                    </button>

                    <div className={`card active`} id="download">
                      {/* <p>
                    {data.names ? data.names : "names are not here yet bro"}
                  </p> */}

                      <div className="text-container user">
                        <div className="from user">
                          You {/* replace with username */}
                          <div className="avatar">
                            <img
                              src="icon/user.svg"
                              width="16px"
                              height="16px"
                            />
                          </div>
                        </div>

                        <p>
                          Sup! These are my favorite artists, what do you think
                          about my music taste?
                        </p>

                        <div className="artist-image-container">
                          {data.images
                            ? data.images.map((link, index) => (
                                <img
                                  className="artist-image"
                                  src={link}
                                  width={100}
                                  height={100}
                                  key={index}
                                  alt="artist"
                                />
                              ))
                            : "Image not available"}
                        </div>
                      </div>

                      <div className="text-container ai">
                        <div className="from ai">AI says...</div>
                        <p>
                          {data.answer
                            ? data.answer
                            : "answer are not here yet bro"}
                        </p>
                      </div>

                      <div className="see-yours">
                        Made by <strong>Puvish</strong>
                        <br />
                        Create your own at{" "}
                        <strong>roastmytaste.vercel.app</strong>
                      </div>
                    </div>

                    <div className="card">2</div>
                    <div className="card">3</div>
                  </div>

                  <button className="download" onClick={downloadAsPng}>
                    <img height="24px" src="/icon/download.svg" />
                    <p className="text-white">Download</p>
                  </button>
                </>
              )}
            </div>
          </Suspense>
        </main>
      </>
    );
}
