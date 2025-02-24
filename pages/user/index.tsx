import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Dashboard from "../dashboard";

export default function UserDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") return <p>Loading...</p>;
  if (!session || !session.user) {
    router.push("/auth/login");
    return null;
  }
  

  return (
    <div className="p-6">

     <Dashboard />

    </div>
  );
}
