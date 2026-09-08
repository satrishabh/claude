import { AppError } from '../../common/AppError';
import { CustomerRepository, AddressRepository, AddressRow } from './customer.repository';
import { Address, AddressRequest, Customer, CustomerUpdateRequest } from './customer.dto';

function toCustomer(row: { id: string; username: string; created_at: string; updated_at: string }): Customer {
  return {
    id: row.id,
    username: row.username,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toAddress(row: AddressRow): Address {
  return {
    id: row.id,
    customerId: row.customer_id,
    label: row.label ?? undefined,
    addressToken: row.address_token,
    countryCode: row.country_code,
    isDefault: row.is_default === 1,
    createdAt: row.created_at,
  };
}

export class CustomerService {
  private customerRepo: CustomerRepository;
  private addressRepo: AddressRepository;

  constructor() {
    this.customerRepo = new CustomerRepository();
    this.addressRepo = new AddressRepository();
  }

  getMe(customerId: string): Customer {
    const row = this.customerRepo.findById(customerId);
    if (!row) {
      throw new AppError(404, 'NOT_FOUND', 'Customer not found');
    }
    return toCustomer(row);
  }

  updateMe(customerId: string, dto: CustomerUpdateRequest): Customer {
    const row = this.customerRepo.findById(customerId);
    if (!row) {
      throw new AppError(404, 'NOT_FOUND', 'Customer not found');
    }

    if (dto.username && dto.username !== row.username) {
      const conflict = this.customerRepo.findByUsername(dto.username);
      if (conflict) {
        throw new AppError(409, 'CONFLICT', 'Username already taken');
      }
      const now = new Date().toISOString();
      this.customerRepo.updateUsername(customerId, dto.username, now);
      return toCustomer({ ...row, username: dto.username, updated_at: now });
    }

    return toCustomer(row);
  }

  getAddresses(customerId: string): Address[] {
    return this.addressRepo.findByCustomerId(customerId).map(toAddress);
  }

  addAddress(customerId: string, dto: AddressRequest): Address {
    const now = new Date().toISOString();

    if (dto.isDefault) {
      this.addressRepo.clearDefaults(customerId);
    }

    const row: AddressRow = {
      id: crypto.randomUUID(),
      customer_id: customerId,
      label: dto.label ?? null,
      address_token: dto.addressToken,
      country_code: dto.countryCode,
      is_default: dto.isDefault ? 1 : 0,
      created_at: now,
    };

    this.addressRepo.create(row);
    return toAddress(row);
  }

  updateAddress(customerId: string, addressId: string, dto: AddressRequest): Address {
    const existing = this.addressRepo.findById(addressId);
    if (!existing || existing.customer_id !== customerId) {
      throw new AppError(404, 'NOT_FOUND', `Address ${addressId} not found`);
    }

    if (dto.isDefault) {
      this.addressRepo.clearDefaults(customerId);
    }

    this.addressRepo.update(addressId, {
      label: dto.label ?? null,
      address_token: dto.addressToken,
      country_code: dto.countryCode,
      is_default: dto.isDefault ? 1 : 0,
    });

    return toAddress(this.addressRepo.findById(addressId)!);
  }

  deleteAddress(customerId: string, addressId: string): void {
    const existing = this.addressRepo.findById(addressId);
    if (!existing || existing.customer_id !== customerId) {
      throw new AppError(404, 'NOT_FOUND', `Address ${addressId} not found`);
    }
    this.addressRepo.delete(addressId);
  }
}
