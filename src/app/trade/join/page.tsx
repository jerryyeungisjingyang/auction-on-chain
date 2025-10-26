"use client";
import { useState } from "react";
import { getCarbonTraderContract } from "@/lib/contract";
import { getSigner } from "@/lib/web3";
import Link from "next/link";

export default function JoinTradePage() {
  const [tradeID, setTradeID] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function onDeposit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    try {
      setLoading(true);
      const signer = await getSigner();
      const contract = getCarbonTraderContract(signer);
      const tx = await contract.deposit(
        tradeID,
        info,
        { value: BigInt(depositAmount || "0") }
      );
      await tx.wait();
      setMsg("保证金已提交");
    } catch (err: unknown) {
      const message =
        typeof err === "object" && err !== null && "message" in err
          ? String((err as { message: unknown }).message)
          : "提交失败";
      setMsg(message);
    } finally {
      setLoading(false);
    }
  }

  async function onRefund() {
    setMsg("");
    try {
      setLoading(true);
      const signer = await getSigner();
      const contract = getCarbonTraderContract(signer);
      const tx = await contract.refundDeposit(tradeID);
      await tx.wait();
      setMsg("保证金已退回");
    } catch (err: unknown) {
      const message =
        typeof err === "object" && err !== null && "message" in err
          ? String((err as { message: unknown }).message)
          : "退款失败";
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
      <h2 style={{ fontSize: 22, fontWeight: 600 }}>参与竞拍</h2>
      <form onSubmit={onDeposit} style={{ marginTop: 16, display: "grid", gap: 12 }}>
        <Field label="交易ID">
          <input value={tradeID} onChange={(e) => setTradeID(e.target.value)} required style={inputStyle} />
          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>请填写卖家提供的交易ID（如 item-20251022-1830-ab12）。</div>
        </Field>
        <Field label="保证金">
          <input type="number" min="0" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} required style={inputStyle} />
        </Field>
        <Field label="投标信息（字符串）">
          <input value={info} onChange={(e) => setInfo(e.target.value)} style={inputStyle} />
        </Field>
        <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
          <button disabled={loading} style={btnPrimary}>{loading ? "提交中..." : "提交保证金"}</button>
          <button type="button" onClick={onRefund} disabled={loading} style={btnGhost}>退回保证金</button>
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

const btnGhost: React.CSSProperties = {
  padding: "10px 14px",
  background: "#fff",
  color: "#111827",
  border: "1px solid #e5e7eb",
  borderRadius: 8,
};


