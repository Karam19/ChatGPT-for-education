import axios from "axios";
// import { JSDOM } from "jsdom";

export function fetchPage(url: string): Promise<string | undefined> {
  const HTMLData = axios
    .get(url)
    .then((res) => res.data)
    .catch((error) => {
      console.error(`There was an error with ${error.config.url}.`);
      console.error(error.toJSON());
    });

  return HTMLData;
}

// export async function fetchFromWebOrCache(url: string) {
//   // Get the HTMLData from fetching or from cache
//   const HTMLData = await fetchPage(url);
//   const dom = new JSDOM(HTMLData);
//   return dom.window.document;
// }
