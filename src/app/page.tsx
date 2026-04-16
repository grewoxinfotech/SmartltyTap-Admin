import Link from "next/link";

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "2rem" }}>
      <main style={{ maxWidth: 640, textAlign: "center" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>SmartlyTap Admin</h1>
        <p style={{ color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>
          Complete NFC smart card e-commerce and SaaS administration console.
        </p>
        <Link href="/dashboard" className="btn btn-primary">
          Open Dashboard
        </Link>
      </main>
    </div>
  );
}
