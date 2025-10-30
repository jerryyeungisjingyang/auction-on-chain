import { ok, fail } from "../_utils/response";
import { ensureString, isEthAddress } from "../_utils/validate";
import { createUser, findUserByWallet, listUsers } from "../_store/users";


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const wallet = searchParams.get("wallet") || undefined;
  const limit = Number(searchParams.get("limit") || 20);
  const offset = Number(searchParams.get("offset") || 0);
  return ok(listUsers({ wallet, limit, offset }));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const walletAddress = ensureString(body.walletAddress, "walletAddress");
    if (!isEthAddress(walletAddress)) return fail("VALIDATION_ERROR", "walletAddress format invalid", 400);
    if (findUserByWallet(walletAddress)) return fail("CONFLICT", "wallet already registered", 409);

    const u = createUser({ walletAddress });
    return ok(u, 201);
  } catch (e: unknown) {
    const message =
      typeof e === "object" && e !== null && "message" in e
        ? String((e as { message: unknown }).message)
        : "invalid body";
    return fail("BAD_REQUEST", message, 400);
  }
}


