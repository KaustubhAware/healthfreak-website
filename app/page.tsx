"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { UserButton } from "@clerk/nextjs";
import { Stethoscope, HeartPulse, ShieldCheck, Activity } from "lucide-react";

const features = [
  {
    icon: <HeartPulse className="w-7 h-7 text-blue-600" />,
    title: "Real-Time Health Tracking",
    description:
      "Monitor your vitals, get AI-generated insights, and track your progress over time.",
  },
  {
    icon: <Stethoscope className="w-7 h-7 text-blue-600" />,
    title: "AI Consultations",
    description:
      "Speak naturally with our AI doctors and get personalized advice instantly.",
  },
  {
    icon: <Activity className="w-7 h-7 text-blue-600" />,
    title: "Smart Health Reports",
    description:
      "View intelligent summaries, visual graphs, and actionable recommendations.",
  },
  {
    icon: <ShieldCheck className="w-7 h-7 text-blue-600" />,
    title: "Emergency Ready",
    description:
      "Access SOS alerts, nearby hospitals, and first aid guidance in seconds.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[rgb(var(--background))] text-[rgb(var(--foreground))]">
      {/* 🌐 Navbar */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Image src="/logo.svg" alt="HealthFreak Logo" width={40} height={40} />
            <span className="text-2xl font-bold text-blue-700 tracking-tight">
              HealthFreak
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/" className="text-slate-700 hover:text-blue-600 transition">
              Home
            </Link>
            <Link href="/dashboard" className="text-slate-700 hover:text-blue-600 transition">
              Dashboard
            </Link>
            <Link
              href="/sign-in"
              className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition font-medium"
            >
              Sign In
            </Link>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </nav>

      {/* 🩺 Hero Section */}
      <section className="flex flex-col items-center justify-center text-center pt-36 pb-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
      <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6 text-slate-900">
  AI-Powered Healthcare at Your Fingertips
</h1>


          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-3xl mx-auto">
            Talk to AI doctors, track your vitals, and take control of your
            wellness — all in one seamless experience.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/sign-up"
              className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 shadow-md transition"
            >
              Get Started
            </Link>
            <Link
              href="/dashboard"
              className="border border-blue-600 text-blue-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-50 transition"
            >
              Try Demo
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <Image
            src="doc1.svg"
            alt="AI Doctor Illustration"
            width={650}
            height={450}
            className="mx-auto drop-shadow-2xl animate-float"
            priority
          />
        </motion.div>
      </section>

      {/* 💡 Features */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-14 text-slate-900">
            Why Choose HealthFreak?
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={i}
                className="bg-[rgb(248,250,252)] border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all text-center"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="flex justify-center mb-3">{f.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {f.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ⚙️ Footer */}
      <footer className="mt-auto bg-slate-900 text-slate-300 py-12 border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-2xl font-semibold text-white mb-3">
              HealthFreak
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Your AI-powered companion for health monitoring, diagnosis, and
              real-time care.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-blue-400 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-blue-400 transition">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/sign-in" className="hover:text-blue-400 transition">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-3">Contact</h4>
            <p className="text-sm text-slate-400">
              📧 support@healthfreak.ai <br /> 📞 +91 98765 43210
            </p>
          </div>
        </div>

        <div className="text-center mt-10 text-slate-500 text-sm">
          © {new Date().getFullYear()} HealthFreak. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
