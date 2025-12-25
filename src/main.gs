function runImportCsv() {
  assertStatus('CSV未読込');
  CsvImporter.import();
  setStatus('CSV取込済');
}

function runNormalizeAndDistribute() {
  assertStatus('CSV取込済');
  const rawRows = getRawCsvRows();
  const normalized = Normalizer.normalizeAll(rawRows);
  const grouped = Distributor.groupByMunicipality(normalized);
  saveGroupedData(grouped);
  setStatus('振り分け完了');
}

function runGenerateDetails() {
  assertStatus('振り分け完了');
  const grouped = loadGroupedData();
  DetailGenerator.generateAll(grouped);
  setStatus('帳票生成済');
}

function runGenerateSummary() {
  assertStatus('帳票生成済');
  const grouped = loadGroupedData();
  SummaryGenerator.generateAll(grouped);
}

function runExportPdf() {
  assertStatus('帳票生成済');
  PdfExporter.exportAll();
  setStatus('完了');
}
