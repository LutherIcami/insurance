import { useEffect, useState } from "react";
import { FaPlusCircle } from "react-icons/fa";

interface Claim {
  id: number;
  policyId: number;
  description: string;
  status: string;
  createdAt: string;
}

export default function UserClaims() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [description, setDescription] = useState("");
  const [policyId, setPolicyId] = useState("");
  const [error, setError] = useState<string | null>(null); // Set error to null initially

  useEffect(() => {
    async function fetchClaims() {
      try {
        const response = await fetch("/api/user/claims");
        if (!response.ok) throw new Error("Failed to fetch claims.");
        
        const data = await response.json();
        setClaims(data);
        setError(null); // Clear error if successful
      } catch (err) {
        console.error("Error fetching claims:", err); // Now "err" is used
        setError("Failed to fetch claims.");
      } finally {
        setLoading(false);
      }
    }
    fetchClaims();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const response = await fetch("/api/user/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ policyId, description }),
      });

      if (!response.ok) throw new Error("Failed to submit claim");

      const newClaim = await response.json();
      setClaims([newClaim, ...claims]);
      setDescription("");
      setPolicyId("");
      setError(null); // Clear error on successful submission
    } catch (err) {
        console.error("Error fetching claims:", err);
      setError("Failed to submit claim.");
    }
  }

  if (loading) return <p className="text-center text-gray-600">Loading claims...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Your Claims</h1>

      {/* Show Error if Exists */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Claims List */}
      <ul className="mb-6">
        {claims.length === 0 ? (
          <p className="text-gray-600">No claims found.</p>
        ) : (
          claims.map((claim) => (
            <li key={claim.id} className="border p-4 rounded-lg mb-2">
              <p><strong>Policy ID:</strong> {claim.policyId}</p>
              <p><strong>Description:</strong> {claim.description}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span className={`font-bold ${claim.status === "Pending" ? "text-yellow-500" : "text-green-500"}`}>
                  {claim.status}
                </span>
              </p>
              <p className="text-sm text-gray-600">
                {new Date(claim.createdAt).toLocaleDateString()}
              </p>
            </li>
          ))
        )}
      </ul>

      {/* Submit New Claim Form */}
      <h2 className="text-xl font-bold mb-2">Submit a New Claim</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Policy ID"
          value={policyId}
          onChange={(e) => setPolicyId(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          placeholder="Describe your claim"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded flex items-center gap-2">
          <FaPlusCircle /> Submit Claim
        </button>
      </form>
    </div>
  );
}
