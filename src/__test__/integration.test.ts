import { writeFileSync, unlinkSync, existsSync, statSync } from "fs";
import path from "path";
import { generateResume } from "../cli/commands/generate";

describe("End-to-End Integration Test", () => {
  const testYamlPath = path.join(__dirname, "e2e-test.yaml");
  const testPdfPath = path.join(__dirname, "e2e-output.pdf");

  afterEach(() => {
    [testYamlPath, testPdfPath].forEach((filePath) => {
      try {
        unlinkSync(filePath);
      } catch (error) {
        // ignore
      }
    });
  });

  test("CLIコマンド経由で正確なフォーマットの履歴書を生成", async () => {
    const completeResumeYaml = `
personal_info:
  name:
    kanji: "統合テスト 太郎"
    furigana: "とうごうてすと たろう"
  birth_date: "1988-12-25"
  age: 36
  gender: "男"
  address: "〒100-8111 東京都千代田区千代田1-1-1"
  phone: "090-1111-2222"
  email: "integration@test.co.jp"

education:
  - date: "2007-04"
    type: "入学"
    institution: "統合テスト大学工学部情報工学科"
  - date: "2011-03"
    type: "卒業"
    institution: "同"

work_experience:
  - date: "2011-04"
    type: "入社"
    company: "統合テスト株式会社"
    detail: "システム開発部配属"
  - date: "2015-03"
    type: "退職"
    company: "統合テスト株式会社"
    detail: ""
  - date: "2015-04"
    type: "入社"
    company: "新統合テスト株式会社"
    detail: "シニアエンジニア"
  - date: "現在"
    type: "在職中"
    company: ""

certifications:
  - date: "2010-05"
    name: "基本情報技術者試験 合格"
  - date: "2013-10"
    name: "応用情報技術者試験 合格"
  - date: "2016-03"
    name: "データベーススペシャリスト試験 合格"

additional_info:
  skills: |
    ・プログラミング言語：Java, Python, JavaScript, TypeScript
    ・フレームワーク：Spring Boot, React, Node.js
    ・データベース：MySQL, PostgreSQL, Oracle
    ・クラウド：AWS, GCP
    ・その他：Docker, Kubernetes, Git, Jenkins
    
    個人開発やOSS活動も積極的に行っています。
    
  motivation: |
    貴社の先進的な技術取り組みと社会貢献性に強く魅力を感じ、
    これまでの豊富な開発経験と技術スキルを活かして、
    チーム開発の効率化と品質向上に貢献したいと考えております。
    
    特に、マイクロサービス架構設計やCI/CD導入における実務経験を
    貴社のプロダクト開発に活用できると確信しております。
    
  other: |
    勤務開始日：2025年4月1日から可能
    希望年収：応相談
    その他：リモートワーク対応可能
`;

    writeFileSync(testYamlPath, completeResumeYaml, "utf8");

    // CLIコマンド実行
    await generateResume(testYamlPath, { output: testPdfPath });

    // 結果検証
    expect(existsSync(testPdfPath)).toBe(true);

    const stats = statSync(testPdfPath);
    expect(stats.size).toBeGreaterThan(5000); // 充実した内容なので5KB以上

    console.log(`✅ 統合テスト完了: ${testPdfPath} (${stats.size} bytes)`);
  });
});
