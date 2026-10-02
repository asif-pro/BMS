export type IChartSeriesItem = {
  name: string;
  type?: string;
  fill?: string;
  data: number[];
};

export type IRidershipChart = {
  labels: string[];
  series: IChartSeriesItem[];
};

export type ILabelValue = {
  label: string;
  value: number;
};

export type IFleetByBrandItem = {
  label: string;
  value: number;
  logo: string;
};

export type ITopDriverItem = {
  id: string;
  name: string;
  avatarUrl: string;
  route: string;
  trips: number;
  rating: number;
  revenue: number;
  rank: string;
};

export type ITopStaffItem = {
  id: string;
  name: string;
  avatarUrl: string;
  role: string;
  score: number;
};

export type ISalaryExpenseByRoleItem = {
  label: string;
  value: number;
  percent: number;
};

export type IFleetHealth = {
  categories: string[];
  series: { name: string; data: number[] }[];
};

export type ISparklines = {
  passengers: number[];
  revenue: number[];
  utilization: number[];
  onTime: number[];
};

export type IPayrollTrend = {
  categories: string[];
  series: { name: string; data: number[] }[];
};
