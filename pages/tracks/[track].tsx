import { useState, useEffect } from "react";
import Layout from "../../src/components/layout";
import styles from "../../styles/home.module.css";
import { useRouter } from "next/router";
import { Popup } from "../../src/components/popup";

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
    const response = await fetch(`/api/contents/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (!data.success) {
      alert("Failed to delete");
    } else {
      alert("Deleted successfully!");
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
    console.log("fetched contents is: ", contentsArr);
    return contentsArr;
  }

  async function getTrack() {
    const response = await fetch(`/api/tracks/${trackId}`, {
      method: "GET",
    });
    const data = await response.json();
    console.log("Fetched track is: ", data.data);
    return data.data;
  }

  const handleNavContent = (id: string) => {
    router.push(`/contents/${id}`);
  };

  useEffect(() => {
    const fetchTrack = async () => {
      const data: any = await getTrack();
      setTrack(data);
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
    console.log("Length of contents is: ", track.contents.length);
    if (track.contents.length > 0) {
      fetchContents().catch(console.error);
    }
  }, [track]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Layout>
      <h1 className={styles.title}>{track?.title}</h1>
      <h1 className={styles.h3}>
        Based on This <a href={track.link}>repository</a>
      </h1>
      <h2 className={styles.h1}>Contents of the track</h2>
      {contents.map((content) => (
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
            <a className={styles.a} href={content.link}>
              {getFileName(content.link)}
            </a>
          </p>
          <button
            type="submit"
            disabled={isWaiting}
            className={styles.button}
            onClick={async () => {
              handleDelete(track._id);
            }}
          >
            delete
          </button>
        </div>
      ))}
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
