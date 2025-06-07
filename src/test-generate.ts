import { ResumeFrameGenerator } from "./resume-frame-generator.js";

async function main() {
  const generator = new ResumeFrameGenerator();
  const outputPath = "accurate-resume-layout.pdf";

  try {
    await generator.generateAccurateResumeLayout(outputPath);
    console.log(
      `添付画像に合わせた履歴書レイアウトPDFを生成しました: ${outputPath}`
    );
  } catch (error) {
    console.error("PDF生成エラー:", error);
  }
}

main();
