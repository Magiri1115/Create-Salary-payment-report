# Create-Salary-payment-report
## ファイル構成
```
gas-payroll-report/
├─ src/
│  ├─ main.gs              // エントリーポイント
│  ├─ csvimporter.gs       // CSV取込
│  ├─ normalizer.gs        // データ正規化
│  ├─ distributor.gs      // 市区町村振り分け
│  ├─ detailGenerator.gs   // 個人別明細書
│  ├─ summaryGenerator.gs  // 総括表
│  ├─ pdfExporter.gs       // PDF出力
│  └─ ui.gs                // メニュー・ボタン
│
├─ appsscript.json         // マニフェスト
├─ .clasp.json             // GAS紐付け情報（git管理OK）
├─ .gitignore
└─ README.md
```