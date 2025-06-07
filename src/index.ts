import { ResumeFrameGenerator } from "./resume-frame-generator.js";

async function main() {
  const generator = new ResumeFrameGenerator();
  const outputPath = "precise-resume-layout.pdf";

  try {
    await generator.generate(outputPath);
    console.log(`PDFを生成しました: ${outputPath}`);
  } catch (error) {
    console.error("PDF生成エラー:", error);
  }
}

main();
