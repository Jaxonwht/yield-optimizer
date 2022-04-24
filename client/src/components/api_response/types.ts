export interface PoolInList {
  pool_name: string;
  tokens: string[] | null;
}

export interface OptimizerResult {
  solver_status: string;
  maximum_yield: number;
  allocation_ratios: Array<[string, number]>;
  estimated_standard_deviation: number;
}

export interface PoolInformation {
  loading: boolean;
  tokens?: string[];
  mean_yield?: number;
  standard_deviation?: number;
}
