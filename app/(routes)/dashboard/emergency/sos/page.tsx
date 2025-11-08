"use client";

import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { motion, AnimatePresence } from "framer-motion";
import { UserButton, useUser } from "@clerk/nextjs";
import {
  AlertTriangle,
  MapPin,
  Send,
  X,
  Stethoscope,
  ShieldAlert,
  Bell,
} from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// ✅ Custom Leaflet Marker Fix
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function SOSPage() {
  const { user } = useUser();
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [emergencyType, setEmergencyType] = useState("Medical");
  const [showConfirm, setShowConfirm] = useState(false);

  // ✅ Get current location
  const getLocation = () => {
    if (!navigator.geolocation) {
      setStatus("Geolocation is not supported by your browser.");
      return;
    }
    setStatus("Locating...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setStatus("Location detected!");
      },
      () => {
        setStatus("Unable to retrieve your location.");
      }
    );
  };

  // ✅ Send SOS alert
  const sendAlert = async () => {
    setShowConfirm(false);
    if (!location) {
      setStatus("Please get your location first.");
      return;
    }
    if (!user?.emailAddresses?.[0]?.emailAddress) {
      setStatus("Please sign in to send an alert.");
      return;
    }

    setLoading(true);
    setStatus("Sending alert...");

    try {
      const res = await fetch("/api/sos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: user.emailAddresses[0].emailAddress,
          emergencyType,
          latitude: location.lat.toString(),
          longitude: location.lng.toString(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus("Alert sent successfully!");
      } else {
        setStatus(data.error || "Something went wrong.");
      }
    } catch (error) {
      console.error(error);
      setStatus("Failed to send alert.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-between items-center bg-white/90 backdrop-blur-md p-4 shadow-md">
        <span className="text-2xl font-bold text-blue-700 tracking-wide">
          HealthFreak SOS
        </span>
        <UserButton afterSignOutUrl="/" />
      </nav>

      {/* Main Section */}
      <motion.div
        className="flex-1 flex items-center justify-center px-4 py-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center border border-blue-100">
          <h1 className="text-3xl font-extrabold mb-3 text-blue-600 flex justify-center items-center gap-2">
            <AlertTriangle className="w-7 h-7" /> SOS Emergency
          </h1>
          <p className="text-gray-600 mb-6">
            Instantly share your live location with emergency responders.
          </p>

          {/* Emergency Type Dropdown */}
          <div className="mb-6 relative">
            <select
              value={emergencyType}
              onChange={(e) => setEmergencyType(e.target.value)}
              className="border border-gray-300 rounded-lg p-3 w-full text-gray-700 focus:ring-2 focus:ring-blue-400 appearance-none"
            >
              <option value="Medical">Medical Emergency</option>
              <option value="Fire">Fire</option>
              <option value="Accident">Accident</option>
              <option value="Crime">Crime</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={getLocation}
              className="flex items-center justify-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition w-full shadow-md font-semibold"
            >
              <MapPin className="w-5 h-5" /> Get My Location
            </button>

            <button
              onClick={() => setShowConfirm(true)}
              disabled={loading}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl w-full font-semibold shadow-md transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-700 hover:bg-blue-800 text-white"
              }`}
            >
              <Send className="w-5 h-5" />
              {loading ? "Sending..." : "Send Alert"}
            </button>
          </div>

          {/* Status */}
          {status && (
            <motion.p
              className="mt-6 text-gray-800 font-medium text-sm bg-blue-50 p-3 rounded-lg border border-blue-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {status}
            </motion.p>
          )}

          {/* Map */}
          {location && (
            <motion.div
              className="mt-6 rounded-xl overflow-hidden border border-gray-200 shadow-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <MapContainer
                center={[location.lat, location.lng]}
                zoom={15}
                scrollWheelZoom={false}
                style={{ height: "250px", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[location.lat, location.lng]} icon={markerIcon}>
                  <Popup>Your Current Location</Popup>
                </Marker>
              </MapContainer>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Confirm Modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full text-center border border-blue-100"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h2 className="text-xl font-bold text-blue-600 mb-2">
                Confirm SOS Alert
              </h2>
              <p className="text-gray-700 mb-6">
                Are you sure you want to send a <b>{emergencyType}</b> alert?
              </p>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition font-semibold flex items-center gap-2"
                >
                  <X className="w-4 h-4" /> Cancel
                </button>
                <button
                  onClick={sendAlert}
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition font-semibold flex items-center gap-2"
                >
                  <Send className="w-4 h-4" /> Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
