import {
  findUserById,
  updateUser as updateUserRepo,
} from "../repository/user.repo.ts";
import { UserNotFoundError } from "../errors.ts";

export class UserService {
  async getById(userId: number) {
    const user = await findUserById(userId);
    if (!user) throw UserNotFoundError;
    return {
      id: user.id,
      email: user.email,
      phoneNumber: user.phoneNumber,
      systemRole: user.systemRole,
      name: user.name,
    };
  }
  async update(userId: number, name?: string, phone?: string) {
    const user = await updateUserRepo(userId, name, phone);
    if (!user) throw UserNotFoundError;

    return {
      id: user.id,
      phoneNumber: user.phoneNumber,
      systemRole: user.systemRole,
      name: user.name,
    };
  }
}

export const userService = new UserService();
