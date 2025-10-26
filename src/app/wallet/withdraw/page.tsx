"use client";
import { useState } from "react";
import { getCarbonTraderContract } from "@/lib/contract";
import { getSigner } from "@/lib/web3";
import Link from "next/link";

export default function WithdrawPage() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function onWithdraw() {
    setMsg("");
    try {
      setLoading(true);
      const signer = await getSigner();
      const contract = getCarbonTraderContract(signer);
      const tx = await contract.withdrawAuctionAmount();
      await tx.wait();
      setMsg("提现成功");
    } catch (err: unknown) {
      const message =
        typeof err === "object" && err !== null && "message" in err
          ? String((err as { message: unknown }).message)
          : "提现失败";
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
      <h2 style={{ fontSize: 22, fontWeight: 600 }}>提现拍卖款</h2>
      <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
        <button onClick={onWithdraw} disabled={loading} style={btnPrimary}>{loading ? "处理中..." : "提现"}</button>
      </div>
      {msg && <div style={{ marginTop: 12, color: msg.includes("成功") ? "#065f46" : "#b91c1c" }}>{msg}</div>}
    </div>
  );
}

const btnPrimary: React.CSSProperties = {
  padding: "10px 14px",
  background: "#0f766e",
  color: "#fff",
  borderRadius: 8,
};


