export interface CustomerUpdateRequest {
  username?: string;
}

export interface Customer {
  id: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

export interface AddressRequest {
  addressToken: string;
  countryCode: string;
  label?: string;
  isDefault?: boolean;
}

export interface Address {
  id: string;
  customerId: string;
  label?: string;
  addressToken: string;
  countryCode: string;
  isDefault: boolean;
  createdAt: string;
}
