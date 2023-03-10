import React from "react";
import styles from "../../styles/chat.module.css";

export default function Chat() {
  const [value, setValue] = React.useState<string>("");
  const [prompt, setPrompt] = React.useState<string>("");
  const [completion, setCompletion] = React.useState<string>("");

  const handleInput = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
    },
    []
  );

  const handleKeyDown = React.useCallback(
    async (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        setPrompt(value);
        setCompletion("Loading...");
        const response = await fetch("/api/chatGPT/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: value }),
        });
        const data = await response.json();
        setValue("");
        if (data.status === 401) {
          alert("Please sign in to use chat");
          setCompletion("Loading...");
        } else {
          setCompletion(data.result.choices[0].text);
        }
      }
    },
    [value]
  );

  return (
    <div className={styles.main}>
      <div>Ask ChatGPT</div>
      <input value={value} onChange={handleInput} onKeyDown={handleKeyDown} />
      <div>Question: {prompt}</div>
      <div>
        Answer:{" "}
        {completion.split("\n").map((item) => (
          <>
            {item}
            <br />
          </>
        ))}
      </div>
    </div>
  );
}
