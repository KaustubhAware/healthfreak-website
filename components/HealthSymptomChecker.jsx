"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Stethoscope } from "lucide-react";

export default function HealthSymptomChecker() {
  const [symptom, setSymptom] = useState("");
  const [advice, setAdvice] = useState("");

  const checkSymptoms = () => {
    const lower = symptom.toLowerCase();
    let result = "Please provide more details for accurate advice.";

    if (lower.includes("fever") || lower.includes("cold")) {
      result = "You might have a viral infection or common cold. Stay hydrated and take rest.";
    } else if (lower.includes("headache")) {
      result = "Try to rest, drink water, and avoid screen time. If it persists, consult a doctor.";
    } else if (lower.includes("cough") || lower.includes("sore throat")) {
      result = "You might be experiencing throat irritation or flu symptoms. Consider warm fluids and rest.";
    } else if (lower.includes("stomach") || lower.includes("pain")) {
      result = "Could be indigestion or acidity. Try light food and hydration.";
    } else if (lower.includes("chest pain")) {
      result = "⚠️ Chest pain can be serious. Please seek medical attention immediately.";
    }

    setAdvice(result);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-2xl mx-auto my-10"
    >
      <Card className="p-6 shadow-lg border border-gray-200 rounded-2xl bg-white">
        <CardContent className="space-y-5">
          <div className="flex items-center gap-3">
            <Stethoscope className="text-blue-600" size={28} />
            <h2 className="text-xl font-semibold text-gray-800">Health Symptom Checker</h2>
          </div>

          <input
            type="text"
            placeholder="Describe your symptoms (e.g., headache, fever, cough)"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={symptom}
            onChange={(e) => setSymptom(e.target.value)}
          />

          <Button
            onClick={checkSymptoms}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Check Symptoms
          </Button>

          {advice && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-start gap-3 p-4 mt-4 bg-blue-50 rounded-xl"
            >
              <AlertCircle className="text-blue-500 mt-1" />
              <p className="text-gray-700">{advice}</p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
