// ----------------------------------------------------------------------

export type IOrganizationFilterValue = string | string[];

export type IOrganizationFilters = {
  categories: string[];
  size: string;
  locations: string[];
  services: string[];
  partnershipTypes: string[];
};

export type IOrganizationContact = {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
};

export type IOrganizationCompany = {
  name: string;
  logo: string;
  phoneNumber: string;
  fullAddress: string;
};

export type IOrganizationFee = {
  type: string;
  price: number;
  negotiable: boolean;
};

export type IOrganizationItem = {
  id: string;
  category: string;
  title: string;
  content: string;
  publish: string;
  createdAt: Date;
  skills: string[];
  expiredDate: Date;
  totalViews: number;
  size: string;
  fee: IOrganizationFee;
  services: string[];
  locations: string[];
  company: IOrganizationCompany;
  partnershipTypes: string[];
  workingSchedule: string[];
  contacts: IOrganizationContact[];
};
