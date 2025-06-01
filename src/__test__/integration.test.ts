import { ResumeValidator } from "../core/validator";
import { PDFGenerator } from "../core/pdf-generator";
import { writeFileSync, unlinkSync, existsSync } from "fs";
import path from "path";

describe("Integration Tests", () => {
  const testYamlPath = path.join(__dirname, "integration-test.yaml");
  const testPdfPath = path.join(__dirname, "integration-output.pdf");

  afterEach(() => {
    // テストファイルのクリーンアップ
    [testYamlPath, testPdfPath].forEach((filePath) => {
      try {
        unlinkSync(filePath);
      } catch (error) {
        // ファイルが存在しない場合は無視
      }
    });
  });

  test("YAML読み込みからPDF生成まで正常に動作する", async () => {
    const completeYaml = `
personal_info:
  name:
    kanji: "統合テスト 太郎"
    furigana: "とうごうてすと たろう"
  birth_date: "1985-12-25"
  address: "東京都新宿区西新宿1-1-1"
  phone: "090-9876-5432"
  email: "integration@test.com"

education:
  - date: "2004-04"
    type: "入学"
    institution: "統合テスト大学工学部"
  - date: "2008-03"
    type: "卒業"
    institution: "統合テスト大学工学部"

work_experience:
  - date: "2008-04"
    type: "入社"
    company: "統合テスト株式会社"
    detail: "ソフトウェア開発"
  - date: "2015-03"
    type: "退職"
    company: "統合テスト株式会社"
  - date: "2015-04"
    type: "入社"
    company: "新統合テスト株式会社"
    detail: "シニアエンジニア・チームリード"
  - date: "現在"
    type: "在職中"
    company: ""
`;

    // 1. YAMLファイルを作成
    writeFileSync(testYamlPath, completeYaml, "utf8");

    // 2. YAMLを検証
    const resumeData = ResumeValidator.validateYamlFile(testYamlPath);

    // 3. PDFを生成
    const generator = new PDFGenerator();
    await generator.generateResume(resumeData, testPdfPath);

    // 4. 結果を検証
    expect(resumeData.personal_info.name.kanji).toBe("統合テスト 太郎");
    expect(resumeData.work_experience).toHaveLength(4);
    expect(existsSync(testPdfPath)).toBe(true);

    // PDFファイルサイズチェック
    const fs = require("fs");
    const stats = fs.statSync(testPdfPath);
    expect(stats.size).toBeGreaterThan(1000); // 最低1KB以上
  });
});
