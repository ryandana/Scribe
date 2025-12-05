import Section from "@/components/atoms/section.component";
import Button from "@/components/ui/button.component";
import CountUp from "@/components/ui/count-up.component";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <Section className="relative flex flex-col items-center justify-center max-w-screen py-32 px-4 text-center">
        <div className="prose lg:prose-xl mx-auto">
          <h1 className="font-bold leading-tight">
            Where developers share what matters.
          </h1>
          <p className="text-lg max-w-2xl mx-auto">
            Articles, insights, and experiences from real developers. Powered by
            AI to help you discover knowledge worth reading.
          </p>
          <div className="flex items-center justify-center gap-8">
            <div className="flex flex-col items-center gap-2">
              <span className="text-base text-black font-semibold">
                Trusted By
              </span>
              <div className="text-black font-semibold">
                19,000,000+ developers
              </div>
            </div>
          </div>
          <Link href="/login">
            <Button className="btn-lg mt-6">Get Started</Button>
          </Link>
        </div>
      </Section>
    </>
  );
}
