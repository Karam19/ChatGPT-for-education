import Layout from "../../src/components/layout";
import styles from "../../styles/home.module.css";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

interface contentInterface {
  topics: string;
  link: string;
  _id: string;
  __v?: number;
  answer: string;
}

export default function Content() {
  const router = useRouter();
  const [content, setContent] = useState<contentInterface>({
    topics: "Loading...",
    link: "/",
    _id: "None",
    answer: "Loading",
  });

  const { content: contentId } = router.query;

  async function getContent() {
    const response = await fetch(`/api/contents/${contentId}`, {
      method: "GET",
    });
    const data = await response.json();
    return data.data;
  }

  useEffect(() => {
    const fetchContent = async () => {
      const data: any = await getContent();
      setContent(data);
    };
    if (contentId !== undefined) {
      fetchContent().catch(console.error);
    }
  }, [contentId]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Layout>
      <h1 className={styles.title}>{content?.topics}</h1>
      <h1 className={styles.h3}>
        Based on This <a href={content.link}>code</a>
      </h1>
      <div>
        Answer:{" "}
        {content.answer.split("\n").map((item) => (
          <>
            {item}
            <br />
          </>
        ))}
      </div>
    </Layout>
  );
}
