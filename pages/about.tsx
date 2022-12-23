import { useSession } from "next-auth/react";
import Layout from "../src/components/layout";

export default function About() {
  const { data } = useSession();

  return (
    <Layout>
      <h1>About the app</h1>
      <div>This app is ....</div>
    </Layout>
  );
}
