import { ResumeValidator } from "../core/validator";
import { writeFileSync, unlinkSync } from "fs";
import path from "path";

const testDir = path.join(process.cwd(), "src", "__test__");

describe("ResumeValidator", () => {
  const testYamlPath = path.join(testDir, "test-resume.yaml");

  afterEach(() => {
    try {
      unlinkSync(testYamlPath);
    } catch (error) {
      // ファイルが存在しない場合は無視
    }
  });

  test("正常なYAMLファイルを正しく検証する", () => {
    const validYaml = `
personal_info:
  name:
    kanji: "田中 太郎"
    furigana: "たなか たろう"
  birth_date: "1990-04-15"
  address: "東京都渋谷区恵比寿1-2-3"
  phone: "090-1234-5678"
  email: "test@example.com"

education:
  - date: "2009-04"
    type: "入学"
    institution: "テスト大学工学部"
  - date: "2013-03"
    type: "卒業"
    institution: "テスト大学工学部"

work_experience:
  - date: "2013-04"
    type: "入社"
    company: "テスト株式会社"
    detail: "ソフトウェア開発"
`;

    writeFileSync(testYamlPath, validYaml, "utf8");

    const result = ResumeValidator.validateYamlFile(testYamlPath);

    expect(result.personal_info.name.kanji).toBe("田中 太郎");
    expect(result.personal_info.email).toBe("test@example.com");
    expect(result.education).toHaveLength(2);
    expect(result.work_experience).toHaveLength(1);
  });

  test("必須フィールドが不足している場合エラーを投げる", () => {
    const invalidYaml = `
personal_info:
  name:
    kanji: "田中 太郎"
    # furigana が不足
  birth_date: "1990-04-15"
  address: "東京都渋谷区"
  phone: "090-1234-5678"
  email: "test@example.com"

education: []
work_experience: []
`;

    writeFileSync(testYamlPath, invalidYaml, "utf8");

    expect(() => {
      ResumeValidator.validateYamlFile(testYamlPath);
    }).toThrow();
  });
});
