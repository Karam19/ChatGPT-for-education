import { useState } from "react";
import Layout from "../src/components/layout";
import styles from "../styles/addContent.module.css";

export default function AddTrack() {
  const [trackName, setTrackName] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [searchError, setSearchError] = useState<boolean>(false);

  function handleTrackNameChange(event: any) {
    setTrackName(event.target.value);
  }

  function handleUrlChange(event: any) {
    setUrl(event.target.value);
  }

  function handleSubmit() {
    const ownerRe = new RegExp("(?<=https://github.com/).+?(?=/)", "g");
    const owner = ownerRe.exec(url);
    if (owner === null) {
      setSearchError(true);
      return;
    }

    const repoRe = new RegExp(
      `(?<=https://github.com/${owner[0]}/).+?(?=/blob/)`,
      "g"
    );
    const repo = repoRe.exec(url);
    if (repo === null) {
      setSearchError(true);
      return;
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
        <button type="submit" className={styles.button} onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </Layout>
  );
}
