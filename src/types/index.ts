export type DealStage = "Demo'd" | "Closing" | "Won" | "Lost";
export type Owner = "Hasan" | "Jared" | "Guillermo" | "Ricardo" | "Kamran";
export type Product = "Kayako" | "Influitive" | "Agents" | "CRMagic" | "Ephor";

export interface Deal {
  id: string;
  company: string;
  amount: number;
  raas: number;
  owner: Owner;
  product: Product;
  stage: DealStage;
  demo_date?: Date;
  summary?: string;
  updated_at: Date;
}

export interface ColumnStats {
  deals: number;
  arr: number;
  raas: number;
  forecastedArr: number;
  forecastedRaas: number;
}

export interface OwnerProfile {
  name: Owner;
  imageUrl?: string;
  deals: Deal[];
}

export interface ProductProfile {
  name: Product;
  imageUrl?: string;
  deals: Deal[];
}
