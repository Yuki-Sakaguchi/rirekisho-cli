import { PDFGenerator } from "../core/pdf-generator";
import { ResumeValidator } from "../core/validator";
import { ResumeData } from "../schemas/resume-schema";
import { writeFileSync, existsSync, unlinkSync, statSync } from "fs";
import path from "path";

const testDir = path.join(process.cwd(), "src", "__test__");

describe("Accurate Resume Format", () => {
  const testYamlPath = path.join(testDir, "accurate-test.yaml");
  const testPdfPath = path.join(testDir, "accurate-output.pdf");

  afterEach(() => {
    [testYamlPath, testPdfPath].forEach((filePath) => {
      try {
        unlinkSync(filePath);
      } catch (error) {
        // ファイルが存在しない場合は無視
      }
    });
  });

  test("実際の履歴書フォーマットでPDFを生成する", async () => {
    const accurateYaml = `
personal_info:
  name:
    kanji: "テスト 太郎"
    furigana: "てすと たろう"
  birth_date: "1990-04-15"
  age: 34
  gender: "男"
  address: "〒123-4567 東京都渋谷区恵比寿1-2-3 テストマンション101"
  phone: "090-1234-5678"
  email: "test@example.com"
  landline: "03-1234-5678"
  fax: "03-1234-5679"

education:
  - date: "2009-04"
    type: "入学"
    institution: "テスト大学工学部"
  - date: "2013-03"
    type: "卒業"
    institution: "同"

work_experience:
  - date: "2013-04"
    type: "入社"
    company: "株式会社テストシステム"
    detail: ""
  - date: "2020-03"
    type: "退職"
    company: "株式会社テストシステム"
    detail: ""
  - date: "2020-04"
    type: "入社"
    company: "テストテクノロジー株式会社"
    detail: ""
  - date: "現在"
    type: "在職中"
    company: ""
    detail: ""

certifications:
  - date: "2015-05"
    name: "基本情報技術者試験 合格"
  - date: "2018-10"
    name: "応用情報技術者試験 合格"

additional_info:
  skills: |
    プログラミング（Java, Python, JavaScript）
    データベース設計・運用
    チーム開発・プロジェクト管理
    
  motivation: |
    貴社の技術力向上とサービス品質改善に
    これまでの開発経験を活かして貢献したいと考えております。
    
  other: |
    特にありません。
    
  commute_time: "45分"
  family_dependents: 0
  spouse: false
  spouse_support: false
`;

    writeFileSync(testYamlPath, accurateYaml, "utf8");

    // YAML検証
    const resumeData = ResumeValidator.validateYamlFile(testYamlPath);

    // PDF生成
    const generator = new PDFGenerator();
    await generator.generateResume(resumeData, testPdfPath);

    // ファイル存在確認
    expect(existsSync(testPdfPath)).toBe(true);

    // ファイルサイズ確認（2ページ分なのでより大きい）
    const stats = statSync(testPdfPath);
    expect(stats.size).toBeGreaterThan(3000); // 3KB以上

    // データ内容確認
    expect(resumeData.personal_info.name.kanji).toBe("テスト 太郎");
    expect(resumeData.education).toHaveLength(2);
    expect(resumeData.work_experience).toHaveLength(4);
    expect(resumeData.certifications).toHaveLength(2);
  });

  test("最小限のデータでも正確なフォーマットで生成できる", async () => {
    const minimalYaml = `
personal_info:
  name:
    kanji: "最小 太郎"
    furigana: "さいしょう たろう"
  birth_date: "1985-01-01"
  address: "〒100-0001 東京都千代田区"
  phone: "090-0000-0000"
  email: "minimal@test.com"

education:
  - date: "2004-04"
    type: "入学"
    institution: "最小大学"
  - date: "2008-03"
    type: "卒業"
    institution: "同"

work_experience:
  - date: "2008-04"
    type: "入社"
    company: "最小株式会社"
  - date: "現在"
    type: "在職中"
    company: ""

certifications: []
`;

    writeFileSync(testYamlPath, minimalYaml, "utf8");

    const resumeData = ResumeValidator.validateYamlFile(testYamlPath);
    const generator = new PDFGenerator();
    await generator.generateResume(resumeData, testPdfPath);

    expect(existsSync(testPdfPath)).toBe(true);
  });

  test("空の資格リストでもエラーにならない", async () => {
    const noSkillsData: ResumeData = {
      personal_info: {
        name: { kanji: "空資格 太郎", furigana: "からしかく たろう" },
        birth_date: "1990-01-01",
        address: "〒000-0000 テスト県テスト市",
        phone: "090-0000-0000",
        email: "test@example.com",
      },
      education: [],
      work_experience: [],
      certifications: [], // 空配列
    };

    const generator = new PDFGenerator();
    await generator.generateResume(noSkillsData, testPdfPath);

    expect(existsSync(testPdfPath)).toBe(true);
  });
});
