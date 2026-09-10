export interface ChartDataPoint {
  year: string;
  primary: number;   // Dark grey bar (e.g. Enterprise Solutions / Models)
  secondary: number; // Lighter grey bar (e.g. Pipelines & Automation)
  subtitle?: string;
  [key: string]: string | number | undefined;
}

export const chartData: ChartDataPoint[] = [
  { year: 'Year 1', primary: 14, secondary: 7, subtitle: 'Foundations & BI Dashboards' },
  { year: 'Year 2', primary: 32, secondary: 18, subtitle: 'Scale & ETL Pipelines' },
  { year: 'Year 3', primary: 52, secondary: 34, subtitle: 'Enterprise Power Platform' },
];
