import { User } from "../entity/user.entity.ts";
import { db } from "../../../common/db/knex.ts";
import { Knex } from "knex";

const USER_COLUMNS = [
  "id",
  "name",
  "email",
  "phone_number",
  "password_hash",
  "system_role",
  "created_at",
  "updated_at",
  "deleted_at",
  "status",
];

function toEntity(raw: any): User {
  return new User({
    id: raw.id,
    email: raw.email,
    phoneNumber: raw.phone_number,
    passwordHash: raw.password_hash,
    systemRole: raw.system_role,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
    deletedAt: raw.deleted_at,
    status: raw.status,
    name: raw.name,
  });
}
export async function findUserByEmail(
  email: string,
): Promise<User | undefined> {
  const raw = await db("users")
    .select(USER_COLUMNS)
    .where("email", email)
    .whereNull("deleted_at")
    .first();
  if (!raw) return undefined;
  return toEntity(raw);
}
export async function findUserExistsByEmailOrPhoneNumber(
  email: string,
  phoneNumber: string,
): Promise<boolean> {
  const result = await db.raw(
    `SELECT EXISTS (
     SELECT 1
     FROM users
     WHERE (email = ? OR phone_number = ?)
       AND deleted_at IS NULL
   ) AS exists`,
    [email, phoneNumber],
  );

  return result.rows[0].exists;
}

export async function createUser(
  user: Partial<User>,
  conn: Knex = db,
): Promise<User> {
  const [raw] = await conn("users")
    .insert({
      email: user.email,
      name: user.name,
      phone_number: user.phoneNumber,
      password_hash: user.passwordHash,
      system_role: user.systemRole,
      status: user.status,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    })
    .returning(USER_COLUMNS);

  return toEntity(raw);
}

export async function findUserById(id: number): Promise<User | undefined> {
  const row = await db("users")
    .select(USER_COLUMNS)
    .where("id", id)
    .whereNull("deleted_at")
    .first();
  return row ? toEntity(row) : undefined;
}
export async function updateUser(
  id: number,
  newName?: string,
  newPhone?: string,
): Promise<User | undefined> {
  const updates: Record<string, string> = {};

  if (newName !== undefined) {
    updates.name = newName;
  }

  if (newPhone !== undefined) {
    updates.phone_number = newPhone;
  }

  const [row] = await db("users")
    .where("id", id)
    .whereNull("deleted_at")
    .update({ ...updates, updated_at: new Date() })
    .returning(USER_COLUMNS);

  return row ? toEntity(row) : undefined;
}
