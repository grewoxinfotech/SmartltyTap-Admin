 "use client";

import styles from "../dashboard.module.css";
import { Link as LinkIcon, Edit, Settings } from "lucide-react";
import { useAdminDB } from "@/hooks/use-admin-db";

export default function ProfilesManagement() {
  const { db, update } = useAdminDB();
  if (!db) return null;
  const profiles = db.profiles;

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Smart Profiles</h1>
      </div>

      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <h3>User Profiles & Templates</h3>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Profile ID</th>
              <th>User</th>
              <th>Template Assigned</th>
              <th>Active Links</th>
              <th>Status</th>
              <th>Configuration</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((profile, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600 }}>{profile.id}</td>
                <td>{db.users.find((u) => u.id === profile.userId)?.name ?? profile.userId}</td>
                <td>{db.templates.find((t) => t.id === profile.templateId)?.name ?? profile.templateId}</td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <LinkIcon size={14} /> {Object.values(profile.links).filter(Boolean).length}
                  </div>
                </td>
                <td>
                  <span className={`${styles.badge} ${profile.featuresEnabled ? styles.badgeSuccess : styles.badgeDanger}`}>
                    {profile.featuresEnabled ? "ACTIVE" : "INACTIVE"}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn" title="Manage Links" style={{ padding: '0.25rem', color: 'var(--color-secondary)' }} onClick={() => window.alert(JSON.stringify(profile.links, null, 2))}>
                      <LinkIcon size={16} />
                    </button>
                    <button
                      className="btn"
                      title="Edit Template"
                      style={{ padding: '0.25rem', color: 'var(--color-primary)' }}
                      onClick={() =>
                        update((prev) => ({
                          ...prev,
                          profiles: prev.profiles.map((entry) =>
                            entry.id === profile.id ? { ...entry, templateId: prev.templates[0]?.id ?? entry.templateId } : entry
                          ),
                        }))
                      }
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="btn"
                      title="Toggle Features"
                      style={{ padding: '0.25rem', color: 'var(--color-text-muted)' }}
                      onClick={() =>
                        update((prev) => ({
                          ...prev,
                          profiles: prev.profiles.map((entry) =>
                            entry.id === profile.id ? { ...entry, featuresEnabled: !entry.featuresEnabled } : entry
                          ),
                        }))
                      }
                    >
                      <Settings size={16} />
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
