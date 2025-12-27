// ==================================================
// ===== 管理者・テスト用 =====
// ==================================================

// 状態を初期化（最初に一度だけ手動実行）
function initStatus() {
  PropertiesService
    .getScriptProperties()
    .setProperty('status', 'CSV未読込');
}
// 完全リセット用
function resetTestStatus() {
  PropertiesService
    .getScriptProperties()
    .deleteAllProperties();
}

// ==================================================
// ===== 業務フロー =====
// ==================================================

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


// ==================================================
// ===== 内部ユーティリティ =====
// ==================================================

function assertStatus(expected) {
  const current = PropertiesService
    .getScriptProperties()
    .getProperty('status');

  if (current !== expected) {
    throw new Error(
      `状態エラー: 期待=${expected}, 現在=${current}`
    );
  }
}

function setStatus(status) {
  PropertiesService
    .getScriptProperties()
    .setProperty('status', status);
}

function getRawCsvRows() {
  const sheet = SpreadsheetApp
    .getActive()
    .getSheetByName('RAW_CSV');

  if (!sheet) {
    throw new Error('RAW_CSV シートが存在しません');
  }

  return sheet.getDataRange().getValues();
}
