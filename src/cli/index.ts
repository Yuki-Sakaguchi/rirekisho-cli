#!/usr/bin/env node

import { Command } from "commander";
import { generateResume } from "./commands/generate";

const program = new Command();

program.name("resume-cli").description("履歴書生成CLI (MVP)").version("0.1.0");

program
  .command("generate")
  .description("履歴書を生成")
  .argument("<yaml-file>", "YAML設定ファイルのパス")
  .option("-o, --output <path>", "出力先パス", "./resume.pdf")
  .action(generateResume);

program.parse();
