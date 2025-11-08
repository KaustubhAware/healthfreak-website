"use client";

import React, { useState, useEffect } from "react";
import { UserButton } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { MapPin, PhoneCall, AlertTriangle } from "lucide-react";

export default function AmbulancePage() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [reason, setReason] = useState("");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [status, setStatus] = useState("");
  const [isSent, setIsSent] = useState(false);

  // 📍 Get user location
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setStatus("Unable to get your location. Please enable GPS.")
    );
  }, []);

  // 🚑 Handle request
  const handleRequest = async () => {
    if (!name || !contact || !reason) {
      setStatus("Please fill all required fields.");
      return;
    }
    if (!location) {
      setStatus("Location not detected yet. Please allow GPS.");
      return;
    }

    setIsSent(true);
    setStatus("Sending ambulance request...");

    try {
      const res = await fetch("/api/ambulance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          contact,
          reason,
          latitude: location.lat,
          longitude: location.lng,
        }),
      });

      if (res.ok) {
        setStatus(
          `Ambulance request sent successfully!
Name: ${name}
Contact: ${contact}
Reason: ${reason}
Location: (${location.lat.toFixed(5)}, ${location.lng.toFixed(5)})`
        );
        setName("");
        setContact("");
        setReason("");
      } else {
        setStatus("Failed to send request. Try again later.");
      }
    } catch {
      setStatus("Network error! Could not send request.");
    }

    setTimeout(() => setIsSent(false), 4000);
  };

  const inputClass = (val: string) =>
    `w-full p-3 rounded-xl border transition outline-none ${
      !val ? "border-red-300 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"
    } focus:ring-2`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6 flex flex-col">
      {/* Header */}
      <nav className="flex justify-between items-center bg-white p-4 rounded-b-2xl shadow mb-8 border-b border-blue-100">
        <h1 className="text-2xl font-bold text-blue-800 flex items-center gap-2">
          <AlertTriangle className="text-red-500 w-6 h-6" />
          Emergency Ambulance Service
        </h1>
        <UserButton afterSignOutUrl="/" />
      </nav>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8 border border-blue-100"
      >
        <div className="text-center mb-6">
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="inline-block text-5xl text-red-600 mb-2"
          >
            🚨
          </motion.div>
          <h2 className="text-2xl font-bold text-blue-800">Request an Ambulance</h2>
          <p className="text-gray-600 text-sm mt-2">
            Fill in your details and allow location access for quick emergency response.
          </p>
        </div>

        {/* Form Inputs */}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass(name)}
          />
          <input
            type="tel"
            placeholder="Contact Number"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className={inputClass(contact)}
          />
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className={inputClass(reason)}
          >
            <option value="">Select Emergency Type</option>
            <option value="Accident">Road Accident</option>
            <option value="Heart Issue">Heart Issue</option>
            <option value="Stroke">Stroke</option>
            <option value="Injury">Severe Injury</option>
            <option value="Pregnancy">Pregnancy Emergency</option>
            <option value="Other">Other</option>
          </select>

          {/* Location Status */}
          <div
            className={`p-4 rounded-xl flex items-center gap-3 ${
              location
                ? "bg-green-50 border border-green-300"
                : "bg-yellow-50 border border-yellow-300 animate-pulse"
            }`}
          >
            <MapPin
              className={`w-6 h-6 ${
                location ? "text-green-600" : "text-yellow-600"
              }`}
            />
            {location ? (
              <span className="text-sm text-gray-700">
                Location Detected ✅ <br />
                <span className="text-gray-500">
                  Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}
                </span>
              </span>
            ) : (
              <span className="text-sm text-gray-600">Detecting your location...</span>
            )}
          </div>
        </div>

        {/* Request Button */}
        <motion.button
          onClick={handleRequest}
          whileTap={{ scale: 0.95 }}
          disabled={isSent}
          className={`w-full mt-6 py-3 text-lg font-semibold rounded-xl transition ${
            isSent
              ? "bg-green-600 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          }`}
        >
          {isSent ? "✅ Request Sent!" : "Request Ambulance"}
        </motion.button>

        {/* Status Message */}
        {status && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 bg-gray-50 p-4 rounded-xl text-gray-700 whitespace-pre-wrap text-sm border border-gray-200"
          >
            {status}
          </motion.div>
        )}
      </motion.div>

      {/* Quick Call Section */}
      <div className="text-center mt-10 text-gray-700">
        <p>Need immediate help? Call directly:</p>
        <a
          href="tel:108"
          className="inline-flex items-center gap-2 mt-2 text-lg text-blue-700 font-semibold hover:text-blue-800"
        >
          <PhoneCall className="w-5 h-5 text-red-500" /> 108 - Emergency Number
        </a>
      </div>
    </div>
  );
}
