import { useState, useEffect } from "react";
import Layout from "../../src/components/layout";
import styles from "../../styles/home.module.css";
import { useRouter } from "next/router";
import { Popup } from "../../src/components/popup";
import { useSession } from "next-auth/react";
import Head from "next/head";

interface trackInterface {
  title: string;
  link: string;
  _id: string;
  __v?: number;
  contents: string[];
}

interface contentInterface {
  topics: string;
  link: string;
  _id: string;
  __v?: number;
  answer: string;
}

interface popup {
  show: boolean;
  id: string;
}

export default function Track() {
  const router = useRouter();
  const [track, setTrack] = useState<trackInterface>({
    title: "Loading...",
    link: "/",
    _id: "None",
    contents: [],
  });
  const [contents, setContents] = useState<contentInterface[]>([]);
  const [isWaiting, setIsWaiting] = useState<boolean>(false);
  const [popup, setPopup] = useState<popup>({
    show: false,
    id: "null",
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { status } = useSession();

  const { track: trackId } = router.query;

  function getFileName(url: string) {
    const fileRe = new RegExp("[^/]*$", "g");
    const file = fileRe.exec(url);
    if (file === null) {
      return;
    }

    return file;
  }

  function handleClick() {
    router.push(`/tracks/${trackId}/add-content`);
  }

  const handleDelete = (id: string) => {
    if (status === "unauthenticated") {
      alert("Failed to delete!\nPlease Sign in");
      return;
    }
    setPopup({
      show: true,
      id,
    });
  };

  const handleDeleteTrue = async () => {
    if (popup.show && popup.id !== "null") {
      await deleteContent(popup.id);
      setPopup({
        show: false,
        id: "null",
      });
    }
  };

  const handleDeleteFalse = () => {
    setPopup({
      show: false,
      id: "null",
    });
  };

  async function deleteContent(id: string) {
    setIsWaiting(true);
    console.log("Id is: ", id);
    const response = await fetch(`/api/contents/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        trackId: trackId,
      }),
    });
    const data = await response.json();
    if (!data.success) {
      const statusCode = response.status;
      if (statusCode === 401) {
        alert("Failed to delete!\nPlease Sign in");
      } else if (statusCode === 403) {
        alert("Failed to delete!\nYou don't have permission to delete");
      } else if (statusCode === 400) {
        alert("Failed to delete!\nBad request");
      }
    } else {
      alert("Deleted successfully!");
      router.reload();
    }
    setIsWaiting(false);
  }

  async function getContents() {
    const contentsArr = [];
    for (let i = 0; i < track.contents.length; i++) {
      const response = await fetch(`/api/contents/${track.contents[i]}`, {
        method: "GET",
      });
      const data = await response.json();
      contentsArr.push(data.data);
    }
    return contentsArr;
  }

  async function getTrack() {
    const response = await fetch(`/api/tracks/${trackId}`, {
      method: "GET",
    });
    const data = await response.json();
    return data.data;
  }

  const handleNavContent = (id: string) => {
    router.push(`/contents/${id}`);
  };

  useEffect(() => {
    const fetchTrack = async () => {
      const data: any = await getTrack();
      setTrack(data);
      setIsLoading(false);
    };
    if (trackId !== undefined) {
      fetchTrack().catch(console.error);
    }
  }, [trackId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const fetchContents = async () => {
      const data: any = await getContents();
      setContents(data);
    };
    if (track.contents.length > 0) {
      fetchContents().catch(console.error);
    }
  }, [track]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Layout>
      <Head>
        <title>Content of track</title>
      </Head>
      <h1 className={styles.title}>{track?.title}</h1>
      <h1 className={styles.h3}>
        Based on This <a href={track.link}>repository</a>
      </h1>
      <h2 className={styles.h1}>Contents of the track</h2>
      {isLoading ? (
        <h1 className={styles.title}>Loading...</h1>
      ) : contents.length === 0 ? (
        <h1 className={styles.title}>No contents in this track</h1>
      ) : (
        contents.map((content) => (
          <div
            key={content._id}
            className={styles.container}
            onClick={() => {
              handleNavContent(content._id);
            }}
          >
            <h2 className={styles.h2}>{content.topics}</h2>
            <p>
              Based on{" "}
              <a
                className={styles.a}
                href={content.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(content.link, "_blank");
                }}
              >
                {getFileName(content.link)}
              </a>
            </p>
            <button
              type="submit"
              disabled={isWaiting}
              className={styles.button}
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDelete(content._id);
              }}
            >
              delete
            </button>
          </div>
        ))
      )}
      <div className={styles.addContainer} onClick={handleClick}>
        <h1>Add new content</h1>
      </div>
      {popup.show && (
        <Popup
          handleDeleteTrue={handleDeleteTrue}
          handleDeleteFalse={handleDeleteFalse}
        />
      )}
    </Layout>
  );
}
