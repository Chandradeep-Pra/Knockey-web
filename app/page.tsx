"use client"

import ConnectedBackground from "@/components/ConnectedBackground";
import Dots from "@/components/Dot";
import HowItWorksCard from "@/components/HowItWorksCard";
import Image from "next/image";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import animationData from "@/public/lottie/Hero-1.json";
import animationData2 from "@/public/lottie/Relax.json";

export default function HomePage() {
  const steps = [
  {
    title: "Stick the QR",
    desc: "Place the QR code at your door or gate.",
  },
  {
    title: "Visitor scans",
    desc: "They scan and ring the bell from their phone.",
  },
  {
    title: "You connect",
    desc: "Talk live, or receive a message if you’re away.",
  },
];
  return (
    <main className="bg-background text-foreground">

      {/* <ConnectedBackground /> */}
      {/* HERO */}
      <section className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-5xl w-full grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Copy */}
          <div className="space-y-8">
  {/* Brand */}
  <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
    Knock<span className="text-primary">e</span>Y
  </h1>

  {/* Headline */}
  <div className="flex items-center gap-4">
    <Dots />

    <h2 className="text-3xl md:text-4xl font-semibold leading-snug">
      A gentle, modern
      <br />
      <span className="text-primary">digital doorbell</span>
    </h2>
  </div>

  {/* Subtext */}
  <p className="text-muted text-lg max-w-md">
    Let visitors ring your door using a QR code.
    Talk live, receive messages, and know who stopped by —
    all without installing hardware.
  </p>

  {/* CTA */}
  <div className="flex gap-4">
    <button className="bg-primary text-white px-6 py-3 rounded-2xl text-base font-medium shadow-lg">
      See how it works
    </button>
    <button className="bg-card border border-border px-6 py-3 rounded-2xl text-base font-medium">
      View demo
    </button>
  </div>
</div>


          {/* Right: Hero Visual Placeholder */}
          <div className="flex items-center justify-center">
            <div className="w-full h-full flex items-center justify-center">
              {/* Lottie / Illustration Placeholder */}
              <Lottie
        animationData={animationData}
        loop
        autoplay
        className="w-64 h-64 md:w-96 md:h-96"
      />
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-28 px-6 bg-card">
  <div className="max-w-5xl mx-auto space-y-16">
    {/* Section intro */}
    <div className="text-center space-y-2">
      {/* <p className="text-sm text-muted">
        Simple by design
      </p> */}

      <h2 className="text-3xl md:text-4xl font-semibold">
        Knock<span className="text-primary">e</span>Y
      </h2>
      

      <p className="text-muted max-w-md mx-auto">
        No apps for visitors. No hardware for you.
        Just a gentle way to connect at your door.
      </p>
    </div>

    {/* Cards */}
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ staggerChildren: 0.2 }}
      className="grid md:grid-cols-3 gap-8"
    >
      {steps.map((step, i) => (
        <HowItWorksCard
          key={i}
          index={i}
          title={step.title}
          description={step.desc}
        />
      ))}
    </motion.div>
  </div>
</section>


      {/* WHY IT FEELS GOOD */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Visual */}
          <div className="flex justify-center">
            <div className="w-full h-full flex items-center justify-center">
              {/* Lottie / Illustration Placeholder */}
              <Lottie
        animationData={animationData2}
        loop
        autoplay
        className="w-64 h-64 md:w-96 md:h-96"
      />
            </div>
          </div>

          {/* Copy */}
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold">
              Designed to feel human
            </h2>
            <p className="text-muted text-lg">
              No loud buzzers. No intrusive hardware.
              Just a calm, friendly way to greet people at your door.
            </p>

            <ul className="space-y-3 text-muted">
              <li>• No app required for visitors</li>
              <li>• Works on any phone</li>
              <li>• Clear, respectful interactions</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-secondary/20">
        <div className="max-w-xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-semibold">
            Your door, but smarter
          </h2>
          <p className="text-muted text-lg">
            A small QR can change how you welcome people.
          </p>

          <button className="bg-primary text-white px-8 py-4 rounded-2xl text-lg font-medium shadow-lg">
            Try the demo
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 text-center text-muted text-sm">
        Made with care · © {new Date().getFullYear()}
      </footer>
    </main>
  );
}

