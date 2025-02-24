import { useState, useEffect, JSX } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FaHeartbeat, FaCar, FaHome, FaUserShield, FaUmbrella, FaMoneyBillWave, FaUsers, FaPlusCircle, FaBriefcaseMedical, FaPiggyBank } from "react-icons/fa";
import React from "react"

interface Policy {
  id: number;
  policyName: string;
  coverage: string;
  premium: number;
  status: string;
  icon: JSX.Element;
}

// ✅ Updated Policies with Icons
const policies: Policy[] = [
  { id: 1, policyName: "Health Insurance", coverage: "Full Coverage", premium: 120.5, status: "Active", icon: <FaHeartbeat size={40} className="text-red-500" /> },
  { id: 2, policyName: "Car Insurance", coverage: "Collision & Liability", premium: 95, status: "Active", icon: <FaCar size={40} className="text-blue-500" /> },
  { id: 3, policyName: "Home Insurance", coverage: "Fire & Theft", premium: 200, status: "Expired", icon: <FaHome size={40} className="text-yellow-500" /> },
  { id: 4, policyName: "Funeral Covers", coverage: "Family Funeral Cover", premium: 50, status: "Active", icon: <FaUmbrella size={40} className="text-gray-500" /> },
  { id: 5, policyName: "Enjoy your Retirement", coverage: "Retirement Pension Plan", premium: 180, status: "Active", icon: <FaMoneyBillWave size={40} className="text-green-500" /> },
  { id: 6, policyName: "Investment Linked", coverage: "Market-Linked Returns", premium: 250, status: "Active", icon: <FaPiggyBank size={40} className="text-purple-500" /> },
  { id: 7, policyName: "Family Protection Plans", coverage: "Family Income Protection", premium: 90, status: "Active", icon: <FaUsers size={40} className="text-indigo-500" /> },
  { id: 8, policyName: "Personal Accident Covers", coverage: "Accidental Injury Protection", premium: 70, status: "Active", icon: <FaUserShield size={40} className="text-orange-500" /> },
  { id: 9, policyName: "Health Insurance Covers", coverage: "Comprehensive Health Plan", premium: 130, status: "Active", icon: <FaBriefcaseMedical size={40} className="text-teal-500" /> },
  { id: 10, policyName: "Unit Trust Funds", coverage: "Investment Growth", premium: 300, status: "Active", icon: <FaPlusCircle size={40} className="text-pink-500" /> },
];

export default function PolicyCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % policies.length);
    }, 4000); // Auto-slide every 4 seconds

    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => {
    setIndex((prev) => (prev === 0 ? policies.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % policies.length);
  };

  return (
    <div className="relative w-full max-w-lg mx-auto mt-8">
      {/* 🔹 Title */}
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">Your Insurance Policies</h1>

      <AnimatePresence mode="wait">
        <motion.div
          key={policies[index].id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.6 }}
          className="bg-white p-8 shadow-xl rounded-3xl flex flex-col items-center text-center border border-gray-300"
        >
          {/* ✅ Policy Icon */}
          <div className="mb-4">{policies[index].icon}</div>

          <h2 className="text-2xl font-bold text-blue-700 mb-4">{policies[index].policyName}</h2>
          <p className="text-gray-600 text-lg font-medium">Coverage: {policies[index].coverage}</p>
          <p className="text-2xl font-bold text-gray-800 mt-3">${policies[index].premium} / month</p>
          <p
            className={`mt-4 px-6 py-2 rounded-full text-lg font-semibold shadow-md
              ${policies[index].status === "Active" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
          >
            {policies[index].status}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-blue-700 hover:bg-blue-800 text-white p-4 rounded-full shadow-lg transition-all duration-200"
      >
        <FaChevronLeft size={24} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-blue-700 hover:bg-blue-800 text-white p-4 rounded-full shadow-lg transition-all duration-200"
      >
        <FaChevronRight size={24} />
      </button>
    </div>
  );
}
