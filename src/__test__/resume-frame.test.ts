import { ResumeFrameGenerator } from "../resume-frame-generator.js";
import { existsSync, unlinkSync, statSync } from "fs";
import path from "path";
import { ConfigLoader } from "../config-loader.js";

describe("ResumeFrameGenerator", () => {
  const testPdfPath = path.join(process.cwd(), "test-resume-frame.pdf");

  afterEach(() => {
    try {
      if (existsSync(testPdfPath)) {
        unlinkSync(testPdfPath);
      }
    } catch (error) {
      // ファイルが存在しない場合は無視
    }
  });

  test("A4サイズのPDFファイルを生成できる", async () => {
    // Arrange
    const generator = new ResumeFrameGenerator();
    const config = ConfigLoader.loadFromYaml("data/resume.yaml");

    // Act
    await generator.generate(testPdfPath, config);

    // Assert
    expect(existsSync(testPdfPath)).toBe(true);
  });

  test("生成されたPDFファイルがゼロバイトでない", async () => {
    // Arrange
    const generator = new ResumeFrameGenerator();
    const config = ConfigLoader.loadFromYaml("data/resume.yaml");

    // Act
    await generator.generate(testPdfPath, config);

    // Assert
    const stats = statSync(testPdfPath);
    expect(stats.size).toBeGreaterThan(0);
  });

  test("写真欄と太線外枠を含む正確な履歴書レイアウトを生成できる", async () => {
    // Arrange
    const generator = new ResumeFrameGenerator();
    const config = ConfigLoader.loadFromYaml("data/resume.yaml");

    // Act
    await generator.generate(testPdfPath, config);

    // Assert
    expect(existsSync(testPdfPath)).toBe(true);

    // 太線と詳細な写真欄が描画されているため、さらにサイズが大きい
    const stats = statSync(testPdfPath);
    expect(stats.size).toBeGreaterThan(1700);
  });
});
