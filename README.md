# ComfyClub 非公式Wiki — Demo

AI補正画像を使用したデモ版。非公式のファンサイトです。
静的HTML/CSS/JSのため、ビルドやnpmは不要です。

## GitHub Pages

このZIPの中身をリポジトリ直下へアップロード。
Settings → Pages → Source: Deploy from a branch → Branch: main → /(root) → Save。
.nojekyllは静的ファイルをそのまま公開するためのファイルです。

下部ナビ: アイテム／イベント／Wiki。テーマ切替は独立ボタン。

## 動作・表示

- `theme-init.js`でCSS読み込み前に初期テーマを適用します。
- JavaScriptが無効でも全アイテムとイベントを閲覧できます。検索・種類フィルター・テーマ切替はJavaScript初期化後に有効になります。
- アイテム画像は最大640pxのWebPプレビューです。画面外の画像は遅延読み込みします。
- 画像寸法をHTMLに指定し、読み込み時のレイアウト変化を抑えています。
- イベントはTabキーで選択し、Enter／Spaceで開閉できます。
- `.gitignore`はMac・Windows・VS Code・ローカル設定に対応しています。
