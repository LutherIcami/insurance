import Link from "next/link";

export default function AdminSidebar() {
  return (
    <div className="w-64 bg-gray-900 text-white h-screen p-4">
      <h2 className="text-xl font-bold">Admin Panel</h2>
      <ul className="mt-4 space-y-2">
        <li><Link href="/admindashboard">Dashboard</Link></li>
        <li><Link href="/admin/users">Users</Link></li>
        <li><Link href="/admin/policies">Policies</Link></li>
        <li><Link href="/admin/claims">Claims</Link></li>
      </ul>
    </div>
  );
}
