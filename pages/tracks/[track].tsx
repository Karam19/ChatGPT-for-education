import Layout from "../../src/components/layout";
import styles from "../../styles/home.module.css";
import { useRouter } from "next/router";

export default function Track() {
  const router = useRouter();

  const { track: trackId } = router.query;
  function handleClick() {
    router.push(`/tracks/${trackId}/add-content`);
  }

  return (
    <Layout>
      <h1 className={styles.title}>
        Exploration Etherscan + ChatGPt for education
      </h1>
      {/* <h1 className={styles.h1}>Learning tracks</h1>
      {tracks.map((track) => (
        <div key={track._id} className={styles.container}>
          <h2 className={styles.h2}>{track.title}</h2>
          <p>
            Based on{" "}
            <a className={styles.a} href={track.link}>
              {getRepoName(track.link)}
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
        <h1>Add new track</h1>
      </div>
      {popup.show && (
        <Popup
          handleDeleteTrue={handleDeleteTrue}
          handleDeleteFalse={handleDeleteFalse}
        />
      )} */}
      <div className={styles.addContainer} onClick={handleClick}>
        <h1>Add new content</h1>
      </div>
    </Layout>
  );
}
