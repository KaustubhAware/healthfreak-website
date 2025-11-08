"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

const features = [
  {
    name: "SOS Alert",
    description: "Quickly send your location to emergency contacts.",
    image: "/sos.png",
    href: "/dashboard/emergency/sos",
    color: "bg-red-500",
  },
  {
    name: "Nearest Hospitals",
    description: "Find hospitals and clinics near your location.",
    image: "/hospital.png",
    href: "/dashboard/emergency/hospitals",
    color: "bg-blue-500",
  },
  {
    name: "First Aid Assistant",
    description: "Get quick guidance for common emergencies.",
    image: "/firstaid.png",
    href: "/dashboard/emergency/firstaid",
    color: "bg-green-500",
  },
  {
    name: "Ambulance Request",
    description: "Request an ambulance and share your location.",
    image: "/ambulance.png",
    href: "/dashboard/emergency/ambulance",
    color: "bg-red-700",
  },
];

export default function EmergencyDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Navbar */}
      <nav className="flex justify-between items-center bg-white p-4 rounded-b shadow mb-6">
        <span className="text-xl font-bold text-gray-900">HealthFreak - Emergency Help</span>
        <UserButton afterSignOutUrl="/" />
      </nav>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, idx) => (
          <Link key={idx} href={feature.href} className="group">
            <div
              className={`rounded shadow p-6 text-center transition-transform transform hover:scale-105 ${feature.color} text-white`}
            >
              <div className="w-16 h-16 mx-auto mb-4">
                <Image src={feature.image} alt={feature.name} width={64} height={64} />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.name}</h3>
              <p className="text-white text-sm">{feature.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
