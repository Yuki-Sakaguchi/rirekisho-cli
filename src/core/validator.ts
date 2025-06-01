import yaml from "js-yaml";
import { readFileSync } from "fs";
import { ResumeSchema, ResumeData } from "../schemas/resume-schema";

export class ResumeValidator {
  static validateYamlFile(filePath: string): ResumeData {
    try {
      const fileContent = readFileSync(filePath, "utf8");
      const yamlData = yaml.load(fileContent);
      return ResumeSchema.parse(yamlData);
    } catch (error: any) {
      if (error.name === "ZodError") {
        const errorMessage = error.errors
          .map((err: any) => `${err.path.join(".")}: ${err.message}`)
          .join("\n");
        throw new Error(`YAML validation error:\n${errorMessage}`);
      }
      throw error;
    }
  }
}
