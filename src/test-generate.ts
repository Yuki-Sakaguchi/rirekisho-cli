import { ResumeFrameGenerator } from "./resume-frame-generator.js";

async function main() {
  const generator = new ResumeFrameGenerator();
  const outputPath = "precise-resume-layout.pdf";

  try {
    await generator.generatePreciseResumeLayout(outputPath);
    console.log(
      `写真欄と太線外枠を含む正確な履歴書レイアウトPDFを生成しました: ${outputPath}`
    );
  } catch (error) {
    console.error("PDF生成エラー:", error);
  }
}

main();
