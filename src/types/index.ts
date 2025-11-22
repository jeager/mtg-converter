import type { RcFile } from "antd/es/upload";

export type RecordType = {
  Quantidade: string;
  "Card (EN)": string;
  "Edicao (Sigla)": string;
  Extras?: string;
};

export type ConversionOptions = {
  condition: string;
  ignoreEdition: boolean;
  forceCondition: boolean;
};

export type FileData = {
  id: string;
  name: string;
  records: RecordType[];
  included: boolean;
  isRestored: boolean;
};

export interface EnhancedRcFile extends Omit<RcFile, 'uid'> {
  isRestored: boolean;
  // if not empty, it means it's a uploaded file
  uid: string;
  // if not empty, it mean it's a restored file
  id?: string;
}
