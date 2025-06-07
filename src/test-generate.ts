import { ResumeFrameGenerator } from "./resume-frame-generator.js";

async function main() {
  const generator = new ResumeFrameGenerator();
  const outputPath = "resume-layout.pdf";

  try {
    await generator.generateResumeLayout(outputPath);
    console.log(`履歴書レイアウトPDFを生成しました: ${outputPath}`);
  } catch (error) {
    console.error("PDF生成エラー:", error);
  }
}

main();
