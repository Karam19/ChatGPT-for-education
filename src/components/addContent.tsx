import { useState } from "react";
import styles from "./addContent.module.css";
import { getContent } from "../../utils/Scraper";

export default function AddContent() {
  // Owner regex is: (?<=https:\/\/github\.com\/).+?(?=\/)
  // Owner and repo regex: (?<=https:\/\/github\.com\/).+?(?=\/).+?(?=\/)
  // Repo regex: (?<=https:\/\/github\.com\/Karam19\/).+?(?=\/blob\/)
  // ref regex: (?<=blob\/).+?(?=\/)
  // path regex: (?<=blob\/main).+
  const [topics, setTopics] = useState("");
  const [url, setUrl] = useState("");
  //   const [content, setContent] = useState("");
  const [searchError, setSearchError] = useState<boolean>(false);

  function handleTopicChange(event: any) {
    setTopics(event.target.value);
  }

  function handleUrlChange(event: any) {
    setUrl(event.target.value);
  }

  async function handleGenerate() {
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

    const refRe = new RegExp("(?<=blob/).+?(?=/)", "g");
    const ref = refRe.exec(url);
    if (ref === null) {
      setSearchError(true);
      return;
    }

    const pathRe = new RegExp(`(?<=blob/${ref[0]}).+`, "g");
    const path = pathRe.exec(url);
    if (path === null) {
      setSearchError(true);
      return;
    }

    console.log("Owner is: ", owner[0]);
    console.log("repo is: ", repo[0]);
    console.log("ref is: ", ref[0]);
    console.log("path is: ", path[0]);
    setSearchError(false);
  }

  return (
    <>
      <div className={styles.container}>
        <label className={styles.label}>What can be learnt?</label>
        <input
          className={styles.input}
          type="text"
          value={topics}
          onChange={handleTopicChange}
        />
        <label className={styles.label}>Link to materials</label>
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
          type="submit"
          className={styles.button}
          onClick={handleGenerate}
        >
          Generate content
        </button>
      </div>
    </>
  );
}
