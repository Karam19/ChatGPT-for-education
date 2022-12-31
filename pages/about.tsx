import Layout from "../src/components/layout";
import Head from "next/head";

export default function About() {

  return (
    <Layout>
      <Head>
        <title>About</title>
      </Head>
      <h1>About the app</h1>
      <div>This app is ....</div>
    </Layout>
  );
}
