# 📄 Resume PDF CLI

**日本の履歴書を簡単に生成できるCLIツール**

YAMLファイルから美しい履歴書PDFを自動生成します。JIS規格に準拠したレイアウトで、プロフェッショナルな履歴書を作成できます。

## ✨ 特徴

- 📝 **YAML設定**: シンプルなYAMLファイルで履歴書情報を管理
- 🖼️ **写真対応**: 証明写真を自動配置
- 📐 **JIS規格準拠**: 日本の標準的な履歴書レイアウト
- ⚡ **高速生成**: コマンド一発でPDF出力
- 🔧 **カスタマイズ可能**: 出力先やファイル名を自由に指定

## 🚀 クイックスタート

### npxで即座に実行

```bash
npx resume-pdf-cli generate
```

### グローバルインストール

```bash
npm install -g resume-pdf-cli
resume-pdf generate
```

## 📖 使い方

### 基本的な使用方法

```bash
# デフォルト設定で生成
resume-pdf generate

# カスタムファイルを指定
resume-pdf generate -i my-resume.yaml -m my-photo.jpg -o my-resume.pdf
```

### オプション

| オプション | 短縮形 | 説明 | デフォルト値 |
|-----------|--------|------|-------------|
| `--input` | `-i` | 設定YAMLファイルのパス | `data/resume.yaml` |
| `--image` | `-m` | 履歴書用画像のパス | `data/photo.png` |
| `--output` | `-o` | 出力PDFファイルのパス | `resume.pdf` |
| `--help` | `-h` | ヘルプを表示 | - |

### 設定ファイルの例

`data/resume.yaml`ファイルを作成して、あなたの情報を入力してください：

```yaml
# 個人情報
personal:
  name: 佐藤 太郎
  ruby: さとう 太郎
  birth_day: 1995-03-15
  gender: 男
  email: sato.taro@example.com
  phone: 080-9876-5432
  address:
    zip: 150-0001
    value_ruby: とうきょうとしぶやくじんぐうまえ
    value: 東京都渋谷区神宮前1-2-3 ABCマンション101号
    phone: 080-9876-5432
    fax: 03-9876-5432
  contact:
    zip: 150-0001
    value_ruby: とうきょうとしぶやくじんぐうまえ
    value: 東京都渋谷区神宮前1-2-3 ABCマンション101号
    phone: 080-9876-5432
    fax: 03-9876-5432

# 学歴
education:
  - year: 2011
    month: 4
    value: 〇〇県立△△高等学校 入学
  - year: 2014
    month: 3
    value: 同 卒業
  - year: 2014
    month: 4
    value: ××大学 情報学部 入学
  - year: 2018
    month: 3
    value: 同 卒業

# 職歴
experience:
  - year: 2018
    month: 4
    value: 株式会社テクノロジー 入社
  - year: 2021
    month: 6
    value: 同社 開発部 異動
  - year: 2023
    month: 12
    value: 同社 退職
  - year: 2024
    month: 1
    value: 現在に至る

# 免許・資格
licences:
  - year: 2013
    month: 8
    value: 普通自動車第一種運転免許 取得
  - year: 2019
    month: 5
    value: 基本情報技術者試験 合格
  - year: 2022
    month: 11
    value: TOEIC 850点 取得

# 通勤時間
commuting_time: 45分

# 扶養家族数(配偶者を除く)
dependents: 無

# 配偶者の有無
spouse: 無

# 配偶者の扶養義務
supporting_spouse: 無

# 趣味
hobby: |
  プログラミングと読書が趣味です。
  週末は技術書を読んだり、個人プロジェクトの開発をしています。
  また、登山も好きで月に1回は山に登っています。

# 志望動機
motivation: |
  貴社のエンジニア職に応募させていただきました。
  前職で培ったWebアプリケーション開発の経験を活かし、
  より多くのユーザーに価値を提供できるサービス開発に携わりたいと考えております。

# 本人希望記入欄
request: |
  勤務地については都内希望です。
  その他の条件については面接時にご相談させていただければと思います。
```

## 📁 ファイル構成

```
your-project/
├── data/
│   ├── resume.yaml      # 履歴書データ
│   └── photo.png        # 証明写真
└── resume.pdf           # 生成されたPDF
```

## 🛠️ 開発者向け情報

### ローカルでの開発

```bash
# リポジトリをクローン
git clone https://github.com/your-username/resume-pdf-cli
cd resume-pdf-cli

# 依存関係をインストール
npm install

# 開発モードで実行
npm run dev

# ビルド
npm run build

# テスト実行
npm test
```

### 技術スタック

- **TypeScript**: 型安全な開発
- **PDFKit**: PDF生成エンジン
- **Commander.js**: CLI framework
- **js-yaml**: YAML設定ファイル解析
- **Jest**: テストフレームワーク

## 📝 ライセンス

MIT License

## 🤝 コントリビューション

プルリクエストや Issue の報告を歓迎します！

---

**💡 Tip**: 初回実行時は `data/` フォルダに `resume.yaml` と `photo.png` を配置してください。