 "use client";

import styles from "../dashboard.module.css";
import { Plus, Download, Edit, CreditCard, Activity } from "lucide-react";
import { useAdminDB } from "@/hooks/use-admin-db";

export default function CardsManagement() {
  const { db, update, createId } = useAdminDB();
  if (!db) return null;
  const cards = db.cards;

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Card Management </h1>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button
            className="btn"
            style={{ border: "1px solid var(--color-border)" }}
            onClick={() =>
              update((prev) => ({
                ...prev,
                cards: [
                  ...Array.from({ length: 5 }).map(() => ({
                    id: createId("CRD"),
                    uid: `${Math.random().toString(16).slice(2, 6).toUpperCase()}-${Math.random().toString(16).slice(2, 6).toUpperCase()}`,
                    userId: null,
                    status: "INACTIVE" as const,
                    taps: 0,
                  })),
                  ...prev.cards,
                ],
              }))
            }
          >
            <Download size={16} /> Bulk Upload
          </button>
          <button
            className="btn btn-primary"
            onClick={() =>
              update((prev) => ({
                ...prev,
                cards: [
                  {
                    id: createId("CRD"),
                    uid: `${Math.random().toString(16).slice(2, 6).toUpperCase()}-${Math.random().toString(16).slice(2, 6).toUpperCase()}`,
                    userId: null,
                    status: "INACTIVE",
                    taps: 0,
                  },
                  ...prev.cards,
                ],
              }))
            }
          >
            <Plus size={16} /> Generate Cards
          </button>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <h3>NFC Inventory</h3>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Card ID</th>
              <th>UUID</th>
              <th>Assigned User</th>
              <th>Status</th>
              <th>Tap Count</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cards.map((card, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <CreditCard size={16} className={styles.icon} />
                  {card.id}
                </td>
                <td style={{ fontFamily: "monospace", color: "var(--color-text-muted)" }}>{card.uid}</td>
                <td>{db.users.find((entry) => entry.id === card.userId)?.name ?? <span style={{ color: "var(--color-text-muted)" }}>Unassigned</span>}</td>
                <td>
                  <span className={`${styles.badge} ${card.status === "ACTIVE" ? styles.badgeSuccess : styles.badgeDanger}`}>
                    {card.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Activity size={14} color="var(--color-secondary)" />
                    {card.taps}
                  </div>
                </td>
                <td>
                  <button
                    className="btn"
                    style={{ padding: '0.25rem', color: 'var(--color-primary)' }}
                    onClick={() =>
                      update((prev) => ({
                        ...prev,
                        cards: prev.cards.map((entry) =>
                          entry.id === card.id
                            ? { ...entry, status: entry.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" }
                            : entry
                        ),
                      }))
                    }
                  >
                    <Edit size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
