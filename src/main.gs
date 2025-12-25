function runImportCsv()
function runNormalizeAndDistribute()
function runGenerateDetails()
function runGenerateSummary()
function runExportPdf()

function runImportCsv() {
  assertStatus('CSV未読込');
  CsvImporter.import();
  setStatus('CSV取込済');
}
