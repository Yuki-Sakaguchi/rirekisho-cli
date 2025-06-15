# CLAUDE.md

このファイルは、Claude Code (claude.ai/code) がこのリポジトリで作業する際のガイダンスを提供します。

## プロジェクト概要

rirekisho-cli は日本の履歴書PDFを生成するCLIツールです。YAMLファイルからJIS規格準拠の履歴書レイアウトを作成し、npmパッケージとして公開されています。

## アーキテクチャ

### コアコンポーネント

- **ResumeFrameGenerator** (`src/resume-frame-generator.ts`) - PDFKitを使用した座標ベースの精密描画によるメインPDF生成エンジン
- **ConfigLoader** (`src/config-loader.ts`) - js-yamlを使用したYAML設定ファイルパーサー
- **CLI** (`src/cli.ts`) - Commander.jsベースのCLIインターフェース（実行可能なshebang付き）
- **Types** (`src/types/index.ts`) - 設定スキーマのTypeScriptインターフェース

### PDF生成アプローチ

PDFジェネレーターは、レイアウトエンジンではなく絶対位置指定と座標ベースの描画を使用します。主要な特徴：
- A4ページサイズ（595.28 × 841.89ポイント）、30ptマージン
- 2ページレイアウト：1ページ目に個人情報・履歴、2ページ目に資格・志望動機
- 日本語テキスト描画にNoto Serif JPフォントを使用
- 画像が見つからない場合のテキストプレースホルダー付き写真配置
- 精密なテーブルレイアウトを持つJIS準拠の履歴書構造

### データフロー

1. CLIがコマンド引数（入力YAML、画像、出力パス）を解析
2. ConfigLoaderがYAMLを読み込み、ResumeConfigインターフェースに対して検証
3. ResumeFrameGeneratorが座標ベースの描画でPDFを作成
4. PDFファイルとして出力

## 開発コマンド

```bash
# 依存関係のインストール
npm install

# 開発 - tsxで実行（ビルド不要）
npm run dev

# TypeScriptをdist/にビルド
npm run build

# テスト実行
npm test

# テストの監視モード
npm run test:watch

# サンプル履歴書の生成（デフォルトのdata/resume.yamlを使用）
npm run generate
```

## ファイル構造

- `src/` - TypeScriptソースコード
- `dist/` - コンパイル済みJavaScript出力（ビルドで作成）
- `fonts/` - 日本語テキスト用Noto Serif JPフォントファイル（Regular/Bold）
- `data/` - 開発・テスト用のサンプル設定と写真
- `example/` - 生成されたサンプルPDF出力

## テスト

Node.js環境でVitestを使用。テストで検証する項目：
- PDFファイル生成と非ゼロサイズ
- 座標検証によるレイアウト精度
- YAMLファイルからの設定読み込み

テストファイルは一時的なPDFを作成し、各テスト後に自動的にクリーンアップされます。

## フォント要件

日本語テキスト描画には`fonts/`ディレクトリのNoto Serif JPフォントが必要です。これらはnpmパッケージ配布に含まれ、モジュールの場所からの絶対パス解決で参照されます。

## 設定スキーマ

YAMLファイルは以下のセクションを持つResumeConfigインターフェース構造に一致する必要があります：
- personal（氏名、住所、連絡先情報）
- education（学歴の時系列エントリー）
- experience（職歴）
- licences（資格・免許）
- その他のフィールド（通勤時間、扶養家族など）