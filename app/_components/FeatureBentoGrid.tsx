import {
  BentoGrid,
  BentoGridItem,
} from "@/components/ui/bento-grid";
import {
  HeartPulse,
  CalendarCheck,
  Pill,
  Smile,
  FileText,
  Mic,
} from "lucide-react";

export function FeatureBentoGrid() {
  const primaryFrom = "#2FB6E0"; // Explore Now light blue
  const primaryTo = "#1997B8";   // Slightly darker variant for gradient depth

  return (
    <BentoGrid className="mx-auto max-w-6xl">
      <BentoGridItem
        title="AI Symptom Checker"
        description="Quickly assess possible health conditions based on patient symptoms."
        header={
          <div
            className="h-32 w-full rounded-xl"
            style={{
              background: `linear-gradient(to bottom right, ${primaryFrom}, ${primaryTo})`,
            }}
          />
        }
        icon={<HeartPulse className="h-6 w-6" style={{ color: primaryFrom }} />}
      />
      <BentoGridItem
        title="Automated Appointment Scheduling"
        description="Reduce no-shows and save time by letting AI handle bookings."
        header={
          <div
            className="h-32 w-full rounded-xl"
            style={{
              background: `linear-gradient(to bottom right, ${primaryFrom}, ${primaryTo})`,
            }}
          />
        }
        icon={<CalendarCheck className="h-6 w-6" style={{ color: primaryFrom }} />}
      />
      <BentoGridItem
        title="Smart Prescription Assistant"
        description="AI-powered prescription suggestions and dosage checks."
        header={
          <div
            className="h-32 w-full rounded-xl"
            style={{
              background: `linear-gradient(to bottom right, ${primaryFrom}, ${primaryTo})`,
            }}
          />
        }
        icon={<Pill className="h-6 w-6" style={{ color: primaryFrom }} />}
      />
      <BentoGridItem
        title="Patient Sentiment Analysis"
        description="Gauge patient satisfaction through voice and text analysis."
        header={
          <div
            className="h-32 w-full rounded-xl"
            style={{
              background: `linear-gradient(to bottom right, ${primaryFrom}, ${primaryTo})`,
            }}
          />
        }
        icon={<Smile className="h-6 w-6" style={{ color: primaryFrom }} />}
      />
      <BentoGridItem
        title="Medical Record Summarization"
        description="Summarize complex patient histories into easy-to-read overviews."
        header={
          <div
            className="h-32 w-full rounded-xl"
            style={{
              background: `linear-gradient(to bottom right, ${primaryFrom}, ${primaryTo})`,
            }}
          />
        }
        icon={<FileText className="h-6 w-6" style={{ color: primaryFrom }} />}
      />
      <BentoGridItem
        title="AI Voice Agent for Clinics"
        description="Answer patient queries and guide them through common processes."
        header={
          <div
            className="h-32 w-full rounded-xl"
            style={{
              background: `linear-gradient(to bottom right, ${primaryFrom}, ${primaryTo})`,
            }}
          />
        }
        icon={<Mic className="h-6 w-6" style={{ color: primaryFrom }} />}
      />
    </BentoGrid>
  );
}
