import Layout from "../src/components/layout";
import Test from "../src/components/test";
import Chat from "../src/components/chat";

export default function IndexPage() {
  return (
    <Layout>
      <h1>Exploration Etherscan + ChatGPt for education</h1>
      <p>Here you will find learning tracks</p>
      <Chat />
    </Layout>
  );
}
