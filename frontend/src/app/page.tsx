import Link from "next/link";
import { Nav } from "@/components/common/Nav";
import { Footer } from "@/components/common/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Nav />

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-4 md:px-6 py-24 md:py-32 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            Ready to use
          </div>

          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-foreground max-w-2xl mx-auto leading-[1.1]">
            The stack to ship your next project
          </h1>

          <p className="mt-6 text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
            A production-ready boilerplate with NestJS, Next.js 15, MongoDB, and
            JWT authentication — pre-wired and ready to extend.
          </p>

          <div className="flex items-center justify-center gap-3 mt-10">
            <Link
              href="/register"
              className="h-10 px-5 rounded-md bg-foreground text-background text-sm font-medium no-underline inline-flex items-center hover:opacity-90 transition-opacity"
            >
              Get started
            </Link>
            <Link
              href="/login"
              className="h-10 px-5 rounded-md border border-border bg-background text-foreground text-sm font-medium no-underline inline-flex items-center hover:bg-accent transition-colors"
            >
              Sign in
            </Link>
          </div>
        </section>

        {/* Features grid */}
        <section className="border-t border-border">
          <div className="mx-auto max-w-6xl px-4 md:px-6 py-16 md:py-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
              {[
                {
                  title: "Authentication",
                  description:
                    "JWT access + refresh tokens, session rotation, register/login/logout, and role-based guards out of the box.",
                },
                {
                  title: "Clean Architecture",
                  description:
                    "NestJS backend with explicit use-case classes, repository ports, and Mongoose adapters — no god-services.",
                },
                {
                  title: "Ready to extend",
                  description:
                    "Add modules with the NestJS CLI scaffold. The auth, user, and role foundation stays clean and untouched.",
                },
              ].map((f) => (
                <div key={f.title} className="bg-background p-6 md:p-8">
                  <h3 className="text-sm font-semibold text-foreground mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tech stack */}
        <section className="border-t border-border">
          <div className="mx-auto max-w-6xl px-4 md:px-6 py-12 flex flex-wrap items-center justify-center gap-8">
            {["NestJS 11", "Next.js 15", "MongoDB", "Mongoose", "JWT", "TypeScript", "Tailwind CSS"].map((t) => (
              <span key={t} className="text-sm font-medium text-muted-foreground">
                {t}
              </span>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
