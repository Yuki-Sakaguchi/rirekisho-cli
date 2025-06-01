# 修正手順とトラブルシューティング

## 🔧 修正の適用手順

### 1. 既存ファイルの更新
```bash
# 既存プロジェクトがある場合
cd resume-cli-mvp

# package.jsonを更新
# - "type": "module" を追加
# - テストスクリプトを更新

# 設定ファイルを更新
# - tsconfig.json (module: "ESNext")
# - jest.config.js (ES Module対応)
```

### 2. ソースコードの更新
```bash
# 全てのimport文に .js 拡張子を追加
# 例: import { ResumeValidator } from '../core/validator.js';

# src/core/pdf-generator.ts を完全に置き換え
# - 日本語対応
# - 履歴書レイアウト修正

# src/schemas/resume-schema.ts に certifications を追加
```

### 3. 依存関係の再インストール
```bash
npm install
```

### 4. テスト実行
```bash
# Jest を使用
npm run test:jest

# または Node.js 組み込みテストランナー
npm test
```

### 5. 動作確認
```bash
# サンプルYAMLで履歴書生成
npm run dev generate sample-resume.yaml

# 生成されたPDFを確認
open resume.pdf  # macOS
start resume.pdf # Windows
xdg-open resume.pdf # Linux
```

## 🐛 トラブルシューティング

### ES Module エラーが続く場合

**エラー**: `Cannot use import statement outside a module`

**解決策**:
1. `package.json` に `"type": "module"` があることを確認
2. 全ての import 文で `.js` 拡張子を使用
3. `__dirname` の代わりに以下を使用:
```typescript
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
```

### 日本語フォントの問題

**症状**: 日本語が豆腐（□）になる、文字化けする

**解決策**:
1. システムフォントの確認
```bash
# macOS
fc-list | grep -i "hiragino\|noto"

# Windows
dir C:\Windows\Fonts | findstr /i "gothic\|ming"
```

2. フォントファイルの配置（推奨）
```bash
mkdir fonts
# Noto Sans CJK フォントをダウンロードして配置
# https://fonts.google.com/noto/specimen/Noto+Sans+JP
```

3. PDFGeneratorのフォント設定を確認

### PDFレイアウトの問題

**症状**: テーブルが正しく表示されない、枠線がずれる

**確認ポイント**:
1. ページサイズ設定（A4: 595.28 x 841.89 points）
2. マージン設定の一貫性
3. 文字列の長さによる改行処理

### テストが失敗する場合

**Jest設定の確認**:
```javascript
// jest.config.js が正しく設定されているか
export default {
  preset: 'ts-jest/presets/default-esm',
  extensionsToTreatAsEsm: ['.ts'],
  // ...
};
```

**ファイルパス問題**:
```typescript
// テストファイルで相対パスを正しく解決
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
```

## ✅ 確認チェックリスト

### Phase 1 MVP 完成確認

- [ ] `npm install` が成功する
- [ ] `npm run test:jest` が全てパスする
- [ ] `npm run dev generate sample-resume.yaml` が成功する
- [ ] 生成されたPDFに日本語が正しく表示される
- [ ] 履歴書の形式が適切（表形式、項目配置）
- [ ] エラーメッセージが適切に表示される

### 生成されたPDFの品質確認

- [ ] タイトル「履歴書」が中央に表示
- [ ] 氏名・ふりがなが適切に配置
- [ ] 写真枠が右上に表示
- [ ] 学歴・職歴が表形式で表示
- [ ] 資格情報が含まれている
- [ ] 日付が和暦で表示
- [ ] フォントが読みやすい

## 🚀 次のステップ

### Phase 1 完了後の拡張案

1. **写真対応** (Phase 2)
   - sharp ライブラリの追加
   - 画像リサイズ・配置機能

2. **CLI UX改善**
   - `init` コマンド追加
   - `validate` コマンド追加
   - プログレスバー表示

3. **テンプレート機能**
   - 複数の履歴書フォーマット
   - カスタムテンプレート機能

4. **配布準備**
   - npm package として公開
   - バイナリ配布対応

## 📞 サポート

### よくある質問

**Q: フォントが見つからないエラーが出る**
A: システムフォントの設定を確認し、必要に応じて Noto Sans CJK をダウンロード

**Q: PDFが空白になる**
A: YAML形式が正しいか `validate` コマンドで確認

**Q: テストが遅い**
A: PDF生成テストは時間がかかります。`--verbose` オプションで詳細確認

**Q: Windows で動作しない**
A: パスの区切り文字問題の可能性。`path.join()` を使用していることを確認