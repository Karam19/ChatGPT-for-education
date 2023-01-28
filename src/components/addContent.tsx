import { useState } from "react";
import styles from "../../styles/addContent.module.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Editor from "@monaco-editor/react";
import { languageOptions } from "../constants/languageOptions";
import LanguagesDropdown from "./languagesDropdown";

export default function AddContent() {
  const router = useRouter();
  const { track: trackId } = router.query;
  const { status } = useSession();
  const [topics, setTopics] = useState("");
  const [url, setUrl] = useState("");
  const [searchError, setSearchError] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");
  const [code, setCode] = useState<string>(
    "// please add a link to a github file and click on fetch button"
  );
  const [isWaiting, setIsWaiting] = useState<boolean>(false);
  const [language, setLanguage] = useState(languageOptions[0]);

  function handleTopicChange(event: any) {
    setTopics(event.target.value);
  }

  function handleUrlChange(event: any) {
    setUrl(event.target.value);
  }

  function handleContentChange(event: any) {
    setContent(event.target.value);
  }

  const onSelectChange = (sl: any) => {
    console.log("selected Option...", sl);
    setLanguage(sl);
  };

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
    const statusCode = response.status;
    console.log("Status code is: ", statusCode);
    if (!data.success) {
      setContent("Unkown error");
      if (statusCode === 404) {
        alert(
          "ChatGPT couldn't process your request!\nPlease check that file length don't exceed 4k tokens."
        );
      } else {
        alert("Unkown error!");
      }
    } else {
      setContent(data.result.choices[0].text);
    }
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
      } else if (statusCode === 409) {
        alert(
          "Failed to add content!\nGithub file should be under tracks' repository"
        );
      }
    } else {
      router.push(`/contents/${data.data._id}`);
    }
  }

  async function fetchCode(
    owner: string,
    repo: string,
    ref: string,
    path: string
  ) {
    setIsWaiting(true);
    setCode("// Generating...");
    const response = await fetch("/api/contents/fetchcode", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        owner: owner,
        repo: repo,
        ref: ref,
        path: path,
      }),
    });
    const data = await response.json();
    const statusCode = response.status;
    console.log("Status code is: ", statusCode);
    if (!data.success) {
      setCode("// Unkown error");
      alert("Unkown error");
    } else {
      setCode(data.result);
      console.log("Type of data is: ", typeof data.result);
      console.log("data is ", code);
    }
    setIsWaiting(false);
  }

  async function handleFetch() {
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

    setSearchError(false);
    fetchCode(owner[0], repo[0], ref[0], path[0]);
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
        <div className={styles.element}>
          <button
            type="submit"
            className={styles.button}
            disabled={isWaiting}
            onClick={handleFetch}
          >
            fetch code
          </button>
        </div>
        <div className={styles.element}>
          <LanguagesDropdown onSelectChange={onSelectChange} />
        </div>

        <Editor
          height="90vh"
          language={language.value || "javascript"}
          defaultValue="// please add a link to a github file and click on fetch button"
          value={code}
        />
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
