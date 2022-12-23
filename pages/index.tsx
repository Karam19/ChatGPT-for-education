import { signIn, signOut, useSession } from "next-auth/react";

export default function Page() {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  return (
    <>
      {!session && (
        <>
          Not signed in <br />
          <button onClick={() => signIn()}>Sign in</button>
        </>
      )}
      {session && (
        <>
          Signed in as {session.user} <br />
          <button onClick={() => signOut()}>Sign out</button>
        </>
      )}
    </>
  );
}
