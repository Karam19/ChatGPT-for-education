import { useState } from "react";
import styles from "./test.module.css";
import { getContributors } from "../../utils/Scraper";

export default function Test() {
  const [url, setUrl] = useState("Enter address here");
  function handleUrlChange(event: any) {
    setUrl(event.target.value);
  }
  async function handleSearch() {
    console.log("url here is: ", url);
    const htmlData = await getContributors(url);
    console.log("html data is: ", htmlData);
  }
  return (
    <>
      <input
        className={styles.input}
        type="text"
        value={url}
        onChange={handleUrlChange}
      />
      <button type="submit" className={styles.button} onClick={handleSearch}>
        Search
      </button>
    </>
  );
}
