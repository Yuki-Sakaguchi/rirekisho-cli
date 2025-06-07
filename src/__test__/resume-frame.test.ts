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
});
