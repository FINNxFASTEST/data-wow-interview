export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl flex h-14 items-center justify-between px-4 md:px-6">
        <span className="text-sm font-medium text-foreground">Boilerplate</span>
        <span className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} — NestJS · Next.js · MongoDB
        </span>
      </div>
    </footer>
  );
}
