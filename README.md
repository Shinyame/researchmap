# Researchmap Mirror for Hugo

独自のGitHub PagesにResearchmapの業績一覧のミラーサイトを構築するプロジェクトです。
連絡先情報を除外するサニタイズ処理は事前にローカル環境で行います。
本リポジトリでは純粋にレイアウト生成とデプロイのみを担当します。

## 構成
- **Hugo**: 静的サイトジェネレーター
- **Node.js**: ビルド前に `jsonl` をパースし、Hugo用のカテゴリ別 `json` に変換するスクリプト

## 運用手順（デプロイの流れ）

1. **データのエクスポート**
   Researchmap本家から業績データ（初期項目のまま）を `.jsonl` 形式でエクスポートします。
2. **データのサニタイズ (ローカル処理)**
   別途用意した「JSONL Sanitizer」アプリでエクスポートしたファイルを選択します。
   `contact_point` を削除した安全な `researchmap.jsonl` がダウンロードされます。
3. **リポジトリへの配置とPush**
   ダウンロードしたファイルを本リポジトリの `data/researchmap.jsonl` として配置・上書き保存し、GitHubの `main` ブランチへPushします。
4. **自動デプロイ**
   GitHub Actionsが自動的に動作し、データの構造変換からHugoのビルド、GitHub Pagesへのデプロイまでを完了させます。

## ローカル開発での確認方法
```bash
# 1. データの変換 (Hugo読み込み用のJSON構造へのパースとソート)
node scripts/parse_jsonl.js

# 2. ローカルサーバーの起動
hugo server -D
```
`http://localhost:1313/researchmap/` にアクセスして表示を確認します。
