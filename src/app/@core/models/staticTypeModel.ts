export interface TypeModel {
  id: number;
  title: string;
  className: string;
  count: number;
  amount: number;
  total: number;
}

export interface WorkFlowGasAppliances {
  gasAppliancesType: TypeModel[];
}