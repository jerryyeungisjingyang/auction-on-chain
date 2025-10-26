import { ethers, type Eip1193Provider } from "ethers";

type MaybeMetaMaskProvider = Eip1193Provider & { isMetaMask?: boolean };
type EthereumWindow = Window & {
  ethereum?: MaybeMetaMaskProvider & { providers?: ReadonlyArray<MaybeMetaMaskProvider> };
};

function isEip1193Provider(value: unknown): value is MaybeMetaMaskProvider {
  return typeof value === "object" && value !== null && "request" in value;
}

function pickMetaMaskProvider(): MaybeMetaMaskProvider | null {
  const w = window as EthereumWindow;
  const { ethereum } = w;
  if (!ethereum) return null;
  if (Array.isArray(ethereum.providers)) {
    const mm = ethereum.providers.find((p) => (p as MaybeMetaMaskProvider | undefined)?.isMetaMask);
    if (mm && isEip1193Provider(mm)) return mm;
  }
  if ((ethereum as MaybeMetaMaskProvider).isMetaMask && isEip1193Provider(ethereum)) return ethereum;
  if (isEip1193Provider(ethereum)) return ethereum;
  return null;
}

export function getBrowserProvider(): ethers.BrowserProvider {
  if (typeof window === "undefined") throw new Error("仅在浏览器环境可用");
  const metamask = pickMetaMaskProvider();
  if (!metamask) throw new Error("未检测到 MetaMask，请安装或启用 MetaMask 扩展");
  return new ethers.BrowserProvider(metamask);
}

export async function getSigner(): Promise<ethers.Signer> {
  const provider = getBrowserProvider();
  await provider.send("eth_requestAccounts", []);
  return await provider.getSigner();
}

export async function getChainId(): Promise<number> {
  const provider = getBrowserProvider();
  const network = await provider.getNetwork();
  return Number(network.chainId);
}


