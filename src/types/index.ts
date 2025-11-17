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
