"use client";

import { useEffect, useState } from "react";
import appServices from "@/services/apps";
import accountServices from "@/services/accounts";
import { App } from "@/model/app";
import { Claim } from "@/model/account";

type UserInfo = {
  userId: string;
  name?: string;
  email?: string;
};

export default function AppsPage() {
  const [apps, setApps] = useState<App[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [user, setUser] = useState<UserInfo | null>(null);

  const [newAppName, setNewAppName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    init();
  }, []);

  async function init() {
    try {
      // Load user info
      const claims: Claim[] = await accountServices.getInfo();

      const userId = claims.find(
        (c) =>
          c.type ===
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
      )?.value;

      const name = claims.find(
        (c) =>
          c.type ===
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
      )?.value;

      const email = claims.find(
        (c) =>
          c.type ===
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
      )?.value;

      if (!userId) throw new Error("UserId not found");

      setUser({ userId, name, email });

      // Load apps
      await fetchApps(true);
    } catch (err) {
      console.error(err);
      setError("Failed to load user info");
    } finally {
      setInitialLoading(false);
    }
  }

  async function fetchApps(isInitial = false) {
    try {
      if (!isInitial) setRefreshing(true);

      const res = await appServices.getApps();
      setApps(res ?? []);
    } catch (err) {
      console.error(err);
      setError("Failed to load applications");
    } finally {
      setRefreshing(false);
    }
  }

  async function createApp() {
    if (!newAppName.trim() || !user) return;

    try {
      setCreating(true);
      setError(null);

      await appServices.createApp({
        name: newAppName,
        template: "default",
        tier: 1,
        userId: user.userId,
      });

      setNewAppName("");
      fetchApps(); // refresh silent
    } catch (err) {
      console.error(err);
      setError("Create app failed");
    } finally {
      setCreating(false);
    }
  }

  async function cleanupApps() {
    if (!user?.userId) return;
    if (!confirm("Are you sure you want to delete all apps?")) return;

    try {
      setError(null);
      await appServices.cleanUp();
      fetchApps(); // refresh silent
    } catch (err) {
      console.error(err);
      setError("Cleanup failed");
    } finally {
    }
  }

  if (initialLoading) {
    return (
      <main style={container}>
        <p>Loading applications…</p>
      </main>
    );
  }

  return (
    <main style={container}>
      {/* ===== Header ===== */}
      <header style={header}>
        <h1 style={{ margin: 0 }}>Applications</h1>

        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          {user && (
            <div style={userInfo}>
              <div style={{ fontWeight: 500 }}>{user.name}</div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>{user.email}</div>
            </div>
          )}

          {refreshing && (
            <span style={{ fontSize: 12, color: "#6b7280" }}>Refreshing…</span>
          )}

          <button onClick={() => accountServices.logout()} style={btnDanger}>
            Logout
          </button>
        </div>
      </header>

      {/* ===== Create App ===== */}
      <section style={card}>
        <h3 style={{ marginTop: 0 }}>Create new application</h3>

        <div style={{ display: "flex", gap: 12 }}>
          <input
            value={newAppName}
            onChange={(e) => setNewAppName(e.target.value)}
            placeholder="Enter app name"
            style={input}
          />
          <button
            onClick={createApp}
            disabled={creating || !user}
            style={{
              ...btnPrimary,
              opacity: creating || !user ? 0.6 : 1,
            }}
          >
            {creating ? "Creating…" : "Create"}
          </button>

          <button
            onClick={cleanupApps}
            // disabled={cleaning || !user?.userId || apps.length === 0}
            style={{
              ...btnDanger,
              // opacity: cleaning || !user?.userId || apps.length === 0 ? 0.6 : 1,
            }}
          >
            Cleanup
          </button>
        </div>

        {!user && (
          <p style={{ color: "#dc2626", marginTop: 8 }}>User info not loaded</p>
        )}

        {error && <p style={{ color: "#dc2626", marginTop: 8 }}>{error}</p>}
      </section>

      {/* ===== App List ===== */}
      <section style={{ marginTop: 32 }}>
        <h3>Your applications</h3>

        {apps.length === 0 ? (
          <p style={{ color: "#6b7280" }}>No applications found</p>
        ) : (
          <div style={grid}>
            {apps.map((app) => (
              <div key={app.id} style={appCard}>
                <strong style={{ fontSize: 16 }}>{app.name}</strong>
                <div style={{ fontSize: 12, color: "#6b7280" }}>{app.id}</div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

/* ================= styles ================= */

const container: React.CSSProperties = {
  maxWidth: 960,
  margin: "0 auto",
  padding: 24,
  background: "#f9fafb",
  minHeight: "100vh",
};

const header: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 32,
};

const userInfo: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  textAlign: "right",
};

const card: React.CSSProperties = {
  padding: 20,
  borderRadius: 12,
  border: "1px solid #e5e7eb",
  background: "#ffffff",
};

const input: React.CSSProperties = {
  flex: 1,
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid #d1d5db",
  background: "#ffffff",
  color: "#111827",
  outline: "none",
};

const btnPrimary: React.CSSProperties = {
  padding: "10px 20px",
  background: "#2563eb",
  color: "#ffffff",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
};

const btnDanger: React.CSSProperties = {
  padding: "8px 16px",
  background: "#ef4444",
  color: "#ffffff",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
};

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
  gap: 16,
};

const appCard: React.CSSProperties = {
  padding: 16,
  borderRadius: 12,
  border: "1px solid #e5e7eb",
  background: "#ffffff",
};
