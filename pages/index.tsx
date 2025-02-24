import Link from "next/link";
import { useSession, signOut } from "next-auth/react"; // ✅ Import signOut
import { motion } from "framer-motion";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }}
        className="text-4xl font-bold mb-4"
      >
        Welcome to the Insurance System
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.3, duration: 0.8 }}
        className="mb-6 text-lg"
      >
        Secure and reliable insurance management for all users.
      </motion.p>

      {!session ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ delay: 0.5, duration: 0.5 }}
          className="space-x-4"
        >
          <Link href="/auth/login">
            <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl shadow-lg hover:scale-105 transition transform duration-200">
              Login
            </button>
          </Link>
          <Link href="/auth/signup">
            <button className="px-6 py-3 bg-white-500 text-blue font-semibold rounded-xl shadow-lg hover:scale-105 transition transform duration-200">
              Sign Up
            </button>
          </Link>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ delay: 0.5, duration: 0.5 }}
          className="space-x-4"
        >
          {session?.user?.role === "admin" ? (
            <Link href="/admindashboard">
              <button className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition transform duration-200">
                Go to Admin Dashboard
              </button>
            </Link>
          ) : (
            <Link href="/dashboard">
              <button className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition transform duration-200">
                Go to User Dashboard
              </button>
            </Link>
          )}

          {/* ✅ Logout button that redirects to login */}
          <button
            onClick={() => signOut({ callbackUrl: "/auth/login" })} 
            className="px-6 py-3 bg-red-500 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition transform duration-200"
          >
            Logout
          </button>
        </motion.div>
      )}
    </div>
  );
}
