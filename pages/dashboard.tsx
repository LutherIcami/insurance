import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FaMoneyBillWave, FaFileAlt, FaBell, FaShieldAlt } from "react-icons/fa";
import Navbar from "../components/Navbar";
import PolicyCarousel from "@/components/PolicyCarousel";
import Link from 'next/link';


interface Policy {
  id: number;
  name: string;
  number: string;
  coverage: string;
  premium: number;
  startDate: string;
  endDate: string;
  status: string;
}

interface Claim {
  id: number;
  type: string;
  status: string;
  amount: number;
  filedDate: string;
  settledDate?: string;
}

interface Payment {
  id: number;
  amount: number;
  date: string;
  method: string;
}

export default function UserDashboard() {
  const { data: session } = useSession();
  const router = useRouter();

  const [policies, setPolicies] = useState<Policy[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) router.push("/auth/login");

    async function fetchData() {
      try {
        const [policiesRes, claimsRes, paymentsRes] = await Promise.all([
          fetch("/api/users/policies").then((res) => res.json()),
          fetch("/api/users/claims").then((res) => res.json()),
          fetch("/api/users/payments").then((res) => res.json()),
        ]);

        setPolicies(policiesRes);
        setClaims(claimsRes);
        setPayments(paymentsRes);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [session, router]);

  if (loading) return <p className="text-center text-lg font-semibold">Loading dashboard...</p>;

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <Navbar />
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Welcome, {session?.user?.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Active Policies */}
        <section className="bg-white p-6 shadow-lg rounded-xl">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-700"><FaShieldAlt /> Active Policies</h2>
          <div className="mt-4 space-y-3">
            {policies.map((policy) => (
              <div key={policy.id} className="p-3 border rounded-lg shadow-sm">
                <p className="font-medium text-gray-700">{policy.name} - {policy.coverage}</p>
                <p className="text-sm text-gray-500">Premium: ${policy.premium}/month | Status: {policy.status}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Claims Section */}
        <Link href="users/claims" passHref>
        <section className="bg-white p-6 shadow-lg rounded-xl">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-700"><FaFileAlt /> Claims</h2>
          <div className="mt-4 space-y-3">
            {claims.map((claim) => (
              <div key={claim.id} className="p-3 border rounded-lg shadow-sm">
                <p className="font-medium text-gray-700">{claim.type} - {claim.status}</p>
                <p className="text-sm text-gray-500">Amount: ${claim.amount} | Filed: {claim.filedDate}</p>
              </div>
            ))}
          </div>
        </section>
        </Link>

        {/* Payment History */}
        <section className="bg-white p-6 shadow-lg rounded-xl">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-700"><FaMoneyBillWave /> Payment History</h2>
          <div className="mt-4 space-y-3">
            {payments.map((payment) => (
              <div key={payment.id} className="p-3 border rounded-lg shadow-sm">
                <p className="font-medium text-gray-700">Amount: ${payment.amount}</p>
                <p className="text-sm text-gray-500">Date: {payment.date} | Method: {payment.method}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Notifications */}
      <section className="mt-6 bg-white p-6 shadow-lg rounded-xl">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-700"><FaBell /> Notifications & Alerts</h2>
        <div className="mt-4 p-3 border rounded-lg shadow-sm text-gray-500">No new notifications</div>
      </section>

      {/* Insurance Policies Carousel */}
      <div className="mt-10">
        <h1 className="text-3xl font-bold text-center">Your Insurance Policies</h1>
        <PolicyCarousel />
      </div>
    </div>
  );
}
