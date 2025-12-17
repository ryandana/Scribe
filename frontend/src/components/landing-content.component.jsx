"use client";

import { useState, useEffect } from "react";
import Section from "@/components/atoms/section.component";
import Link from "next/link";
import { IconSparkles, IconChevronDown } from "@tabler/icons-react";

function TypingText({ texts, className }) {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const text = texts[currentIndex];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          setCurrentText(text.substring(0, currentText.length + 1));
          if (currentText === text) {
            setTimeout(() => setIsDeleting(true), 2000);
          }
        } else {
          setCurrentText(text.substring(0, currentText.length - 1));
          if (currentText === "") {
            setIsDeleting(false);
            setCurrentIndex((prev) => (prev + 1) % texts.length);
          }
        }
      },
      isDeleting ? 50 : 100
    );

    return () => clearTimeout(timeout);
  }, [currentText, currentIndex, isDeleting, texts]);

  return (
    <span className={className}>
      {currentText}
      <span className="border-r-2 border-neutral ml-1"></span>
    </span>
  );
}

function AnimatedCounter({ end, suffix = "" }) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.5 }
    );

    const element = document.getElementById(`counter-${end}`);
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [end, hasStarted]);

  useEffect(() => {
    if (!hasStarted) {
      setCount(end);
      return;
    }

    let start = 0;
    const duration = 1500;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      setCount(Math.floor(progress * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [hasStarted, end]);

  return (
    <span id={`counter-${end}`}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

function AccordionItem({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-base-100 last:border-0">
      <button
        className="w-full py-6 flex justify-between items-center text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-semibold text-neutral text-lg">{title}</span>
        <IconChevronDown
          className={`transition-transform duration-300 text-neutral/50 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96 opacity-100 mb-6" : "max-h-0 opacity-0"
        }`}
      >
        <p className="text-neutral/70 leading-relaxed pr-8">{children}</p>
      </div>
    </div>
  );
}

export default function ClientLandingContent() {
  const typingTexts = ["developers", "writers", "creators", "thinkers"];

  return (
    <>
      <Section className="border-b border-base-100 min-h-auto flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-base-100 bg-base-100 text-neutral text-sm font-medium mb-8">
            <IconSparkles size={16} />
            <span>The Intelligent Publishing Platform</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-neutral mb-8 leading-tight">
            Where{" "}
            <span className="text-neutral underline decoration-wavy decoration-primary/50">
              <TypingText texts={typingTexts} />
            </span>
            <br /> share what matters.
          </h1>

          <p className="text-xl text-neutral/70 mb-10 max-w-2xl mx-auto leading-relaxed">
            A minimal, focused platform for your best writing. Enhanced with AI,
            designed for clarity.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/register">
              <button className="btn btn-neutral btn-lg min-w-[200px] rounded-xl font-medium">
                Start Writing
              </button>
            </Link>
            <Link href="/explore">
              <button className="btn btn-ghost btn-lg min-w-[200px] rounded-xl border border-base-300 hover:bg-base-200 font-medium">
                Read Articles
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mt-16 pt-10 border-t border-base-100">
            <div className="text-center">
              <div className="text-3xl font-bold text-neutral">
                <AnimatedCounter end={19000} suffix="+" />
              </div>
              <div className="text-sm text-neutral/60 font-medium uppercase tracking-wider mt-1">
                Active Writers
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-neutral">
                <AnimatedCounter end={125000} suffix="+" />
              </div>
              <div className="text-sm text-neutral/60 font-medium uppercase tracking-wider mt-1">
                Articles
              </div>
            </div>
            <div className="col-span-2 md:col-span-1 text-center">
              <div className="text-3xl font-bold text-neutral">
                <AnimatedCounter end={2500000} suffix="+" />
              </div>
              <div className="text-sm text-neutral/60 font-medium uppercase tracking-wider mt-1">
                Suggestions
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section className="pt-20 border-b border-base-100 bg-base-100">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-neutral mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-neutral/70">Common questions about Scribe.</p>
          </div>

          <div className="space-y-2">
            <AccordionItem title="Is Scribe really free?">
              Yes, our Starter plan is completely free and includes unlimited
              reading and up to 3 published stories per month. It's perfect for
              casual writers or those just starting out.
            </AccordionItem>
            <AccordionItem title="Can I export my data?">
              Absolutely. You own your content. You can export all your articles
              as Markdown files at any time, ensuring you're never locked into
              our platform.
            </AccordionItem>
            <AccordionItem title="How does the AI assistant work?">
              We use advanced large language models to analyze your text in
              real-time. It suggests improvements for grammar, clarity, and
              tone, but you always have the final say. It's like having a
              professional editor over your shoulder.
            </AccordionItem>
            <AccordionItem title="Do you support custom domains?">
              Yes, Pro and Team plan users can connect a custom domain to their
              profile, giving their blog a fully professional look and feel.
            </AccordionItem>
          </div>
        </div>
      </Section>

      {/* Footer */}
      <footer className="border-t border-base-100 bg-base-100 pt-16 pb-8 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 text-center md:text-left">
            <div className="col-span-2 md:col-span-1">
              <Link
                href="/"
                className="font-bold text-xl tracking-tight text-neutral inline-block"
              >
                Scribe.
              </Link>
              <p className="mt-4 text-sm text-neutral/60 leading-relaxed">
                Built for developers who care about sharing knowledge clearly
                and beautifully.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-neutral mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-neutral/70">
                <li>
                  <Link href="/explore" className="hover:text-neutral">
                    Explore
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-neutral mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-neutral/70">
                <li>
                  <Link href="/about" className="hover:text-neutral">
                    About
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-neutral mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-neutral/70">
                <li>
                  <Link href="/privacy" className="hover:text-neutral">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-neutral">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-base-100 pt-8 flex flex-col items-center gap-4">
            <p className="text-xs text-neutral/50">
              © {new Date().getFullYear()} Scribe Inc.
            </p>
            <div className="flex gap-4"></div>
          </div>

          <div className="w-full flex justify-center mt-12 text-neutral select-none pointer-events-none">
            <h1 className="text-[15vw] leading-none font-bold tracking-tighter text-center">
              SCRIBE
            </h1>
          </div>
        </div>
      </footer>
    </>
  );
}
