"use client";

import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { motion } from "framer-motion";
import { UserButton } from "@clerk/nextjs";
import { Plus, Activity, CalendarDays, TrendingUp } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

type HealthEntry = {
  date: string;
  bloodPressure: number;
  sugar: number;
  heartRate: number;
  weight: number;
};

export default function HealthTracker() {
  const [entries, setEntries] = useState<HealthEntry[]>([]);
  const [form, setForm] = useState({ bloodPressure: "", sugar: "", heartRate: "", weight: "" });

  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const formatted = data.map((item: any) => ({
            date: new Date(item.createdAt).toLocaleDateString(),
            bloodPressure: item.bloodPressure,
            sugar: item.sugar,
            heartRate: item.heartRate,
            weight: item.weight,
          }));
          setEntries(formatted);
        }
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const payload = {
      bloodPressure: Number(form.bloodPressure),
      sugar: Number(form.sugar),
      heartRate: Number(form.heartRate),
      weight: Number(form.weight),
    };

    const res = await fetch("/api/health", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (data.success) {
      const newEntry = {
        date: new Date().toLocaleDateString(),
        ...payload,
      };
      setEntries((prev) => [...prev, newEntry]);
      setForm({ bloodPressure: "", sugar: "", heartRate: "", weight: "" });
    }
  };

  const getInputFeedback = (field: string, value: string) => {
  const val = Number(value);
  if (!val) return { color: "border-gray-300", text: "" };

  switch (field) {
    // ---- BLOOD PRESSURE ----
    case "bloodPressure":
      if (val < 120) return { color: "border-green-400 bg-green-50", text: "Normal (Below 120 mmHg)" };
      if (val >= 120 && val <= 129)
        return { color: "border-yellow-400 bg-yellow-50", text: "Elevated (120–129 mmHg)" };
      if (val >= 130 && val <= 139)
        return { color: "border-orange-400 bg-orange-50", text: "Stage 1 Hypertension (130–139 mmHg)" };
      if (val >= 140)
        return { color: "border-red-400 bg-red-50", text: "Stage 2 Hypertension (≥140 mmHg)" };
      return { color: "border-gray-300", text: "" };

    // ---- BLOOD SUGAR ----
    case "sugar":
      if (val < 100) return { color: "border-green-400 bg-green-50", text: "Normal Fasting (<100 mg/dL)" };
      if (val >= 100 && val < 126)
        return { color: "border-yellow-400 bg-yellow-50", text: "Prediabetes (100–125 mg/dL)" };
      if (val >= 126)
        return { color: "border-red-400 bg-red-50", text: "Diabetes (≥126 mg/dL)" };
      return { color: "border-gray-300", text: "" };

    // ---- HEART RATE ----
    case "heartRate":
      if (val < 60)
        return { color: "border-yellow-400 bg-yellow-50", text: "Low Heart Rate (<60 bpm)" };
      if (val > 100)
        return { color: "border-red-400 bg-red-50", text: "High Heart Rate (>100 bpm)" };
      return { color: "border-green-400 bg-green-50", text: "Normal (60–100 bpm)" };

    // ---- WEIGHT (using BMI-like logic approx) ----
    case "weight":
      if (val < 45)
        return { color: "border-yellow-400 bg-yellow-50", text: "Underweight" };
      if (val >= 45 && val <= 75)
        return { color: "border-green-400 bg-green-50", text: "Healthy Weight" };
      if (val > 75 && val <= 90)
        return { color: "border-orange-400 bg-orange-50", text: "Overweight" };
      if (val > 90)
        return { color: "border-red-400 bg-red-50", text: "Obese" };
      return { color: "border-gray-300", text: "" };

    default:
      return { color: "border-gray-300", text: "" };
  }
};


  const chartData = {
    labels: entries.map((e) => e.date),
    datasets: [
      {
        label: "Blood Pressure",
        data: entries.map((e) => e.bloodPressure),
        borderColor: "#ef4444",
        backgroundColor: "rgba(239,68,68,0.2)",
        fill: true,
        tension: 0.3,
      },
      {
        label: "Sugar",
        data: entries.map((e) => e.sugar),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59,130,246,0.2)",
        fill: true,
        tension: 0.3,
      },
      {
        label: "Heart Rate",
        data: entries.map((e) => e.heartRate),
        borderColor: "#10b981",
        backgroundColor: "rgba(16,185,129,0.2)",
        fill: true,
        tension: 0.3,
      },
      {
        label: "Weight",
        data: entries.map((e) => e.weight),
        borderColor: "#f59e0b",
        backgroundColor: "rgba(245,158,11,0.2)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const latest = entries[entries.length - 1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 px-6 py-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-extrabold text-blue-800 tracking-tight flex items-center gap-3">
          <Activity className="w-8 h-8 text-blue-700" />
          Health Tracker Dashboard
        </h1>
        <UserButton afterSignOutUrl="/" />
      </div>

      {/* Input Form */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-8 mb-10 border border-blue-100"
      >
        <h2 className="text-xl font-bold mb-5 text-blue-700">Add New Record</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {["bloodPressure", "sugar", "heartRate", "weight"].map((field) => {
            const feedback = getInputFeedback(field, (form as any)[field]);
            return (
              <div key={field} className="flex flex-col">
                <input
                  type="number"
                  name={field}
                  value={(form as any)[field]}
                  onChange={handleChange}
                  placeholder={field.replace(/([A-Z])/g, " $1").trim()}
                  className={`p-3 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition ${feedback.color}`}
                />
                {feedback.text && (
                  <span
                    className={`text-xs mt-1 font-medium ${
                      feedback.text.includes("Normal")
                        ? "text-green-600"
                        : feedback.text.includes("High")
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {feedback.text}
                  </span>
                )}
              </div>
            );
          })}
        </div>
        <button
          onClick={handleSubmit}
          className="mt-6 bg-blue-600 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-blue-700 hover:scale-105 transition-transform shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Entry
        </button>
      </motion.div>

      {/* Summary Cards */}
      {latest && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {[
            { label: "Blood Pressure", value: latest.bloodPressure, unit: "mmHg", color: "bg-red-50 text-red-700" },
            { label: "Sugar", value: latest.sugar, unit: "mg/dL", color: "bg-blue-50 text-blue-700" },
            { label: "Heart Rate", value: latest.heartRate, unit: "BPM", color: "bg-green-50 text-green-700" },
            { label: "Weight", value: latest.weight, unit: "kg", color: "bg-yellow-50 text-yellow-700" },
          ].map((card, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className={`rounded-2xl p-6 shadow-sm border border-gray-100 ${card.color}`}
            >
              <p className="text-sm font-semibold">{card.label}</p>
              <p className="text-3xl font-extrabold mt-1">
                {card.value} <span className="text-base">{card.unit}</span>
              </p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Chart Section */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100">
        <h2 className="text-xl font-bold mb-4 text-blue-700 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Vitals Trends Over Time
        </h2>
        {entries.length === 0 ? (
          <p className="text-gray-500">No data yet — add your vitals to see progress.</p>
        ) : (
          <Line data={chartData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
        )}
      </div>

      {/* Data Table */}
      {entries.length > 0 && (
        <div className="mt-10 bg-white rounded-2xl shadow-lg p-8 border border-blue-100">
          <h2 className="text-xl font-bold mb-4 text-blue-700 flex items-center gap-2">
            <CalendarDays className="w-5 h-5" />
            Health Record History
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-blue-50">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Blood Pressure</th>
                  <th className="p-3">Sugar</th>
                  <th className="p-3">Heart Rate</th>
                  <th className="p-3">Weight</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e, i) => (
                  <tr key={i} className="border-b hover:bg-blue-50 transition">
                    <td className="p-3">{e.date}</td>
                    <td className="p-3">{e.bloodPressure}</td>
                    <td className="p-3">{e.sugar}</td>
                    <td className="p-3">{e.heartRate}</td>
                    <td className="p-3">{e.weight}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
