import { useState } from "react";
import styles from "../../styles/home.module.css";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const tracks = [
    {
      name: "Databases course",
      link: "https://github.com/Karam19/Databases",
      id: 0,
    },
    {
      name: "Front end basics",
      link: "https://github.com/Karam19/FWD_Assignments",
      id: 1,
    },
  ];
  function getRepoName(url: string) {
    const ownerRe = new RegExp("(?<=https://github.com/).+?(?=/)", "g");
    const owner = ownerRe.exec(url);
    if (owner === null) {
      return;
    }
    const repoRe = new RegExp(`(?<=https://github.com/${owner[0]}/).+`, "g");
    const repo = repoRe.exec(url);
    return repo;
  }
  function handleClick(event: any) {
    router.push("/add-track");
  }
  return (
    <>
      <h1 className={styles.title}>
        Exploration Etherscan + ChatGPt for education
      </h1>
      <h1 className={styles.h1}>Learning tracks</h1>
      {tracks.map((track) => (
        <div key={track.id} className={styles.container}>
          <h2 className={styles.h2}>{track.name}</h2>
          <p>
            Based on{" "}
            <a className={styles.a} href={track.link}>
              {getRepoName(track.link)}
            </a>
          </p>
        </div>
      ))}
      <div className={styles.addContainer} onClick={handleClick}>
        <h1>Add new track</h1>
      </div>
    </>
  );
}
