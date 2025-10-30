import { ok, fail } from "../../_utils/response";
import { deleteUser, getUserById } from "../../_store/users";


export async function GET(_req: Request, context: unknown) {
  const { id } = (context as { params: { id: string } }).params;
  const u = getUserById(id);
  if (!u) return fail("NOT_FOUND", "user not found", 404);
  return ok(u);
}

// No PATCH: simplified user model has no updatable fields

export async function DELETE(_req: Request, context: unknown) {
  const { id } = (context as { params: { id: string } }).params;
  const okDel = deleteUser(id);
  if (!okDel) return fail("NOT_FOUND", "user not found", 404);
  return ok({ ok: true });
}


