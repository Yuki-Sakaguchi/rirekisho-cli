import * as yaml from "js-yaml";
import * as fs from "fs";
import { ResumeConfig } from "./types";

export class ConfigLoader {
  static loadFromYaml(filePath: string): ResumeConfig {
    try {
      const fileContents = fs.readFileSync(filePath, "utf8");
      return yaml.load(fileContents) as ResumeConfig;
    } catch (error) {
      throw new Error(`YAML読み込みエラー: ${error}`);
    }
  }
}
