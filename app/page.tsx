"use client";

import { useEffect, useState } from "react";
import { fetchGatewayApi, logout } from "../services/gatewayApi";
import apiLinks from "@/utils/api-links";

const API_URL = "http://localhost:5230/iris/api/apps";

export default function TestPage() {
  const [data, setData] = useState<any>(null);
  const [status, setStatus] = useState<"loading" | "done" | "error">("loading");

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const json = await fetchGatewayApi(apiLinks.apps.getApps, true);
      setData(json);
      setStatus("done");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  if (status === "loading") return <p>Checking authentication...</p>;
  if (status === "error") return <p>Something went wrong</p>;

  return (
    <main style={{ padding: 24 }}>
      <h1>Apps via Gateway</h1>
      <button
        onClick={() => logout()}
        style={{
          marginBottom: 16,
          padding: "8px 16px",
          background: "#c00",
          color: "#fff",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
        }}
      >
        Logout
      </button>

      <pre
        style={{
          background: "#111",
          color: "#0f0",
          padding: 16,
          borderRadius: 8,
          overflow: "auto",
        }}
      >
        {JSON.stringify(data, null, 2)}
      </pre>
    </main>
  );
}
