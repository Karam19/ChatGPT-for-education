import { useState } from "react";
import Layout from "../src/components/layout";
import styles from "../styles/addContent.module.css";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export default function AddTrack() {
  const router = useRouter();
  const [trackName, setTrackName] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [searchError, setSearchError] = useState<boolean>(false);
  const [isWaiting, setIsWaiting] = useState<boolean>(false);
  const { status } = useSession();

  function handleTrackNameChange(event: any) {
    setTrackName(event.target.value);
  }

  function handleUrlChange(event: any) {
    setUrl(event.target.value);
  }

  async function handleSubmit() {
    setIsWaiting(true);
    if (status === "unauthenticated") {
      alert("Failed to add track!\nPlease Sign in");
      setIsWaiting(false);
      return;
    }
    const ownerRe = new RegExp("(?<=https://github.com/).+?(?=/)", "g");
    const owner = ownerRe.exec(url);
    if (owner === null) {
      setSearchError(true);
      setIsWaiting(false);
      return;
    }

    const repoRe = new RegExp(`(?<=https://github.com/${owner[0]}/).+`, "g");
    const repo = repoRe.exec(url);
    if (repo === null) {
      setSearchError(true);
      setIsWaiting(false);
      return;
    }
    console.log("Owner and Repo are: ", owner, repo);
    setSearchError(false);

    // const response = await fetch("/api/tracks", {
    //   method: "GET",
    // });
    // const data = await response.json();
    // console.log("Fetched data is: ", data);

    const response = await fetch("/api/tracks", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: trackName, link: url }),
    });
    const data = await response.json();
    console.log("Fetched data is: ", data);
    setIsWaiting(false);
    if (!data.success) {
      const statusCode = response.status;
      if (statusCode === 401) {
        alert("Failed to add track!\nPlease Sign in");
      } else if (statusCode === 403) {
        alert(
          "Failed to add track!\nYou don't have permission to add this track"
        );
      } else if (statusCode === 403) {
        alert("Failed to add track!\nBad request");
      }
    } else {
      router.push(`/tracks/${data._id}`);
    }
  }

  return (
    <Layout>
      <div className={styles.container}>
        <label className={styles.label}>Name of the track</label>
        <input
          className={styles.input}
          type="text"
          value={trackName}
          onChange={handleTrackNameChange}
        />
        <label className={styles.label}>Link to the repository</label>
        <input
          className={styles.input}
          type="text"
          value={url}
          onChange={handleUrlChange}
        />
        {searchError && (
          <div className={styles.errortext}>Invalid github url</div>
        )}
        <button
          disabled={isWaiting}
          type="submit"
          className={styles.button}
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </Layout>
  );
}
