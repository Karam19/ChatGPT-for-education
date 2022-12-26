import { useState } from "react";
import styles from "../../styles/test.module.css";
import { getContent } from "../../utils/Scraper";
import { CopyBlock, dracula } from "react-code-blocks";

export default function Test() {
  const [url, setUrl] = useState("Enter address here");
  const [content, setContent] = useState("");
  const [showMe, setShowMe] = useState(false);
  function toggle() {
    setShowMe(!showMe);
  }
  function handleUrlChange(event: any) {
    setUrl(event.target.value);
  }
  async function handleSearch() {
    const htmlData = await getContent(url);
    setContent(Buffer.from(htmlData, "base64").toString("binary"));
    console.log("html data is: ", content);
  }
  return (
    <>
      <div className={styles.container}>
        <input
          className={styles.input}
          type="text"
          value={url}
          onChange={handleUrlChange}
        />
        <button type="submit" className={styles.button} onClick={handleSearch}>
          Search
        </button>

        <button className={styles.button} onClick={toggle}>
          {showMe ? <div>Hide code</div> : <div>Show code</div>}
        </button>
        <div
          style={{
            display: showMe ? "block" : "none",
          }}
        >
          {content ? (
            <CopyBlock
              text={content}
              language="javascript"
              showLineNumbers="true"
              wrapLines
              theme={dracula}
            />
          ) : (
            <p>No code to show currently</p>
          )}
        </div>
      </div>
    </>
  );
}
