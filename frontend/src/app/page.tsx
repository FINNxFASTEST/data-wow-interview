import Link from "next/link";
import { Nav } from "@/components/common/Nav";
import { Footer } from "@/components/common/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Nav />

      <main className="flex-1">
        <section className="stage-hero">
          <div className="mx-auto max-w-6xl px-4 md:px-6 py-20 md:py-28 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/80 px-3 py-1 text-xs text-muted-foreground mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Live inventory · one seat per user per show
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-foreground max-w-2xl mx-auto leading-[1.1]">
              Concerts, seats, and clean reservations
            </h1>

            <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
              Browse upcoming concerts, book a seat, and keep your history in
              one place. Admins list shows and can audit every reservation.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">
              <Link
                href="/register"
                className="h-10 px-6 rounded-md bg-foreground text-background text-sm font-medium no-underline inline-flex items-center justify-center w-full sm:w-auto hover:opacity-90 transition-opacity"
              >
                Create account
              </Link>
              <Link
                href="/login"
                className="h-10 px-6 rounded-md border border-border bg-background text-foreground text-sm font-medium no-underline inline-flex items-center justify-center w-full sm:w-auto hover:bg-accent transition-colors"
              >
                I already have a login
              </Link>
            </div>
          </div>
        </section>

        <section className="concert-ribbon">
          <div className="mx-auto max-w-6xl px-4 md:px-6 py-12 md:py-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-left">
              {[
                {
                  title: "Fair booking",
                  body: "We lock the concert row and count active holds in a single transaction, with a unique database guard for the last race.",
                },
                {
                  title: "Two roles",
                  body: "Admins create listings and read the full audit. Users see shows, book one active seat per concert, and manage their own tickets.",
                },
                {
                  title: "Stack you can extend",
                  body: "NestJS and Next.js 15, JWT sessions, class-validator on the API, and Tailwind + a little custom stage styling here.",
                },
              ].map((f) => (
                <div key={f.title} className="rounded-lg p-4 md:p-5 bg-background/60">
                  <h3 className="text-sm font-semibold text-foreground mb-2">
                    {f.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {f.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
