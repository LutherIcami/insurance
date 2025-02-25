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

  if (loading)
    return <div className="text-center mt-10 text-lg text-gray-700">Loading policies...</div>;

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Policies Management</h1>

      <div className="overflow-x-auto bg-white shadow-lg rounded-xl p-4">
        <table className="min-w-full border-collapse bg-white shadow-md rounded-lg">
          <thead className="bg-blue-700 text-white">
            <tr className="text-left">
              {["ID", "User ID", "Policy Name", "Coverage", "Premium", "Status", "Created At"].map(
                (heading) => (
                  <th key={heading} className="py-3 px-5 font-semibold">
                    {heading}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y text-gray-700">
            {policies.map((policy, index) => (
              <tr
                key={policy.id}
                className={`border-b ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-gray-100 transition-all`}
              >
                <td className="py-3 px-5">{policy.id}</td>
                <td className="py-3 px-5">{policy.userID}</td>
                <td className="py-3 px-5 font-medium text-gray-900">{policy.policyName}</td>
                <td className="py-3 px-5">{policy.coverageDetails}</td>
                <td className="py-3 px-5 font-semibold text-gray-800">${Number(policy.premium).toFixed(2)}s</td>
                <td className="py-3 px-5">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold text-white shadow-md ${
                      policy.status === "Active" ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {policy.status}
                  </span>
                </td>
                <td className="py-3 px-5">{new Date(policy.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
