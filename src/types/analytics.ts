import { LucideIcon } from 'lucide-react';
import { ChartData, ChartOptions } from 'chart.js';

export interface AnalyticsData {
  date: string;
  sales: number;
  orders: number;
}

export interface Order {
  id: number;
  customer: string;
  items: string;
  total: number;
  date: string;
  status: string;
}

export interface DateRange {
  value: string;
  label: string;
}

export interface MetricCard {
  title: string;
  value: string | number;
  icon: LucideIcon;
}

export type SalesChartData = ChartData<'line'>;
export type OrdersChartData = ChartData<'bar'>;
export type ChartOptionsType = ChartOptions;
