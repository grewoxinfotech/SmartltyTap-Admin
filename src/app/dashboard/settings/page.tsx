"use client";

import styles from "../dashboard.module.css";
import { Save } from "lucide-react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [settings, setSettings] = useState<any>({
    site_name: "",
    logo_url: "",
    email: "",
    phone: "",
    whatsapp_number: "",
    razorpay_key: "",
    razorpay_secret: "xxxxxxxxxxxxxxxxxxxx",
    smtp_config: { host: "", port: "", email: "", password: "********" },
    branding: { primary_color: "#4F46E5", secondary_color: "#0ea5e9" }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only admins would see this if middleware restricts it, but we pass token anyway
    if (session?.user) {
      fetchSettings();
    }
  }, [session]);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/v1/settings", {
        headers: { "Authorization": `Bearer ${session?.user?.id}` } // Note: real JWT needed if they use real tokens
      });
      const data = await res.json();
      if (data.ok && data.data) {
        setSettings(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch settings", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/v1/settings/update", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.user?.id}`
        },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (data.ok) {
        window.alert("Settings saved successfully!");
      } else {
        window.alert("Error saving settings: " + data.message);
      }
    } catch (error) {
      console.error("Failed to save settings", error);
    }
  };

  const updateSettings = (key: string, value: any) => {
    setSettings((prev: any) => ({ ...prev, [key]: value }));
  };

  if (isLoading) return <div>Loading settings...</div>;

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Platform Settings</h1>
        <button className="btn btn-primary" onClick={saveSettings}>
          <Save size={16} /> Save Changes
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        
        {/* General Settings */}
        <div className={styles.tableContainer} style={{ padding: "1.5rem" }}>
          <h3 style={{ marginBottom: "1.5rem", color: "var(--color-text-main)" }}>General Branding</h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--color-text-muted)" }}>Platform Name</label>
              <input type="text" value={settings.site_name || ""} className="field" onChange={(e) => updateSettings("site_name", e.target.value)} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--color-text-muted)" }}>Support Email</label>
              <input type="email" value={settings.email || ""} className="field" onChange={(e) => updateSettings("email", e.target.value)} />
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--color-text-muted)" }}>Support Phone</label>
              <input type="text" value={settings.phone || ""} className="field" onChange={(e) => updateSettings("phone", e.target.value)} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--color-text-muted)" }}>WhatsApp Number (Bots & Alerts)</label>
              <input type="text" value={settings.whatsapp_number || ""} className="field" onChange={(e) => updateSettings("whatsapp_number", e.target.value)} />
            </div>
          </div>
        </div>

        {/* Integration Settings */}
        <div className={styles.tableContainer} style={{ padding: "1.5rem" }}>
          <h3 style={{ marginBottom: "1.5rem", color: "var(--color-text-main)" }}>Integrations & SMTP</h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            
            <div style={{ display: "flex", gap: "1rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
                <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--color-text-muted)" }}>SMTP Host</label>
                <input type="text" value={settings.smtp_config?.host || ""} className="field" onChange={(e) => updateSettings("smtp_config", { ...settings.smtp_config, host: e.target.value })} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", width: "100px" }}>
                <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--color-text-muted)" }}>SMTP Port</label>
                <input type="number" value={settings.smtp_config?.port || ""} className="field" onChange={(e) => updateSettings("smtp_config", { ...settings.smtp_config, port: e.target.value })} />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--color-text-muted)" }}>SMTP Email</label>
              <input type="email" value={settings.smtp_config?.email || ""} className="field" onChange={(e) => updateSettings("smtp_config", { ...settings.smtp_config, email: e.target.value })} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>
              <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--color-text-muted)" }}>SMTP Password</label>
              <input type="password" value={settings.smtp_config?.password || ""} className="field" onChange={(e) => updateSettings("smtp_config", { ...settings.smtp_config, password: e.target.value })} />
            </div>

            <hr style={{ border: "0", borderTop: "1px solid var(--color-border)" }} />

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--color-text-muted)" }}>Razorpay Key ID</label>
              <input type="text" value={settings.razorpay_key || ""} placeholder="rzp_test_..." className="field" onChange={(e) => updateSettings("razorpay_key", e.target.value)} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--color-text-muted)" }}>Razorpay Secret</label>
              <input type="password" value={settings.razorpay_secret || ""} placeholder="xxxxxxxxxxxxxxxxxxxx" className="field" onChange={(e) => updateSettings("razorpay_secret", e.target.value)} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
