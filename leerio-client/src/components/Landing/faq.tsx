"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'What does "Bring Your Own API Key" mean?',
      answer:
        "You use your own API key from providers like OpenAI, Anthropic, or Google. This means you have complete control over your usage and costs, and we never have access to your API credentials.",
    },
    {
      question: "Which AI providers are supported?",
      answer:
        "We support major AI providers including OpenAI (GPT-4, GPT-3.5), Anthropic (Claude), Google (Gemini), and more. You can switch between providers at any time.",
    },
    {
      question: "Is my API key stored securely?",
      answer:
        "Yes, your API key is encrypted and stored securely in our database. It's never exposed publicly or shared with third parties. You have full control to update or remove it at any time.",
    },
    {
      question: "Can I remove my API key anytime?",
      answer:
        "Absolutely. You can update or remove your API key from your settings at any time. We believe in giving you complete control over your data and credentials.",
    },
    {
      question: "Are my PDFs used to train AI models?",
      answer:
        "No, never. Your PDFs and conversations are completely private. When you use your own API key, the AI provider processes your requests according to their terms, but your documents are not used for training.",
    },
    {
      question: "How does the vector database work?",
      answer:
        "When you upload a PDF, we split it into chunks and create embeddings (mathematical representations). These are stored in a vector database, allowing the AI to quickly find relevant sections when you ask questions.",
    },
  ];

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="bg-background py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <p className="text-muted-foreground mb-2 text-sm font-medium tracking-wide uppercase">
              FAQ
            </p>
            <h2 className="text-foreground text-3xl font-bold sm:text-4xl">
              Common questions
            </h2>
          </div>

          {/* FAQ List */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border-border overflow-hidden rounded-lg border"
              >
                <button
                  onClick={() => toggleQuestion(index)}
                  className="text-foreground hover:bg-accent/50 flex w-full items-center justify-between p-6 text-left transition-colors"
                >
                  <span className="text-base font-medium sm:text-lg">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`text-muted-foreground h-5 w-5 shrink-0 transition-transform ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openIndex === index && (
                  <div className="border-border bg-muted/30 border-t px-6 pt-4 pb-6">
                    <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
