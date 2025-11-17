import type { RecordType, ConversionOptions } from "../types";

export const convertToLigaFormat = (
  record: RecordType,
  options: ConversionOptions
): string => {
  let card = `${record["Quantidade"]} ${record["Card (EN)"]} [QUALIDADE=${
    options.condition
  }] ${options.ignoreEdition ? "" : `[EDICAO=${record["Edicao (Sigla)"]}]`}`;

  if (record["Extras"]) {
    if (record["Extras"].split(",").length) {
      card += ` [EXTRAS=${record["Extras"]}]`;
    }
  }

  return card;
};

export const convertRecordsToLigaFormat = (
  records: RecordType[],
  options: ConversionOptions
): string => {
  const ligaRecords = records.map((record) =>
    convertToLigaFormat(record, options)
  );
  return ligaRecords.join("\n");
};
