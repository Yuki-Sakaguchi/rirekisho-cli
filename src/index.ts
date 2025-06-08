import { ResumeFrameGenerator } from "./resume-frame-generator.js";
import { ConfigLoader } from "./config-loader.js";

async function main() {
  const config = ConfigLoader.loadFromYaml("data/resume.yaml");
  const generator = new ResumeFrameGenerator();
  const outputPath = "resume.pdf";
  const imagePath = "data/photo.png";

  try {
    await generator.generate(outputPath, config, imagePath);
    console.log(`PDFを生成しました: ${outputPath}`);
  } catch (error) {
    console.error("PDF生成エラー:", error);
  }
}

main();
