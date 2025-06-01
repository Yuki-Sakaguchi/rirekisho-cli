import { PDFGenerator } from "../core/pdf-generator";
import { ResumeData } from "../schemas/resume-schema";
import { existsSync, unlinkSync, statSync } from "fs";
import path from "path";

const testDir = path.join(process.cwd(), "src", "__test__");

describe("PDFGenerator", () => {
  const testPdfPath = path.join(testDir, "test-output.pdf");

  afterEach(() => {
    try {
      unlinkSync(testPdfPath);
    } catch (error) {
      // ファイルが存在しない場合は無視
    }
  });

  test("正常なデータでPDFを生成する", async () => {
    const testData: ResumeData = {
      personal_info: {
        name: {
          kanji: "テスト 太郎",
          furigana: "てすと たろう",
        },
        birth_date: "1990-01-01",
        address: "東京都新宿区西新宿1-1-1",
        phone: "090-1234-5678",
        email: "test@example.com",
      },
      education: [
        {
          date: "2009-04",
          type: "入学",
          institution: "テスト大学工学部",
        },
        {
          date: "2013-03",
          type: "卒業",
          institution: "テスト大学工学部",
        },
      ],
      work_experience: [
        {
          date: "2013-04",
          type: "入社",
          company: "テスト株式会社",
          detail: "Webアプリケーション開発",
        },
      ],
    };

    const generator = new PDFGenerator();
    await generator.generateResume(testData, testPdfPath);

    // PDFファイルが生成されたことを確認
    expect(existsSync(testPdfPath)).toBe(true);

    // ファイルサイズチェック
    const stats = statSync(testPdfPath);
    expect(stats.size).toBeGreaterThan(1000); // 1KB以上
  });

  test("最小限のデータでもPDFを生成できる", async () => {
    const minimalData: ResumeData = {
      personal_info: {
        name: {
          kanji: "最小 太郎",
          furigana: "さいしょう たろう",
        },
        birth_date: "1990-01-01",
        address: "東京都",
        phone: "090-0000-0000",
        email: "minimal@test.com",
      },
      education: [],
      work_experience: [],
    };

    const generator = new PDFGenerator();
    await generator.generateResume(minimalData, testPdfPath);

    expect(existsSync(testPdfPath)).toBe(true);
  });
});
