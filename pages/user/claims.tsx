import { useEffect, useState } from "react";
import { FaPlusCircle } from "react-icons/fa";

interface Claim {
  id: number;
  policyId: number;
  description: string;
  status: string;
  createdAt: string;
  attachmentUrl?: string;
}

export default function UserClaims() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [description, setDescription] = useState("");
  const [policyId, setPolicyId] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchClaims() {
      try {
        const response = await fetch("/api/user/claims");
        if (!response.ok) throw new Error("Failed to fetch claims.");

        const data = await response.json();
        setClaims(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching claims:", err);
        setError("Failed to fetch claims.");
      } finally {
        setLoading(false);
      }
    }
    fetchClaims();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setUploading(true);
    try {
      let attachmentUrl = "";
      
      if (attachment) {
        const formData = new FormData();
        formData.append("file", attachment);
        
        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) throw new Error("File upload failed");

        const uploadData = await uploadResponse.json();
        attachmentUrl = uploadData.url;
      }

      const response = await fetch("/api/user/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ policyId, description, attachmentUrl }),
      });

      if (!response.ok) throw new Error("Failed to submit claim");

      const newClaim = await response.json();
      setClaims([newClaim, ...claims]);
      setDescription("");
      setPolicyId("");
      setAttachment(null);
      setError(null);
    } catch (err) {
      console.error("Error submitting claim:", err);
      setError("Failed to submit claim.");
    } finally {
      setUploading(false);
    }
  }

  if (loading) return <p className="text-center text-gray-600">Loading claims...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Your Claims</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

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
              {claim.attachmentUrl && (
                <p>
                  <strong>Attachment:</strong> <a href={claim.attachmentUrl} target="_blank" className="text-blue-500 underline">View File</a>
                </p>
              )}
              <p className="text-sm text-gray-600">
                {new Date(claim.createdAt).toLocaleDateString()}
              </p>
            </li>
          ))
        )}
      </ul>

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
        <input
          type="file"
          onChange={(e) => setAttachment(e.target.files ? e.target.files[0] : null)}
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded flex items-center gap-2" disabled={uploading}>
          <FaPlusCircle /> {uploading ? "Submitting..." : "Submit Claim"}
        </button>
      </form>
    </div>
  );
}
