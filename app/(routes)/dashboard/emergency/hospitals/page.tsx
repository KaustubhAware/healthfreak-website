"use client";

import React, { useEffect, useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { GoogleMap, Marker, InfoWindow, useLoadScript } from "@react-google-maps/api";

const containerStyle = { width: "100%", height: "500px" };

export default function HospitalsPage() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY",
    libraries: ["places"],
  });

  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [status, setStatus] = useState("Detecting your location...");
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);

  // Get current location
  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus("Geolocation not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setLocation(loc);
        setStatus("Fetching nearby hospitals...");
        fetchNearbyHospitals(loc);
      },
      () => setStatus("Unable to retrieve your location.")
    );
  }, []);

  // Fetch hospitals using Google Places API
  const fetchNearbyHospitals = (loc: { lat: number; lng: number }) => {
    const service = new google.maps.places.PlacesService(document.createElement("div"));
    service.nearbySearch(
      { location: loc, radius: 3000, type: "hospital" },
      (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          setHospitals(results || []);
          setStatus("");
        } else {
          setStatus("No hospitals found nearby.");
        }
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Navbar */}
      <nav className="flex justify-between items-center bg-white p-4 rounded-b shadow mb-6">
        <span className="text-xl font-bold text-gray-900">HealthFreak - Hospitals</span>
        <UserButton afterSignOutUrl="/" />
      </nav>

      {/* Content */}
      <div className="max-w-5xl mx-auto bg-white rounded shadow p-6">
        <h1 className="text-2xl font-bold mb-4 text-blue-600 text-center">
          Nearest Hospitals
        </h1>
        {status && <p className="text-center text-gray-600 mb-4">{status}</p>}

        {isLoaded && location && (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={location}
            zoom={14}
          >
            {/* User Marker */}
            <Marker position={location} icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png" />

            {/* Hospitals */}
            {hospitals.map((place, i) => (
              <Marker
                key={i}
                position={{
                  lat: place.geometry.location.lat(),
                  lng: place.geometry.location.lng(),
                }}
                icon={
                  place.opening_hours?.open_now
                    ? "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
                    : "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                }
                onClick={() => setSelected(place)}
              />
            ))}

            {/* Info Window */}
            {selected && (
              <InfoWindow
                position={{
                  lat: selected.geometry.location.lat(),
                  lng: selected.geometry.location.lng(),
                }}
                onCloseClick={() => setSelected(null)}
              >
                <div>
                  <h2 className="font-semibold">{selected.name}</h2>
                  <p>{selected.vicinity}</p>
                  {selected.rating && <p>⭐ {selected.rating}</p>}
                  {selected.opening_hours && (
                    <p>
                      {selected.opening_hours.open_now
                        ? "🟢 Open Now"
                        : "🔴 Closed"}
                    </p>
                  )}
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        )}
      </div>
    </div>
  );
}
