import fs from "fs";
import path from "path";
import { randomUUID as nodeRandomUUID } from "crypto";
import { User, ListResult } from "../_types/user";

const users = new Map<string, User>();
const byWallet = new Map<string, string>(); // lowercased wallet -> id
const dataDir = path.join(process.cwd(), "tmp");
const dataFile = path.join(dataDir, "users.json");

let saveTimer: NodeJS.Timeout | null = null;

function scheduleSave() {
  if (saveTimer) return;
  saveTimer = setTimeout(() => {
    try {
      if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
      const payload = JSON.stringify(Array.from(users.values()), null, 2);
      fs.writeFileSync(dataFile, payload);
    } catch {
      // ignore disk errors for mock store
    } finally {
      saveTimer = null;
    }
  }, 300);
}

function loadOnce() {
  try {
    if (fs.existsSync(dataFile)) {
      const raw = fs.readFileSync(dataFile, "utf-8");
      const arr: User[] = JSON.parse(raw);
      users.clear();
      byWallet.clear();
      for (const u of arr) {
        users.set(u.id, u);
        byWallet.set(u.walletAddress.toLowerCase(), u.id);
      }
    }
  } catch {
    // ignore
  }
}

loadOnce();

export function listUsers(params: { wallet?: string; limit?: number; offset?: number }): ListResult<User> {
  const { wallet, limit = 20, offset = 0 } = params;
  const wl = wallet?.toLowerCase();
  let arr = Array.from(users.values());
  if (wl) arr = arr.filter((u) => u.walletAddress.toLowerCase() === wl);
  const total = arr.length;
  const items = arr.slice(offset, offset + limit);
  return { items, total };
}

export function getUserById(id: string): User | undefined {
  return users.get(id);
}

export function findUserByWallet(wallet: string): User | undefined {
  const id = byWallet.get(wallet.toLowerCase());
  return id ? users.get(id) : undefined;
}

export function createUser(input: { walletAddress: string }): User {
  function generateId(): string {
    const g = (globalThis as unknown as { crypto?: Crypto }).crypto;
    if (g && typeof g.randomUUID === "function") return g.randomUUID();
    return nodeRandomUUID();
  }
  const id = generateId();
  const now = Date.now();
  const user: User = {
    id,
    walletAddress: input.walletAddress,
    createdAt: now,
    updatedAt: now,
  };
  users.set(id, user);
  byWallet.set(user.walletAddress.toLowerCase(), id);
  scheduleSave();
  return user;
}

export function deleteUser(id: string): boolean {
  const u = users.get(id);
  if (!u) return false;
  users.delete(id);
  byWallet.delete(u.walletAddress.toLowerCase());
  scheduleSave();
  return true;
}

