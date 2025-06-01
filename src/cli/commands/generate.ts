import { PDFGenerator } from "../../core/pdf-generator";
import { ResumeValidator } from "../../core/validator";
import chalk from "chalk";

export async function generateResume(
  yamlFile: string,
  options: any
): Promise<void> {
  try {
    console.log(chalk.blue("📄 履歴書を生成中..."));

    // YAML検証
    const resumeData = ResumeValidator.validateYamlFile(yamlFile);

    // PDF生成
    const generator = new PDFGenerator();
    await generator.generateResume(resumeData, options.output);

    console.log(chalk.green(`✅ 履歴書が生成されました: ${options.output}`));
  } catch (error) {
    console.error(chalk.red("❌ 生成に失敗しました:"));
    console.error(chalk.red((error as Error).message));
    process.exit(1);
  }
}
