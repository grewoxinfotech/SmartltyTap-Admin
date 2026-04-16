 "use client";

import styles from "../dashboard.module.css";
import { RotateCcw, AlertTriangle } from "lucide-react";
import { useAdminDB } from "@/hooks/use-admin-db";

export default function PaymentsLog() {
  const { db, update } = useAdminDB();
  if (!db) return null;
  const payments = db.payments;

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Payment Logs (Razorpay)</h1>
      </div>

      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <h3>Transaction History</h3>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Gateway Payment ID</th>
              <th>Order ID</th>
              <th>Amount</th>
              <th>Payment Method</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment, i) => (
              <tr key={i}>
                <td style={{ fontFamily: "monospace", color: "var(--color-text-muted)" }}>{payment.id}</td>
                <td style={{ fontWeight: 600 }}>{payment.orderId}</td>
                <td>${payment.amount.toFixed(2)}</td>
                <td>{payment.method}</td>
                <td>
                  <span className={`${styles.badge} ${payment.status === "SUCCESS" ? styles.badgeSuccess : styles.badgeDanger}`}>
                    {payment.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {payment.status === "SUCCESS" && (
                      <button
                        className="btn"
                        title="Initiate Refund"
                        style={{ padding: '0.25rem', color: 'var(--color-warning)' }}
                        onClick={() =>
                          update((prev) => ({
                            ...prev,
                            payments: prev.payments.map((entry) =>
                              entry.id === payment.id ? { ...entry, status: "REFUNDED" } : entry
                            ),
                          }))
                        }
                      >
                        <RotateCcw size={16} />
                      </button>
                    )}
                    {payment.status !== "SUCCESS" && (
                      <button className="btn" title="Check Logs" style={{ padding: '0.25rem', color: 'var(--color-danger)' }}>
                        <AlertTriangle size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
