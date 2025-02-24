import { useEffect, useState } from "react";

interface Policy {
  id: number;
  userID: number;
  policyName: string;
  coverageDetails: string;
  premium: number;
  status: string;
  createdAt: string;
}

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPolicies() {
      try {
        const response = await fetch("/api/admin/policies");
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
        setPolicies(data);
      } catch (error) {
        console.error("Failed to fetch policies:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPolicies();
  }, []);
  
  if (loading) return <div className="text-center mt-10">Loading policies...</div>;

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Policies Management</h1>
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full table-auto bg-white shadow-md rounded-lg">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-6 border-b text-left">ID</th>
              <th className="py-3 px-6 border-b text-left">User ID</th>
              <th className="py-3 px-6 border-b text-left">Policy Name</th>
              <th className="py-3 px-6 border-b text-left">Coverage Details</th>
              <th className="py-3 px-6 border-b text-left">Premium</th>
              <th className="py-3 px-6 border-b text-left">Status</th>
              <th className="py-3 px-6 border-b text-left">Created At</th>
            </tr>
          </thead>
          <tbody>
            {policies.map((policy) => (
              <tr key={policy.id} className="border-b hover:bg-gray-100 transition-colors">
                <td className="py-3 px-6">{policy.id}</td>
                <td className="py-3 px-6">{policy.userID}</td>
                <td className="py-3 px-6">{policy.policyName}</td>
                <td className="py-3 px-6">{policy.coverageDetails}</td>
                <td className="py-3 px-6">${policy.premium.toFixed(2)}</td>
                <td className={`py-3 px-6 ${policy.status === "Active" ? "text-green-600" : "text-red-600"}`}>
                  {policy.status}
                </td>
                <td className="py-3 px-6">{new Date(policy.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
