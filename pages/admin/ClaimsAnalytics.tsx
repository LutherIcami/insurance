import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

// Update type to allow string month names
interface ChartData {
  month: string;
  count: number;
}

interface ClaimData {
  month: number;
  count: number;
}

export default function ClaimsAnalytics() {
  const [data, setData] = useState<ChartData[]>([]); // Update type here
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchClaimsData() {
      try {
        const response = await fetch("/api/admin/claims-analytics");
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

        const claims: ClaimData[] = await response.json();

        console.log("Claims API Response:", claims); // Debugging output

        if (!Array.isArray(claims)) {
          throw new Error("Unexpected API response: Not an array");
        }

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        // Ensure month is within valid range
        const formattedData: ChartData[] = claims
          .filter((item) => item.month >= 1 && item.month <= 12)
          .map((item) => ({
            month: monthNames[item.month - 1], // Convert numeric month to name
            count: item.count,
          }));

        setData(formattedData); // ✅ Now it matches the correct type
      } catch (error) {
        console.error("Error fetching claims data:", error);
        setError("Failed to load claims data.");
      } finally {
        setLoading(false);
      }
    }

    fetchClaimsData();
  }, []);

  if (loading) return <p>Loading claims analytics...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-black">Claims Per Month</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#3498db" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
