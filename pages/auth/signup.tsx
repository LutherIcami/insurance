import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import { motion } from "framer-motion";

type SignupFormValues = {
  name: string;
  email: string;
  password: string;
};

export default function Signup() {
  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormValues>();
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: SignupFormValues) => {
    setErrorMessage("");
    setLoading(true);

    try {
      const response = await axios.post("/api/auth/signup", data);
      if (response.status === 201) {
        router.push("/auth/login"); // Redirect to login after successful signup
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        setErrorMessage(error.response.data?.message || "Signup failed");
      } else {
        setErrorMessage("An unexpected error occurred");
      }
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-700">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl transform hover:scale-105 transition-all"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Sign Up</h2>

        {errorMessage && (
          <motion.p 
            initial={{ x: -10 }}
            animate={{ x: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="text-red-500 text-sm mb-4 text-center"
          >
            {errorMessage}
          </motion.p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input 
              type="text" 
              {...register("name", { required: "Name is required" })} 
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              {...register("email", { required: "Email is required" })} 
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              {...register("password", { required: "Password is required", minLength: 6 })} 
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <motion.button
            type="submit"
            whileTap={{ scale: 0.95 }}
            className={`w-full bg-blue-500 text-white p-2 rounded-lg font-semibold transition-all duration-300 ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
            }`}
            disabled={loading}
          >
            {loading ? (
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ repeat: Infinity, duration: 1 }} 
                className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full "
              ></motion.div>
            ) : (
              "Sign Up"
            )}
          </motion.button>
        </form>

        <p className="text-sm mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-blue-500 hover:underline transition duration-300">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
