export type IContactItem = {
  id: string;
  name: string;
  role: string;
  status: 'online' | 'busy' | 'offline' | string;
};
