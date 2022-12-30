import { useState, useEffect } from "react";
import styles from "../../styles/home.module.css";
import { useRouter } from "next/router";
import { Popup } from "./popup";
import { useSession } from "next-auth/react";

interface trackInterface {
  title: string;
  link: string;
  _id: string;
  __v: number;
  contents?: string;
}

interface popup {
  show: boolean;
  id: string;
}

export default function Home() {
  const router = useRouter();
  const [tracks, setTracks] = useState<trackInterface[]>([]);
  const [isWaiting, setIsWaiting] = useState<boolean>(false);
  const [popup, setPopup] = useState<popup>({
    show: false,
    id: "null",
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { status } = useSession();
  
  function getRepoName(url: string) {
    const ownerRe = new RegExp("(?<=https://github.com/).+?(?=/)", "g");
    const owner = ownerRe.exec(url);
    if (owner === null) {
      return;
    }
    const repoRe = new RegExp(`(?<=https://github.com/${owner[0]}/).+`, "g");
    const repo = repoRe.exec(url);
    return repo;
  }
  async function handleClick() {
    router.push("/add-track");
    // const response = await fetch(`/api/test`, {
    //   method: "GET",
    //   headers: {
    //     Accept: "application/json",
    //     "Content-Type": "application/json",
    //   },
    // });
    // console.log("response is: ", response);
  }

  const handleDelete = (id: string) => {
    setIsWaiting(true);
    setPopup({
      show: true,
      id,
    });
  };

  const handleDeleteTrue = async () => {
    if (popup.show && popup.id !== "null") {
      await deleteTrack(popup.id);
      setPopup({
        show: false,
        id: "null",
      });
    }
  };

  const handleDeleteFalse = () => {
    setPopup({
      show: false,
      id: "null",
    });
    setIsWaiting(false);
  };

  async function deleteTrack(id: string) {
    if (status === "unauthenticated") {
      alert("Failed to delete!\nPlease Sign in");
      return;
    }
    const response = await fetch(`/api/tracks/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log("Status code is: ", response.status);
    if (!data.success) {
      const statusCode = response.status;
      if (statusCode === 401) {
        alert("Failed to delete!\nPlease Sign in");
      } else if (statusCode === 403) {
        alert("Failed to delete!\nYou don't have permission to delete");
      } else if (statusCode === 403) {
        alert("Failed to delete!\nBad request");
      }
    } else {
      alert("Deleted successfully!");
    }
    setIsWaiting(false);
  }

  async function getTracks() {
    const response = await fetch("/api/tracks", {
      method: "GET",
    });
    const data = await response.json();
    return data.data;
  }

  const handleNavTrack = (id: string) => {
    if (!isWaiting) {
      router.push(`/tracks/${id}`);
    }
  };

  useEffect(() => {
    const fetchTracks = async () => {
      const data: any = await getTracks();
      setTracks(data);
      setIsLoading(false);
    };
    fetchTracks().catch(console.error);
  }, [isWaiting]);

  return (
    <>
      <h1 className={styles.title}>
        Exploration Etherscan + ChatGPt for education
      </h1>
      <h1 className={styles.h1}>Learning tracks</h1>
      {isLoading ? (
        <h1 className={styles.title}>Loading...</h1>
      ) : tracks.length === 0 ? (
        <h1 className={styles.title}>Tracks empty</h1>
      ) : (
        tracks.map((track) => (
          <div
            key={track._id}
            className={styles.container}
            onClick={() => {
              handleNavTrack(track._id);
            }}
          >
            <h2 className={styles.h2}>{track.title}</h2>
            <p>
              Based on{" "}
              <a
                className={styles.a}
                href={track.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(track.link, "_blank");
                }}
              >
                {getRepoName(track.link)}
              </a>
            </p>
            <button
              type="submit"
              disabled={isWaiting}
              className={styles.button}
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDelete(track._id);
              }}
            >
              delete
            </button>
          </div>
        ))
      )}

      <div className={styles.addContainer} onClick={handleClick}>
        <h1>Add new track</h1>
      </div>
      {popup.show && (
        <Popup
          handleDeleteTrue={handleDeleteTrue}
          handleDeleteFalse={handleDeleteFalse}
        />
      )}
    </>
  );
}
