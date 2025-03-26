export type DealStage = "Demo'd" | "Closing" | "Won" | "Lost";
export type Owner = "Hasan" | "Jared" | "Guillermo" | "Ricardo" | "Kamran";
export type Product = "Kayako" | "Influitive" | "Agents" | "CRMagic" | "Ephor";

export interface Deal {
  id: string;
  name: string;
  amount: number;
  owner: Owner;
  product: Product;
  stage: DealStage;
  summary?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ColumnStats {
  deals: number;
  amount: number;
  forecast: number;
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
