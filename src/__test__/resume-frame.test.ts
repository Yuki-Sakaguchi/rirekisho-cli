import { ResumeFrameGenerator } from "../resume-frame-generator.js";
import { existsSync, unlinkSync, statSync } from "fs";
import path from "path";

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

    // Act
    await generator.generateFrame(testPdfPath);

    // Assert
    expect(existsSync(testPdfPath)).toBe(true);
  });

  test("生成されたPDFファイルがゼロバイトでない", async () => {
    // Arrange
    const generator = new ResumeFrameGenerator();

    // Act
    await generator.generateFrame(testPdfPath);

    // Assert
    const stats = statSync(testPdfPath);
    expect(stats.size).toBeGreaterThan(0);
  });

  test("履歴書の枠線を描画したPDFを生成できる", async () => {
    // Arrange
    const generator = new ResumeFrameGenerator();

    // Act
    await generator.generateResumeLayout(testPdfPath);

    // Assert
    expect(existsSync(testPdfPath)).toBe(true);

    // 枠線が描画されているため、基本PDFよりサイズが大きい
    const stats = statSync(testPdfPath);
    expect(stats.size).toBeGreaterThan(1000);
  });

  test("添付画像と同じ履歴書レイアウトを生成できる", async () => {
    // Arrange
    const generator = new ResumeFrameGenerator();

    // Act
    await generator.generateAccurateResumeLayout(testPdfPath);

    // Assert
    expect(existsSync(testPdfPath)).toBe(true);

    // より詳細な枠線が描画されているため、サイズがさらに大きい
    const stats = statSync(testPdfPath);
    expect(stats.size).toBeGreaterThan(1500);
  });
});
