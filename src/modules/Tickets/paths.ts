import { paths } from '@/routes/paths';

export const ticketPaths = {
  root: paths.dashboard.trips.root,
  create: paths.dashboard.trips.create,
  details: (id: string) => `${paths.dashboard.trips.root}/${id}`,
  edit: (id: string) => `${paths.dashboard.trips.root}/${id}/edit`,
};
