import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { FaUsers, FaFileAlt, FaClipboardList } from "react-icons/fa";
import ClaimsAnalytics from "@/pages/admin/ClaimsAnalytics";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // State for stats
  const [stats, setStats] = useState({ totalUsers: 0, totalPolicies: 0, pendingClaims: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    if (!session || session?.user?.role?.toLowerCase() !== "admin") {
      router.push("/auth/login"); // Redirect non-admin users
    }

    async function fetchStats() {
      try {
        const response = await fetch("/api/admin/stats");
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [session, status, router]);

  if (status === "loading" || loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>

        {/* Dashboard Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Users */}
          <div className="bg-white p-6 rounded-2xl shadow flex items-center gap-4">
            <div className="bg-blue-500 p-4 rounded-full text-white">
              <FaUsers size={24} />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-700">Total Users</h3>
              <p className="text-gray-500">{stats.totalUsers}</p>
            </div>
          </div>

          {/* Total Policies */}
          <div className="bg-white p-6 rounded-2xl shadow flex items-center gap-4">
            <div className="bg-green-500 p-4 rounded-full text-white">
              <FaFileAlt size={24} />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-700">Total Policies</h3>
              <p className="text-gray-500">{stats.totalPolicies}</p>
            </div>
          </div>

          {/* Pending Claims */}
          <div className="bg-white p-6 rounded-2xl shadow flex items-center gap-4">
            <div className="bg-red-500 p-4 rounded-full text-white">
              <FaClipboardList size={24} />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-700">Pending Claims</h3>
              <p className="text-gray-500">{stats.pendingClaims}</p>
            </div>
          </div>
        </div>

        {/* Claims Analytics Graph */}
        <div className="mt-8 bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Claims Analytics</h2>
          <ClaimsAnalytics />
        </div>
      </main>
    </div>
  );
}
