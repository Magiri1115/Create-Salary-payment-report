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
// ===== 内部ユーティリティ：データ取得・保存 =====
// ==================================================

/**
 * RAW_CSV シートから CSV 行データを取得
 */
function getRawCsvRows() {
  const sheet = SpreadsheetApp
    .getActive()
    .getSheetByName('RAW_CSV');

  if (!sheet) {
    throw new Error('RAW_CSV シートが存在しません');
  }

  const values = sheet.getDataRange().getValues();

  if (values.length <= 1) {
    throw new Error('RAW_CSV にデータがありません');
  }

  return values;
}

/**
 * 市区町村ごとに振り分けたデータを保存
 * @param {Object} grouped
 */
function saveGroupedData(grouped) {
  if (!grouped || typeof grouped !== 'object') {
    throw new Error('保存対象の groupedData が不正です');
  }

  PropertiesService
    .getScriptProperties()
    .setProperty(
      'GROUPED_DATA',
      JSON.stringify(grouped)
    );
}

/**
 * 保存済みの市区町村別データを読み込み
 * @returns {Object}
 */
function loadGroupedData() {
  const json = PropertiesService
    .getScriptProperties()
    .getProperty('GROUPED_DATA');

  if (!json) {
    throw new Error('GROUPED_DATA が未保存です');
  }

  return JSON.parse(json);
}

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
