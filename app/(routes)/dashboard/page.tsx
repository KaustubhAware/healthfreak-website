"use client";

import React from "react";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import AddNewSessionDialog from "@/app/_components/AddNewSessionDialog";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  const doctors = [
    {
      name: "Dr. AI Ortho",
      specialty: "Orthopedic Specialist",
      description: "AI-powered insights for bone and joint health.",
    },
    {
      name: "Dr. AI Cardio",
      specialty: "Cardiology Specialist",
      description: "Advanced AI for heart health monitoring.",
    },
    {
      name: "Dr. AI Derma",
      specialty: "Dermatology Specialist",
      description: "AI-driven analysis for skin conditions.",
    },
  ];

  const features = [
    {
      name: "Health Tracker",
      image: "/health-tracker.png",
      href: "/dashboard/health-tracker",
      color: "bg-blue-500",
    },
    {
      name: "SOS Alert",
      image: "/sos.png",
      href: "/dashboard/emergency/sos",
      color: "bg-red-500",
    },
    {
      name: "Hospitals",
      image: "/hospital.png",
      href: "/dashboard/emergency/hospitals",
      color: "bg-indigo-500",
    },
    {
      name: "First Aid",
      image: "/firstaid.png",
      href: "/dashboard/emergency/firstaid",
      color: "bg-green-500",
    },
    {
      name: "Ambulance",
      image: "/ambulance.png",
      href: "/dashboard/emergency/ambulance",
      color: "bg-pink-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* ✅ Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex justify-between items-center p-4 md:px-8">
          {/* Left: Logo */}
          <div className="flex items-center gap-2">
            <Image src="/logo.svg" alt="HealthFreak" width={35} height={35} />
            <h1 className="font-extrabold text-xl text-blue-700 tracking-tight">
              HealthFreak
            </h1>
          </div>

          {/* Middle: Links */}
          <nav className="hidden md:flex gap-8 text-gray-700 font-medium">
            <Link href="/dashboard" className="hover:text-blue-600 transition">
              Dashboard
            </Link>
            <Link href="/consultations" className="hover:text-blue-600 transition">
              Consultations
            </Link>
            <Link href="/settings" className="hover:text-blue-600 transition">
              Settings
            </Link>
          </nav>

          {/* Right: Profile */}
          <div className="flex items-center gap-3">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      {/* ✅ Main Body */}
      <main className="flex-1 max-w-7xl mx-auto p-6 space-y-12">
        {/* Hero Section */}
        <div className="bg-white border border-gray-200 rounded-3xl shadow-lg p-10 text-center text-gray-800 transition-all hover:shadow-xl">
          <div className="flex justify-center mb-6">
            <Image
              src="/ai-doctor.svg"
              alt="AI Doctor"
              width={230}
              height={180}
              className="animate-float"
            />
          </div>

          <h2 className="text-4xl font-extrabold mb-3 text-blue-700">
            Your AI Medical Voice Agent
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg">
            Instant health insights powered by AI — speak, ask, and get guidance
            anytime with our intelligent medical assistant.
          </p>

          <div className="flex justify-center">
            <AddNewSessionDialog />
          </div>
        </div>

        {/* Quick Access */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-blue-800">
            Quick Access
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {features.map((feature, idx) => (
              <Link key={idx} href={feature.href}>
                <div
                  className={`rounded-2xl shadow-md p-6 text-center text-white hover:scale-105 transition-transform ${feature.color}`}
                >
                  <h3 className="font-semibold text-lg">{feature.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Doctors Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-blue-800">
            AI Specialist Doctors
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {doctors.map((doc, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition-all border border-gray-100"
              >
                <div className="w-16 h-16 bg-blue-50 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">🩺</span>
                </div>
                <h3 className="font-bold text-gray-800 text-lg">{doc.name}</h3>
                <p className="text-gray-500 text-sm mb-2">{doc.specialty}</p>
                <p className="text-gray-600 text-sm mb-4">{doc.description}</p>
                <button className="bg-blue-50 text-blue-700 px-4 py-1 rounded-full font-medium hover:bg-blue-100 text-sm transition">
                  View Profile
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Consultations Section */}
        <section className="bg-white rounded-2xl shadow-md p-8 text-center border border-gray-100">
          <h2 className="font-bold text-xl mb-2 text-blue-800">
            No Recent Consultations
          </h2>
          <p className="text-gray-600 text-sm">
            Start a new consultation with our AI doctors anytime.
          </p>
        </section>
      </main>
    </div>
  );
}
