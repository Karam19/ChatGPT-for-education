import Layout from "../../../src/components/layout";
import AddContent from "../../../src/components/addContent";
import { useRouter } from "next/router";

export default function Track() {
  const router = useRouter();

  const { track: trackId } = router.query;

  return (
    <Layout>
      <AddContent trackId={trackId || ""} />
    </Layout>
  );
}
