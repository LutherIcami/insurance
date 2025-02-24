import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { FaHome, FaSignOutAlt } from "react-icons/fa"; // Importing icons

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="p-4 bg-gray-800 text-white flex justify-between items-center">
      {/* Home Link with Icon */}
      <Link href="/" className="flex items-center gap-2">
        <FaHome /> Home
      </Link>

      {/* Authenticated User Links */}
      {session ? (
        <div className="flex items-center gap-4">
          {session.user.role === "admin" && <Link href="/admin">Admin</Link>}
          <Link href="/user">Dashboard</Link>

          {/* Logout Button with Icon */}
          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 bg-red-500 px-3 py-2 rounded-md hover:bg-red-600 transition"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      ) : (
        // Unauthenticated Links
        <div className="flex items-center gap-4">
          <Link href="/auth/login">Login</Link>
          <Link href="/auth/signup">Sign Up</Link>
        </div>
      )}
    </nav>
  );
}
