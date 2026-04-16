 "use client";

import styles from "../dashboard.module.css";
import { Plus, Eye, Monitor } from "lucide-react";
import { useAdminDB } from "@/hooks/use-admin-db";

export default function TemplatesManager() {
  const { db, update, createId } = useAdminDB();
  if (!db) return null;
  const templates = db.templates;

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Template Management</h1>
        <button
          className="btn btn-primary"
          onClick={() =>
            update((prev) => ({
              ...prev,
              templates: [
                { id: createId("TPL"), name: "New Template", category: "BASIC", previewUrl: "https://example.com", active: true },
                ...prev.templates,
              ],
            }))
          }
        >
          <Plus size={16} /> Create Template
        </button>
      </div>

      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <h3>Available Smart Profiles Templates</h3>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Template Name</th>
              <th>Category</th>
              <th>Active Users</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {templates.map((template, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Monitor size={16} color="var(--color-primary)" />
                  {template.name}
                </td>
                <td>
                  <span className={`${styles.badge} ${template.category === "PREMIUM" ? styles.badgeWarning : ""}`} style={template.category === "BASIC" ? { background: "var(--color-bg-base)", color: "var(--color-text-main)" } : {}}>
                    {template.category}
                  </span>
                </td>
                <td>{db.profiles.filter((profile) => profile.templateId === template.id).length} profiles</td>
                <td>
                  <span className={`${styles.badge} ${template.active ? styles.badgeSuccess : styles.badgeDanger}`}>
                    {template.active ? "ACTIVE" : "DRAFT"}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn" title="Live Preview" style={{ padding: '0.25rem', color: 'var(--color-primary)' }} onClick={() => window.open(template.previewUrl, "_blank")}>
                      <Eye size={16} />
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
