#!/usr/bin/env node

import { ResumeFrameGenerator } from "./resume-frame-generator.js";
import { ConfigLoader } from "./config-loader.js";
import { program } from "commander";

program.name("resume-pdf").description("履歴書PDF生成CLI").version("0.1.0");

program
  .command("generate")
  .description("履歴書PDFを生成")
  .option("-i, --input <path>", "設定YAMLファイルのパス", "data/resume.yaml")
  .option("-m, --image <path>", "証明写真のパス", "data/photo.png")
  .option("-o, --output <path>", "出力PDFファイルのパス", "resume.pdf")
  .action(async (options) => {
    try {
      const config = ConfigLoader.loadFromYaml(options.input);
      const imagePath = options.image;
      const generator = new ResumeFrameGenerator();

      await generator.generate(options.output, config, imagePath);
      console.log(`PDFを生成しました: ${options.output}`);
    } catch (error) {
      console.error("PDF生成エラー:", error);
      process.exit(1);
    }
  });

program.parse();
