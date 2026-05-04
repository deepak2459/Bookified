import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";

const steps = [
  {
    number: "1",
    title: "Upload PDF",
    description: "Add your book file",
  },
  {
    number: "2",
    title: "AI Processing",
    description: "We analyze the content",
  },
  {
    number: "3",
    title: "Voice Chat",
    description: "Discuss with AI",
  },
];

const HeroSection = () => {
  return (
    <section className="wrapper library-hero-section w-screen">
      <div className="library-hero-card">
        <div className="library-hero-content">
          <div className="library-hero-text">
            <h1 className="library-hero-title">Your Library</h1>
            <p className="library-hero-description">
              Convert your books into interactive AI conversations.
              <br className="hidden sm:block" />
              Listen, learn, and discuss your favorite reads.
            </p>
            <Link href="/books/new" className="library-cta-primary">
              <Plus className="size-6" strokeWidth={2.5} />
              <span>Add new book</span>
            </Link>
          </div>

          <div className="library-hero-illustration-desktop">
            <Image
              src="/assets/hero-illustration.png"
              alt="Books, globe, and reading lamp"
              width={420}
              height={290}
              priority
            />
          </div>

          <div className="library-steps-card" aria-label="How Bookified works">
            {steps.map((step) => (
              <div className="library-step-item" key={step.number}>
                <span className="library-step-number">{step.number}</span>
                <div>
                  <h2 className="library-step-title">{step.title}</h2>
                  <p className="library-step-description">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="library-hero-illustration">
            <Image
              src="/assets/hero-illustration.png"
              alt=""
              width={340}
              height={234}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
