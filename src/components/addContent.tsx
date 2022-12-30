import { useState } from "react";
import styles from "../../styles/addContent.module.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function AddContent() {
  const router = useRouter();
  const { track: trackId } = router.query;
  const { status } = useSession();
  const [topics, setTopics] = useState("");
  const [url, setUrl] = useState("");
  const [searchError, setSearchError] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");
  const [isWaiting, setIsWaiting] = useState<boolean>(false);

  function handleTopicChange(event: any) {
    setTopics(event.target.value);
  }

  function handleUrlChange(event: any) {
    setUrl(event.target.value);
  }

  function handleContentChange(event: any) {
    setContent(event.target.value);
  }

  async function GenerateContetnt(
    owner: string,
    repo: string,
    ref: string,
    path: string
  ) {
    setIsWaiting(true);
    setContent("Generating...");
    const response = await fetch("/api/contents/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        owner: owner,
        repo: repo,
        ref: ref,
        path: path,
        topics: topics,
        trackId: trackId,
      }),
    });
    const data = await response.json();
    console.log(data.result.choices[0].text);
    setContent(data.result.choices[0].text);
    setIsWaiting(false);
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
    GenerateContetnt(owner[0], repo[0], ref[0], path[0]);
  }

  async function handleSubmit() {
    setIsWaiting(true);
    if (content.length === 0 || url.length === 0 || topics.length === 0) {
      alert("Invalid fields");
      setIsWaiting(false);
      return;
    }
    if (status === "unauthenticated") {
      alert("Failed to add content!\nPlease Sign in");
      setIsWaiting(false);
      return;
    }
    const response = await fetch("/api/contents", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topics: topics,
        link: url,
        answer: content,
        trackId: trackId,
      }),
    });
    const data = await response.json();
    setIsWaiting(false);
    if (!data.success) {
      const statusCode = response.status;
      if (statusCode === 401) {
        alert("Failed to add content!\nPlease Sign in");
      } else if (statusCode === 403) {
        alert(
          "Failed to add content!\nYou don't have permission to add content"
        );
      } else if (statusCode === 403) {
        alert("Failed to add content!\nBad request");
      }
    } else {
      router.push(`/contents/${data._id}`);
    }
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
          disabled={isWaiting}
          onClick={handleGenerate}
        >
          Generate content
        </button>
        <label className={styles.label}>Content</label>
        <textarea
          className={styles.textarea}
          value={content}
          onChange={handleContentChange}
        ></textarea>
        <button
          type="submit"
          className={styles.button}
          onClick={handleSubmit}
          disabled={isWaiting}
        >
          Submit
        </button>
      </div>
    </>
  );
}
