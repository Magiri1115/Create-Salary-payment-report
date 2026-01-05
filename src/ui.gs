function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('給与支払報告書')
    .addItem('CSV取込', 'onMenuImportCsv')
    .addItem('正規化・振り分け', 'onMenuNormalize')
    .addItem('個人別明細書生成', 'onMenuGenerateDetail')
    .addItem('PDF出力', 'onMenuExportPdf')
    .addToUi();
}

function onMenuImportCsv() {
  runImportCsv();
}

function onMenuNormalize() {
  runNormalizeAndDistribute();
}

function onMenuGenerateDetail() {
  runGenerateDetails();
}

function onMenuExportPdf() {
  runExportPdf();
}
