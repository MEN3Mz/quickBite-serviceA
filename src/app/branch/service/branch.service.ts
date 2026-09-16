import { RestaurantNotFoundError } from "../../restaurant/errors.ts";
import { findRestaurantById } from "../../restaurant/repository/restaurant.repo.ts";
import { SystemRole } from "../../user/enums.ts";
import {
  CreateBranchDTO,
  UpdateBranchDTO,
  UpdateBranchStatusDTO,
} from "../dto/branch.dto.ts";
import { Currency } from "../enums.ts";
import { NoBranchesFoundError, UnAuthorizedError } from "../errors.ts";
import {
  findNearbyBranches,
  createBranch as create,
  getRestaurantBranches,
  findBranchById,
  updateBranch,
  updateBranchStatus,
} from "../repository/branch.repo.ts";

export class BranchService {
  findNearby = async (lat: number, lng: number) => {
    const rows = await findNearbyBranches(lat, lng);
    return rows;
  };

  createBranch = async (
    restaurantId: number,
    userId: number,
    userRole: SystemRole,
    data: CreateBranchDTO,
  ) => {
    const restaurant = await findRestaurantById(restaurantId);

    if (restaurant?.ownerId != userId && userRole != SystemRole.SYSTEM_ADMIN) {
      throw UnAuthorizedError;
    }
    const now = new Date();
    const branch = await create({
      restaurantId: restaurantId,
      label: data.label,
      countryCode: data.countryCode,
      lat: data.lat,
      lng: data.lng,
      addressText: data.addressText,
      opensAt: data.opensAt,
      closesAt: data.closesAt,
      currency: data.currency,
      acceptingOrders: true,
      deliveryRadius: data.deliveryRadius,
      comission: 0,
      isActive: false,
      createdAt: now,
      updatedAt: now,
    });
    return branch;
  };
  async getAllBranches(restaurantId: number) {
    const result = await getRestaurantBranches(restaurantId);
    if (!result) throw NoBranchesFoundError;
    return result;
  }

  update = async (
    branchId: number,
    userId: number,
    userRole: SystemRole,
    data: UpdateBranchDTO,
  ) => {
    const branch = await findBranchById(branchId);
    if (!branch) {
      throw NoBranchesFoundError;
    }

    const restaurant = await findRestaurantById(branch.restaurantId);
    if (!restaurant) throw RestaurantNotFoundError;
    if (
      userRole !== SystemRole.SYSTEM_ADMIN &&
      Number(restaurant.ownerId) !== Number(userId)
    ) {
      throw UnAuthorizedError;
    }

    return await updateBranch(branchId, data);
  };

  updateStatus = async (
    branchId: number,
    userRole: SystemRole,
    data: UpdateBranchStatusDTO,
  ) => {
    if (userRole !== SystemRole.SYSTEM_ADMIN) {
      throw UnAuthorizedError;
    }

    const branch = await findBranchById(branchId);
    if (!branch) {
      throw NoBranchesFoundError;
    }

    return await updateBranchStatus(branchId, data);
  };
}

export const branchService = new BranchService();
