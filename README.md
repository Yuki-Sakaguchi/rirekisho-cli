# Resume CLI MVP 開発手順

## 🚀 セットアップ

```bash
# 1. プロジェクト作成
mkdir resume-cli-mvp
cd resume-cli-mvp

# 2. package.json を配置して依存関係インストール
npm install

# 3. TypeScript設定ファイル配置
# - tsconfig.json
# - jest.config.js
# - .eslintrc.js

# 4. ソースコード配置
mkdir -p src/{cli,core,schemas,__tests__}
mkdir -p src/cli/commands
```

## 📁 ディレクトリ構成

```
resume-cli-mvp/
├── package.json
├── tsconfig.json
├── jest.config.js
├── .eslintrc.js
├── sample-resume.yaml           # テスト用
├── src/
│   ├── cli/
│   │   ├── index.ts
│   │   └── commands/
│   │       └── generate.ts
│   ├── core/
│   │   ├── validator.ts
│   │   └── pdf-generator.ts
│   ├── schemas/
│   │   └── resume-schema.ts
│   └── __tests__/
│       ├── validator.test.ts
│       ├── pdf-generator.test.ts
│       └── integration.test.ts
└── dist/                       # ビルド出力
```

## 🔨 開発フロー

### 1. 実装順序
```bash
# Step 1: スキーマ定義
# src/schemas/resume-schema.ts を実装

# Step 2: バリデーター
# src/core/validator.ts を実装
npm run test -- validator.test.ts

# Step 3: PDF生成
# src/core/pdf-generator.ts を実装
npm run test -- pdf-generator.test.ts

# Step 4: CLI
# src/cli/ を実装

# Step 5: 統合テスト
npm run test -- integration.test.ts
```

### 2. 開発コマンド
```bash
# 開発実行（TypeScript直接実行）
npm run dev generate sample-resume.yaml

# テスト実行
npm test
npm run test:watch  # ファイル変更監視

# ビルド
npm run build

# リント
npm run lint

# 本番実行
npm start generate sample-resume.yaml
```

## ✅ テスト戦略

### 単体テスト
- **validator.test.ts**: YAML検証ロジック
- **pdf-generator.test.ts**: PDF生成ロジック

### 統合テスト
- **integration.test.ts**: YAML → PDF 全体フロー

### テスト実行
```bash
# 全テスト実行
npm test

# カバレッジ付き
npm test -- --coverage

# 特定テストファイル
npm test validator.test.ts

# ウォッチモード
npm run test:watch
```

## 🎯 MVP 完成基準

- ✅ `resume generate sample-resume.yaml` が正常動作
- ✅ 生成されたPDFに基本情報が含まれている
- ✅ 全テストがパス
- ✅ エラーハンドリングが基本的に動作

## 🐛 デバッグのコツ

### 1. YAML検証エラー
```bash
# YAMLファイルの構文確認
npx js-yaml sample-resume.yaml
```

### 2. PDF生成確認
```bash
# 生成されたPDFを確認
open resume.pdf  # macOS
start resume.pdf # Windows
```

### 3. ログ出力
```typescript
// デバッグ用ログ追加
console.log('DEBUG:', JSON.stringify(data, null, 2));
```

## 📋 MVPチェックリスト

### 機能
- [ ] YAML読み込み
- [ ] スキーマ検証
- [ ] 基本的なPDF生成（氏名、住所、職歴、学歴）
- [ ] コマンドライン引数処理
- [ ] エラーメッセージ表示

### テスト
- [ ] バリデーターテスト
- [ ] PDF生成テスト
- [ ] 統合テスト
- [ ] テストカバレッジ > 70%

### 品質
- [ ] TypeScript型チェックパス
- [ ] ESLintエラー無し
- [ ] ビルド成功

## 🚀 次のPhaseに向けて

MVPが完成したら、以下を追加検討：

1. **機能拡張**
   - `init` コマンド（テンプレート生成）
   - `validate` コマンド
   - 写真対応

2. **UI/UX改善**
   - プログレスバー
   - 詳細なエラーメッセージ

3. **配布準備**
   - npm publish
   - GitHub Actions CI/CD