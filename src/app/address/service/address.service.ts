import {
  findAllCustomerAddresses,
  createAddress,
  findCustomerAddressById,
  updateCustomerAddress,
  deleteCustomerAddress,
} from "../repository/address.repo.ts";

import {
  AddressNotFoundError,
  InvalidAddressError,
} from "../errors.ts";
import { Address } from "../entity/address.entity.ts";

export class AddressService {
  async getById(
    addressId: number,
    userId: number,
  ): Promise<Address> {
    const address = await findCustomerAddressById(addressId, userId);
    if (!address) throw AddressNotFoundError;
    return address;
  }
  async getAllCustomerAddresses(userId: number): Promise<Address[]> {
    const addresses = await findAllCustomerAddresses(userId);

    return addresses;
  }
  async addCustomerAddress(userId: number, address: Partial<Address>) {
    const addedAddress = await createAddress({
      ...address,
      userId,
      isDefault: address.isDefault ?? false,
    });
    if (!addedAddress) throw InvalidAddressError;
    return addedAddress;
  }

  async updateAddress(
    userId: number,
    addressId: number,
    address: Partial<Address>,
  ) {
    const updatedAddress = await updateCustomerAddress(
      userId,
      addressId,
      address,
    );
    if (!updatedAddress) throw AddressNotFoundError;
    return updatedAddress;
  }
  async deleteAddress(userId: number, addressId: number) {
    const deletedAddress = await deleteCustomerAddress(userId, addressId);
    if (!deletedAddress) throw AddressNotFoundError;
    return deletedAddress;
  }
}

export const addressService = new AddressService();
