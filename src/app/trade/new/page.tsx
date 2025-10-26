"use client";
import { useState } from "react";
import { ethers } from "ethers";
import { getCarbonTraderContract } from "@/lib/contract";
import { getSigner } from "@/lib/web3";
import Link from "next/link";

export default function StartTradePage() {
  const [tradeID, setTradeID] = useState("");
  const [amount, setAmount] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [minBid, setMinBid] = useState("");
  const [initPrice, setInitPrice] = useState("");
  const [itemInfo, setItemInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  function generateTradeId() {
    const now = new Date();
    const yyyy = now.getFullYear().toString();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const hh = String(now.getHours()).padStart(2, "0");
    const mi = String(now.getMinutes()).padStart(2, "0");
    const rand = Math.random().toString(36).slice(2, 6);
    const id = `item-${yyyy}${mm}${dd}-${hh}${mi}-${rand}`;
    setTradeID(id);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    try {
      setLoading(true);
      const signer = await getSigner();
      const contract = getCarbonTraderContract(signer);
      const tx = await contract.startTrade(
        tradeID,
        ethers.toBigInt(amount || "0"),
        BigInt(Math.floor(new Date(start).getTime() / 1000)),
        BigInt(Math.floor(new Date(end).getTime() / 1000)),
        ethers.toBigInt(minBid || "0"),
        ethers.toBigInt(initPrice || "0")
      );
      await tx.wait();
      const tx2 = await contract.setTradeItemInfo(tradeID, itemInfo.trim());
      await tx2.wait();
      setMsg("创建成功");
    } catch (err: unknown) {
      const message =
        typeof err === "object" && err !== null && "message" in err
          ? String((err as { message: unknown }).message)
          : "交易失败";
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
      <h2 style={{ fontSize: 22, fontWeight: 600 }}>发起拍卖</h2>
      <form onSubmit={onSubmit} style={{ marginTop: 16, display: "grid", gap: 12 }}>
        <Field label="交易ID">
          <div style={{ display: "flex", gap: 8 }}>
            <input value={tradeID} onChange={(e) => setTradeID(e.target.value)} required style={{ ...inputStyle, flex: 1 }} />
            <button type="button" onClick={generateTradeId} style={btnGhost}>生成ID</button>
          </div>
          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>推荐格式：item-YYYYMMDD-HHMM-xxxx；确保唯一后再分享给买家。</div>
        </Field>
        <Field label="出售数量">
          <input type="number" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} required style={inputStyle} />
        </Field>
        <Field label="开始时间">
          <input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} required style={inputStyle} />
        </Field>
        <Field label="结束时间">
          <input type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} required style={inputStyle} />
        </Field>
        <Field label="最少竞拍数量">
          <input type="number" min="0" value={minBid} onChange={(e) => setMinBid(e.target.value)} required style={inputStyle} />
        </Field>
        <Field label="每单位起拍价">
          <input type="number" min="0" value={initPrice} onChange={(e) => setInitPrice(e.target.value)} required style={inputStyle} />
        </Field>
        <Field label="物品信息">
          <textarea value={itemInfo} onChange={(e) => setItemInfo(e.target.value)} rows={3} placeholder="标题/规格/描述等（必填）" required style={{ ...inputStyle, resize: "vertical" }} />
        </Field>
        <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
          <button disabled={loading} style={btnPrimary}>{loading ? "提交中..." : "创建"}</button>
        </div>
        {msg && <div style={{ color: msg.includes("成功") ? "#065f46" : "#b91c1c" }}>{msg}</div>}
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


