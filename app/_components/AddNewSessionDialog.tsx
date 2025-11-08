"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { ArrowRight, Loader2 } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

function AddNewSessionDialog() {
  const [note, setNote] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [suggestedDoctors, setSuggestedDoctors] = useState<any[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<number | null>(null);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const router = useRouter();

  const OnClickNext = async () => {
    if (!note) return;
    setLoading(true);
    setError("");
    try {
      const result = await axios.post("/api/suggest-doctor", { notes: note });
      setSuggestedDoctors(result.data?.content ?? []);
      setStep(2);
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          "Failed to get doctor suggestions. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const startConversation = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/sessions", {
        notes: note,
        suggestedDoctors,
        selectedAgentId,
      });
      router.push(`/dashboard/medical-agent/${response.data.sessionId}`);
      setSuccess("Session created successfully!");
      setTimeout(() => resetDialog(), 2000);
    } catch {
      setError("Failed to start conversation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetDialog = () => {
    setStep(1);
    setNote("");
    setSuggestedDoctors([]);
    setSelectedAgentId(null);
    setError("");
    setSuccess("");
    setLoading(false);
  };

  return (
    <Dialog>
      <DialogTrigger className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 hover:scale-105 transition-transform shadow-md">
        Consult a Doctor
      </DialogTrigger>

     <DialogContent className="rounded-2xl p-6 bg-white shadow-xl border border-gray-100">

        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-700">
            {step === 1 ? "Add Basic Details" : "Start New Conversation"}
          </DialogTitle>
          <DialogDescription asChild>
            {step === 1 ? (
              <div>
                <p className="text-gray-600 mb-2">
                  Please provide some basic information about your symptoms.
                </p>
                <Textarea
                  placeholder="Describe your symptoms here..."
                  className="h-[200px] mt-2 border-blue-100 focus:border-blue-400"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  disabled={loading}
                />
                {error && (
                  <div className="text-red-500 text-sm mt-2 p-2 bg-red-50 rounded-lg">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="text-green-600 text-sm mt-2 p-2 bg-green-50 rounded-lg">
                    {success}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <p className="text-gray-600 mb-4">
                  Select a doctor to start your AI consultation:
                </p>
                {suggestedDoctors.length > 0 ? (
                  <div className="space-y-3">
                    {suggestedDoctors.map((doc, idx) => (
                      <div
                        key={idx}
                        className={`p-3 border rounded-xl cursor-pointer transition-all ${
                          selectedAgentId === idx + 1
                            ? "bg-blue-50 border-blue-300"
                            : "bg-gray-50 hover:bg-gray-100"
                        }`}
                        onClick={() => setSelectedAgentId(idx + 1)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-gray-900">
                              {doc.specialist}
                            </div>
                            <div className="text-sm text-gray-600">
                              {doc.reason}
                            </div>
                          </div>
                          <div
                            className={`w-4 h-4 rounded-full border-2 ${
                              selectedAgentId === idx + 1
                                ? "bg-blue-600 border-blue-600"
                                : "border-gray-300"
                            }`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 mt-2">No doctors suggested.</p>
                )}
              </div>
            )}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-end gap-3">
          <DialogClose
            className="px-4 py-2 border rounded-lg hover:bg-gray-100 text-gray-700 font-medium"
            onClick={resetDialog}
          >
            Cancel
          </DialogClose>

          {step === 1 ? (
            <Button
              onClick={OnClickNext}
              disabled={!note || loading}
              className="bg-blue-600 text-white rounded-lg px-5 hover:bg-blue-700"
            >
              {loading && <Loader2 className="animate-spin mr-2 inline-block" />}
              Next <ArrowRight className="ml-1" />
            </Button>
          ) : (
            <Button
              onClick={startConversation}
              disabled={loading || !selectedAgentId}
              className="bg-blue-600 text-white rounded-lg px-5 hover:bg-blue-700"
            >
              {loading && <Loader2 className="animate-spin mr-2 inline-block" />}
              Start Conversation
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddNewSessionDialog;
