import Layout from "../src/components/layout";
import Test from "../src/components/test";
import Chat from "../src/components/chat";
import AddContent from "../src/components/addContent";

export default function IndexPage() {
  return (
    <Layout>
      <h1>Exploration Etherscan + ChatGPt for education</h1>
      {/* <p>Here you will find learning tracks</p> */}
      <AddContent />
    </Layout>
  );
}
