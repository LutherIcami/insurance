import { useEffect, useState } from "react";
import { FaCheckCircle, FaExclamationCircle, FaClock } from "react-icons/fa";

interface Claim {
  id: number;
  userID: number;
  claim_number: string;
  claim_type: string;
  status: string;
  claim_amount: number;
  created_at: string;
}

export default function ClaimsPage() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClaims() {
      try {
        const response = await fetch("/api/admin/claims");
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        setClaims(data);
      } catch (error) {
        console.error("Failed to fetch claims:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchClaims();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading claims...</p>;

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        Claims Management
      </h1>

      <div className="overflow-x-auto bg-white shadow-lg rounded-xl p-4">
        <table className="min-w-full text-left border-collapse">
          <thead className="bg-blue-600 text-white">
            <tr>
              {["ID", "User ID", "Claim Number", "Claim Type", "Status", "Claim Amount", "Created At"].map((heading) => (
                <th key={heading} className="py-3 px-4 font-semibold">{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {claims.map((claim, index) => (
              <tr key={claim.id} className={`border-b ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                <td className="py-3 px-4">{claim.id}</td>
                <td className="py-3 px-4">{claim.userID}</td>
                <td className="py-3 px-4">{claim.claim_number}</td>
                <td className="py-3 px-4">{claim.claim_type}</td>
                <td className="py-3 px-4">
                  <span className={`px-3 py-1 rounded-full flex items-center gap-2 text-white text-sm font-semibold ${
                    claim.status === "Approved"
                      ? "bg-green-500"
                      : claim.status === "Pending"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}>
                    {claim.status === "Approved" && <FaCheckCircle />}
                    {claim.status === "Pending" && <FaClock />}
                    {claim.status === "Rejected" && <FaExclamationCircle />}
                    {claim.status}
                  </span>
                </td>
                <td className="py-3 px-4">${claim.claim_amount.toFixed(2)}</td>
                <td className="py-3 px-4">{new Date(claim.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
