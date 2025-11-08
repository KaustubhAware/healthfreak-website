'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function SymptomForm() {
  const [notes, setNotes] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const router = useRouter();

  const fetchSuggestions = async () => {
    if (!notes.trim()) return alert("Enter symptoms first");
    try {
      const res = await axios.post("/api/suggest-doctor", { notes });
      setSuggestions(res.data.content);
    } catch (err: any) {
      console.error("Error fetching doctor suggestions:", err);
    }
  };

  const handleSubmit = async () => {
    if (!selectedDoctor) return alert("Please select a doctor");
    try {
      const sessionRes = await axios.post("/api/sessions", {
        notes,
        doctor: selectedDoctor
      });
      router.push(`/dashboard/medical-agent/${sessionRes.data.id}`);
    } catch (err: any) {
      console.error("Error creating session:", err);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Enter Your Symptoms</h1>
      <textarea
        className="w-full border p-2 rounded mb-2"
        value={notes}
        onChange={e => setNotes(e.target.value)}
        placeholder="Describe your symptoms..."
      />
      <button
        onClick={fetchSuggestions}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mb-4"
      >
        Get Doctor Suggestions
      </button>

      {suggestions.length > 0 && (
        <div className="mb-4 space-y-2">
          {suggestions.map((doc, idx) => (
            <div key={idx} className="border p-3 rounded hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                 onClick={() => setSelectedDoctor(doc)}>
              <input type="radio" name="doctor" checked={selectedDoctor?.specialist === doc.specialist} readOnly />
              <div>
                <p className="font-semibold">{doc.specialist}</p>
                <p className="text-sm text-gray-600">{doc.reason}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Start Consultation
      </button>
    </div>
  );
}
