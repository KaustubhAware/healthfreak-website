"use client";

import React, { useState, useEffect } from "react";
import { UserButton } from "@clerk/nextjs";
import { motion } from "framer-motion";
import {
  HeartPulse,
  Stethoscope,
  ShieldCheck,
  Phone,
  Flame,
  Activity,
  Apple,
  Moon,
  Droplet,
  Footprints,
  PhoneCall,
} from "lucide-react";

const firstAidData = [
  {
    name: "Cut or Scratch",
    icon: <ShieldCheck className="w-5 h-5 mr-2" />,
    instructions:
      "Rinse the wound gently under clean running water. Apply antiseptic solution and cover with a sterile bandage. Watch for signs of infection.",
  },
  {
    name: "Burn",
    icon: <HeartPulse className="w-5 h-5 mr-2" />,
    instructions:
      "Cool the burn with running water for 10–20 minutes. Do not use ice. Apply burn ointment and loosely cover with a sterile gauze.",
  },
  {
    name: "Headache",
    icon: <Stethoscope className="w-5 h-5 mr-2" />,
    instructions:
      "Rest in a quiet, dark room. Drink water and use pain relief medicine if needed. Avoid screen exposure or loud noise.",
  },
  {
    name: "Sprain",
    icon: <ShieldCheck className="w-5 h-5 mr-2" />,
    instructions:
      "Use the R.I.C.E method – Rest, Ice, Compress, and Elevate. Avoid putting weight on the injured area until it feels better.",
  },
  {
    name: "Nosebleed",
    icon: <HeartPulse className="w-5 h-5 mr-2" />,
    instructions:
      "Sit upright, lean slightly forward, and pinch your nose for 10–15 minutes. Avoid tilting your head back.",
  },
];

const dailyTips = [
  { icon: <Droplet className="w-4 h-4 mr-2 text-green-700" />, text: "Stay hydrated — drink at least 2–3 liters of water daily." },
  { icon: <Apple className="w-4 h-4 mr-2 text-green-700" />, text: "Eat fruits and vegetables for vitamins and fiber." },
  { icon: <Footprints className="w-4 h-4 mr-2 text-green-700" />, text: "Walk at least 30 minutes a day to stay active." },
  { icon: <Activity className="w-4 h-4 mr-2 text-green-700" />, text: "Take breaks and stretch when using a computer for long hours." },
  { icon: <Moon className="w-4 h-4 mr-2 text-green-700" />, text: "Sleep 7–8 hours every night for better recovery." },
];

export default function FirstAidPage() {
  const [selected, setSelected] = useState(firstAidData[0]);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % dailyTips.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-between items-center bg-white/80 backdrop-blur-md p-4 shadow-sm border-b border-gray-200">
        <span className="text-2xl font-extrabold text-green-700">
          HealthFreak • First Aid
        </span>
        <UserButton afterSignOutUrl="/" />
      </nav>

      {/* Daily Tip */}
      <div className="text-center mt-6">
        <motion.div
          key={tipIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium shadow-sm"
        >
          {dailyTips[tipIndex].icon}
          {dailyTips[tipIndex].text}
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl w-full bg-white rounded-2xl shadow-lg p-8"
        >
          <h1 className="text-3xl font-extrabold mb-4 text-green-700 text-center">
            First Aid Assistant
          </h1>
          <p className="text-gray-600 mb-8 text-center">
            Choose a condition below to view step-by-step first aid help.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {firstAidData.map((item, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelected(item)}
                className={`flex items-center px-4 py-2 rounded-xl font-medium transition-all ${
                  selected.name === item.name
                    ? "bg-green-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-800 hover:bg-green-200"
                }`}
              >
                {item.icon}
                {item.name}
              </motion.button>
            ))}
          </div>

          {/* Instructions */}
          <motion.div
            key={selected.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-green-50 p-6 rounded-xl shadow-inner text-gray-800 text-center"
          >
            <h2 className="text-xl font-bold text-green-700 mb-3 flex justify-center items-center">
              <ShieldCheck className="w-5 h-5 mr-2" />
              {selected.name}
            </h2>
            <p className="leading-relaxed">{selected.instructions}</p>
          </motion.div>

          {/* Emergency Contacts */}
          <div className="mt-10 text-center">
            <h3 className="text-lg font-semibold text-green-700 mb-3 flex justify-center items-center">
              <Phone className="w-5 h-5 mr-2 text-green-700" /> Emergency Contacts
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="tel:108"
                className="flex items-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                <PhoneCall className="w-4 h-4 mr-2" /> Ambulance
              </a>
              <a
                href="tel:100"
                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                <ShieldCheck className="w-4 h-4 mr-2" /> Police
              </a>
              <a
                href="tel:101"
                className="flex items-center bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
              >
                <Flame className="w-4 h-4 mr-2" /> Fire
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="text-center text-gray-500 py-4 text-sm border-t border-gray-200">
        © {new Date().getFullYear()} HealthFreak | Stay Safe & Healthy
      </footer>
    </div>
  );
}
