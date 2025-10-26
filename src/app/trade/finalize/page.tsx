"use client";
import { useState } from "react";
import { ethers } from "ethers";
import { getCarbonTraderContract } from "@/lib/contract";
import { getSigner } from "@/lib/web3";
import Link from "next/link";

export default function FinalizePage() {
  const [tradeID, setTradeID] = useState("");
  const [allowanceAmount, setAllowanceAmount] = useState("");
  const [additional, setAdditional] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function onFinalize(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    try {
      setLoading(true);
      const signer = await getSigner();
      const contract = getCarbonTraderContract(signer);
      const tx = await contract.finalizeAuction(
        tradeID,
        ethers.toBigInt(allowanceAmount || "0"),
        ethers.toBigInt(additional || "0"),
        { value: BigInt(additional || "0") }
      );
      await tx.wait();
      setMsg("已结算");
    } catch (err: unknown) {
      const message =
        typeof err === "object" && err !== null && "message" in err
          ? String((err as { message: unknown }).message)
          : "结算失败";
      setMsg(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 24, margin: "0 auto", maxWidth: 720 }}>
      <div style={{ marginBottom: 12 }}>
        <Link href="/" style={{ color: "#0f766e" }}>← 返回首页</Link>
      </div>
      <h2 style={{ fontSize: 22, fontWeight: 600 }}>结算成交</h2>
      <form onSubmit={onFinalize} style={{ marginTop: 16, display: "grid", gap: 12 }}>
        <Field label="交易ID">
          <input value={tradeID} onChange={(e) => setTradeID(e.target.value)} required style={inputStyle} />
        </Field>
        <Field label="成交数量">
          <input type="number" min="0" value={allowanceAmount} onChange={(e) => setAllowanceAmount(e.target.value)} required style={inputStyle} />
        </Field>
        <Field label="需补差价">
          <input type="number" min="0" value={additional} onChange={(e) => setAdditional(e.target.value)} required style={inputStyle} />
        </Field>
        <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
          <button disabled={loading} style={btnPrimary}>{loading ? "提交中..." : "结算"}</button>
        </div>
        {msg && <div style={{ color: msg.includes("已") ? "#065f46" : "#b91c1c" }}>{msg}</div>}
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "grid", gap: 6 }}>
      <span style={{ fontSize: 14, color: "#374151" }}>{label}</span>
      {children}
    </label>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "10px 12px",
  border: "1px solid #e5e7eb",
  borderRadius: 8,
};

const btnPrimary: React.CSSProperties = {
  padding: "10px 14px",
  background: "#0f766e",
  color: "#fff",
  borderRadius: 8,
};


