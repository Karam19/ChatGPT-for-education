import Layout from "../../../src/components/layout";
import AddContent from "../../../src/components/addContent";
import Head from "next/head";

export default function Track() {

  return (
    <Layout>
      <Head>
        <title>Add content</title>
      </Head>
      <AddContent />
    </Layout>
  );
}
  