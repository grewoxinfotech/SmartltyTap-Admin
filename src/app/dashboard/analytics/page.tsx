 "use client";

import styles from "../dashboard.module.css";
import { BarChart3, PieChart } from "lucide-react";
import { useAdminDB } from "@/hooks/use-admin-db";

export default function AnalyticsPage() {
  const { db, kpis } = useAdminDB();
  if (!db || !kpis) return null;
  const topCards = [...db.cards].sort((a, b) => b.taps - a.taps).slice(0, 3);

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>System Analytics</h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "2rem" }}>
        <div className={styles.tableContainer} style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
            <h3>NFC Tap Activity</h3>
            <BarChart3 size={20} color="var(--color-primary)" />
          </div>
          <div style={{ height: "200px", display: "flex", alignItems: "flex-end", gap: "10%", padding: "1rem 0", borderBottom: "1px solid var(--color-border)" }}>
            {/* Visual mock of a bar chart */}
            <div style={{ width: "10%", height: "40%", background: "var(--color-primary)", borderRadius: "2px" }}></div>
            <div style={{ width: "10%", height: "70%", background: "var(--color-primary)", borderRadius: "2px" }}></div>
            <div style={{ width: "10%", height: "55%", background: "var(--color-primary)", borderRadius: "2px" }}></div>
            <div style={{ width: "10%", height: "100%", background: "var(--color-primary)", borderRadius: "2px" }}></div>
            <div style={{ width: "10%", height: "80%", background: "var(--color-primary)", borderRadius: "2px" }}></div>
            <div style={{ width: "10%", height: "30%", background: "var(--color-primary)", borderRadius: "2px" }}></div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem", color: "var(--color-text-muted)", fontSize: "0.75rem" }}>
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
          </div>
        </div>

        <div className={styles.tableContainer} style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
            <h3>Top Social Link Clicks</h3>
            <PieChart size={20} color="var(--color-secondary)" />
          </div>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "1rem", marginTop: "2rem" }}>
            <li style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#25D366" }}></div>
                WhatsApp
              </div>
              <span style={{ fontWeight: 600 }}>{Math.round(kpis.linkClicks * 0.45)} clicks</span>
            </li>
            <li style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#E1306C" }}></div>
                Instagram
              </div>
              <span style={{ fontWeight: 600 }}>{Math.round(kpis.linkClicks * 0.33)} clicks</span>
            </li>
            <li style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#4285F4" }}></div>
                Google Review
              </div>
              <span style={{ fontWeight: 600 }}>{Math.round(kpis.linkClicks * 0.22)} clicks</span>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <h3>Top Performing Cards</h3>
        </div>
        <table className={styles.table}>
          <thead><tr><th>Card</th><th>Status</th><th>Taps</th></tr></thead>
          <tbody>
            {topCards.map((card) => (
              <tr key={card.id}>
                <td>{card.id}</td>
                <td>{card.status}</td>
                <td>{card.taps}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
