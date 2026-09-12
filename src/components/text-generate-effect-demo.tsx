"use client";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

const words = `These are the projects that I am proud of — architected with precision, engineered for scale.`;

export default function TextGenerateEffectDemo() {
  return <TextGenerateEffect words={words} />;
}
