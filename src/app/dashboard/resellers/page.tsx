 "use client";

import styles from "../dashboard.module.css";
import { UserPlus, DollarSign, Activity } from "lucide-react";
import { useAdminDB } from "@/hooks/use-admin-db";

export default function ResellersManagement() {
  const { db, update, createId } = useAdminDB();
  if (!db) return null;
  const resellers = db.resellers;

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Reseller Partners</h1>
        <button
          className="btn btn-primary"
          onClick={() =>
            update((prev) => ({
              ...prev,
              resellers: [
                { id: createId("RES"), name: "New Partner", assignedPricing: "Wholesale Tier C", totalSales: 0, commissionRate: 8 },
                ...prev.resellers,
              ],
            }))
          }
        >
          <UserPlus size={16} /> Add Reseller
        </button>
      </div>

      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <h3>Partner Network</h3>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Reseller Name</th>
              <th>Assigned Pricing Map</th>
              <th>Total Sales</th>
              <th>Commission Rate</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {resellers.map((reseller, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600 }}>{reseller.name}</td>
                <td><span className={`${styles.badge} ${styles.badgeWarning}`}>{reseller.assignedPricing}</span></td>
                <td style={{ fontWeight: 500 }}>${reseller.totalSales.toLocaleString()}</td>
                <td>{reseller.commissionRate}%</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn" title="View Analytics" style={{ padding: '0.25rem', color: 'var(--color-primary)' }} onClick={() => window.alert(`${reseller.name}: ${reseller.totalSales}`)}>
                      <Activity size={16} />
                    </button>
                    <button
                      className="btn"
                      title="Manage Commissions"
                      style={{ padding: '0.25rem', color: 'var(--color-success)' }}
                      onClick={() =>
                        update((prev) => ({
                          ...prev,
                          resellers: prev.resellers.map((entry) =>
                            entry.id === reseller.id ? { ...entry, commissionRate: entry.commissionRate + 1 } : entry
                          ),
                        }))
                      }
                    >
                      <DollarSign size={16} />
                    </button>
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
