import Layout from "../src/components/layout";
import Chat from "../src/components/chat";
import Head from "next/head";

export default function ChatPage() {
  return (
    <Layout>
      <Head>
        <title>Chat</title>
      </Head>
      <Chat />
    </Layout>
  );
}
