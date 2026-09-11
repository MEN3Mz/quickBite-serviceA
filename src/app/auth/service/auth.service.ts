import {
  ForgetPasswordDTO,
  LoginDTO,
  RegisterDTO,
  ResetPasswordDTO,
} from "../dto/auth.dto.ts";
import {
  findUserByEmail,
  findUserExistsByEmailOrPhoneNumber,
} from "../../user/repository/user.repo.ts";
import {
  UserAlreadyExistsError,
  CannotRegisterAsAdminError,
  InvalidCredentialsError,
  InvalidOTPError,
  RestaurantDataRequiredError,
} from "../errors.ts";
import { createUser } from "../../user/repository/user.repo.ts";
import { comparePassword, hashPassword } from "../utils/hash.ts";
import { SystemRole, UserStatus } from "../../user/enums.ts";
import {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.ts";
import { generateOTP, hashOTP } from "../utils/crypto.ts";
import {
  createPasswordReset,
  findLatestPasswordResetByUserId,
  updatePasswordResetConsumedAt,
  updateUserPassword,
} from "../repository/auth.repo.ts";
import { logger } from "../../../common/logger/logger.ts";
import { PasswordReset } from "../entity/password-reset.entity.ts";
import { findUserById } from "../../user/repository/user.repo.ts";
import {
  RestaurantService,
  restaurantService,
} from "../../restaurants/service/restaurant.service.ts";
import { db } from "../../../common/db/knex.ts";
import { Knex } from "knex";
import { time } from "../../../common/time.ts";
export class AuthService {
  constructor(private readonly restaurantService: RestaurantService) {}

  async registerUser(data: RegisterDTO) {
    if (data.role == SystemRole.SYSTEM_ADMIN) {
      throw CannotRegisterAsAdminError; // throw error if user tries to register as admin
    }
    const existing: boolean = await findUserExistsByEmailOrPhoneNumber(
      data.email,
      data.phoneNumber,
    ); // check if user exists in db
    if (existing) {
      throw UserAlreadyExistsError; // throw error if user exists
    }
    const hashedPassword = await hashPassword(data.password);
    const now = new Date();
    const trx = await db.transaction();
    let user;
    let restaurant;

    try {
      user = await createUser(
        {
          email: data.email,
          phoneNumber: data.phoneNumber,
          passwordHash: hashedPassword,
          name: data.name,
          systemRole: data.role, // default role
          status: UserStatus.INACTIVE, // default status
          createdAt: now,
          updatedAt: now,
          deletedAt: null,
        },
        trx,
      );

      if (data.role === SystemRole.RESTAURANT_USER) {
        if (data.restaurant === undefined) throw RestaurantDataRequiredError;
        restaurant = await this.restaurantService.createRestaurant(
          user.id,
          data.restaurant,
          trx,
        );
      }
      await trx.commit();
    } catch (err) {
      await trx.rollback();
      throw err;
    }
    const payload = {
      email: user!.email,
      userId: user!.id,
      role: user!.systemRole,
    };
    const accessToken = createAccessToken(payload);
    const refreshToken = createRefreshToken(payload);

    return {
      message: "Successfully Registered user",
      accessToken,
      refreshToken,
      user: {
        id: user!.id,
        email: user!.email,
        phoneNumber: user!.phoneNumber,
        name: user!.name,
        systemRole: user!.systemRole,
      },
      restaurant,
    };
  }
  async loginUser(data: LoginDTO) {
    const user = await findUserByEmail(data.email);
    if (!user) {
      throw InvalidCredentialsError;
    }
    const isCorrectPassword = await comparePassword(
      data.password,
      user.passwordHash,
    );
    if (!isCorrectPassword) throw InvalidCredentialsError;
    const payload = {
      email: user.email,
      userId: user.id,
      role: user.systemRole,
    };
    const accessToken = createAccessToken(payload);
    const refreshToken = createRefreshToken(payload);
    return {
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        phoneNumber: user.phoneNumber,
        name: user.name,
        systemRole: user.systemRole,
      },
    };
  }
  async forgetPassword(data: ForgetPasswordDTO) {
    const nowDate = Date.now();
    const user = await findUserByEmail(data.email);
    if (!user) return;
    const otp = generateOTP();
    const hashedOTP = await hashOTP(otp);

    await createPasswordReset({
      userId: user.id,
      otpHash: hashedOTP,
      expiresAt: new Date(nowDate + time(1, "h")),
      createdAt: new Date(nowDate),
    });

    logger.info(`mocked email sent ${otp}`);
  }

  async resetPassword(data: ResetPasswordDTO) {
    const user = await findUserByEmail(data.email);
    if (!user) throw InvalidOTPError;
    const reset = await findLatestPasswordResetByUserId(user.id);
    if (!reset) {
      throw InvalidOTPError;
    }
    const otpHashed = hashOTP(data.otp);
    if (otpHashed != reset.otpHash || reset.isExpired()) throw InvalidOTPError;

    const newHashPassword = await hashPassword(data.newPassword);
    await updateUserPassword(user.id, newHashPassword);
    await updatePasswordResetConsumedAt(reset.id);
  }

  async refresh(refreshToken: string) {
    const payload = verifyRefreshToken(refreshToken);

    const user = await findUserById(payload.userId);

    if (!user) {
      throw InvalidCredentialsError;
    }

    const tokenPayload = {
      email: user.email,
      role: user.systemRole,
      userId: user.id,
    };

    return {
      accessToken: createAccessToken(tokenPayload),
      refreshToken: createRefreshToken(tokenPayload),
    };
  }
}

export const authService = new AuthService(restaurantService);
