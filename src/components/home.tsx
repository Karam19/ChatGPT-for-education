import { useState, useEffect } from "react";
import styles from "../../styles/home.module.css";
import { useRouter } from "next/router";

interface trackInterface {
  title: string;
  link: string;
  _id: string;
  __v: number;
  contents?: string;
}

export default function Home() {
  const router = useRouter();
  const [tracks, setTracks] = useState<trackInterface[]>([]);
  const [isWaiting, setIsWaiting] = useState<boolean>(false);
  // const tracks = [
  //   {
  //     name: "Databases course",
  //     link: "https://github.com/Karam19/Databases",
  //     id: 0,
  //   },
  //   {
  //     name: "Front end basics",
  //     link: "https://github.com/Karam19/FWD_Assignments",
  //     id: 1,
  //   },
  // ];
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
  function handleClick() {
    router.push("/add-track");
  }

  async function handleDelete(id: string) {
    setIsWaiting(true);
    const response = await fetch(`/api/tracks/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (!data.success) {
      alert("Failed to delete");
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
    console.log("Fetched data is: ", data);
    return data.data;
  }

  useEffect(() => {
    const fetchTracks = async () => {
      const data: any = await getTracks();
      setTracks(data);
    };
    fetchTracks().catch(console.error);
  }, [isWaiting]);

  return (
    <>
      <h1 className={styles.title}>
        Exploration Etherscan + ChatGPt for education
      </h1>
      <h1 className={styles.h1}>Learning tracks</h1>
      {tracks.map((track) => (
        <div key={track._id} className={styles.container}>
          <h2 className={styles.h2}>{track.title}</h2>
          <p>
            Based on{" "}
            <a className={styles.a} href={track.link}>
              {getRepoName(track.link)}
            </a>
          </p>
          <button
            type="submit"
            disabled={isWaiting}
            className={styles.button}
            onClick={async () => {
              await handleDelete(track._id);
            }}
          >
            delete
          </button>
        </div>
      ))}
      <div className={styles.addContainer} onClick={handleClick}>
        <h1>Add new track</h1>
      </div>
    </>
  );
}
