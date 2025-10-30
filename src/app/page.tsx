"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [network, setNetwork] = useState<string>("");
  useEffect(() => {
    if (typeof window === "undefined") return;
    setNetwork("准备就绪");
  }, []);

  return (
    <div style={{ padding: 24, margin: "0 auto", maxWidth: 980 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span aria-hidden="true" style={{ fontSize: 28, lineHeight: 1 }}>〶</span>
        <h1 style={{ fontSize: 28, fontWeight: 600, margin: 0 }}>链上物品拍卖</h1>
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
        <Link href="/trade/new" style={btnStyle.primary}>发起拍卖</Link>
        <Link href="/trade/join" style={btnStyle.normal}>参与竞拍</Link>
        <Link href="/trade/finalize" style={btnStyle.normal}>结算成交</Link>
        <Link href="/wallet/withdraw" style={btnStyle.normal}>提现拍卖款</Link>
      </div>

      <div style={{ marginTop: 24, padding: 16, border: "1px solid #eee", borderRadius: 8 }}>
        <div style={{ fontSize: 14, color: "#888" }}>网路环境等状态:</div>
        <div style={{ marginTop: 4 }}>{network}</div>
      </div>

      <div style={{ marginTop: 24, display: "grid", gap: 16 }}>
        <div style={{ padding: 16, border: "1px solid #eee", borderRadius: 8 }}>
          <div style={{ fontSize: 16, fontWeight: 600 }}>卖家指引</div>
          <ol style={{ marginTop: 8, paddingLeft: 18, color: "#4b5563", lineHeight: 1.6 }}>
            <li>
              发起拍卖：点击 <Link href="/trade/new" style={{ color: "#0f766e" }}>发起拍卖</Link>，填写交易ID、拍卖物品数量、时间区间、最少竞拍量与每单位起拍价后提交。
            </li>
            <li>
              结算成交：拍卖结束后，点击 <Link href="/trade/finalize" style={{ color: "#0f766e" }}>结算成交</Link>，输入成交数量与需补差价，等待交易确认。
            </li>
            <li>
              提现拍卖款：点击 <Link href="/wallet/withdraw" style={{ color: "#0f766e" }}>提现拍卖款</Link>，将成交所得转入当前钱包。
            </li>
          </ol>
          <div style={{ marginTop: 8, fontSize: 12, color: "#6b7280" }}>提示：请确保已连接正确网络与卖家账户。</div>
          <div style={{ marginTop: 12, padding: 12, background: "#f9fafb", border: "1px dashed #e5e7eb", borderRadius: 8, color: "#4b5563" }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>关于交易ID</div>
            <ul style={{ marginTop: 6, paddingLeft: 18, lineHeight: 1.6 }}>
              <li>交易ID用于唯一标识一场拍卖，请避免与历史记录冲突。</li>
              <li>推荐格式：<span style={{ fontFamily: "monospace" }}>item-YYYYMMDD-HHMM-xxxx</span>（例：<span style={{ fontFamily: "monospace" }}>item-20251022-1830-ab12</span>）。</li>
              <li>在“发起拍卖”页可一键生成并复制该 ID，转发给买家。</li>
            </ul>
          </div>
        </div>

        <div style={{ padding: 16, border: "1px solid #eee", borderRadius: 8 }}>
          <div style={{ fontSize: 16, fontWeight: 600 }}>买家指引</div>
          <ol style={{ marginTop: 8, paddingLeft: 18, color: "#4b5563", lineHeight: 1.6 }}>
            <li>
              参与竞拍：点击 <Link href="/trade/join" style={{ color: "#0f766e" }}>参与竞拍</Link>，输入交易ID与保证金金额，可附加投标信息后提交。
            </li>
            <li>
              退回保证金：未中标或不再参与时，可在同页面点击“退回保证金”。
            </li>
          </ol>
          <div style={{ marginTop: 8, fontSize: 12, color: "#6b7280" }}>提示：保证金及出价信息受合约规则约束，请先确认拍卖细则与计价规则。</div>
        </div>

        <div style={{ padding: 16, border: "1px solid #eee", borderRadius: 8 }}>
          <div style={{ fontSize: 16, fontWeight: 600 }}>使用提示</div>
          <ul style={{ marginTop: 8, paddingLeft: 18, color: "#4b5563", lineHeight: 1.6 }}>
            <li>请在浏览器中安装并启用 MetaMask，首次操作会请求连接账户。</li>
            <li>金额/数量以合约单位为准；请与合约部署者确认计量标准。</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

const btnStyle = {
  primary: {
    padding: "10px 14px",
    background: "#0f766e",
    color: "#fff",
    borderRadius: 8,
    textDecoration: "none",
  },
  normal: {
    padding: "10px 14px",
    background: "#e5e7eb",
    color: "#111827",
    borderRadius: 8,
    textDecoration: "none",
  },
} as const;
