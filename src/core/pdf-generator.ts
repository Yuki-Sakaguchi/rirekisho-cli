import PDFDocument from "pdfkit";
import { createWriteStream } from "fs";
import { ResumeData } from "../schemas/resume-schema";

export class PDFGenerator {
  private doc: typeof PDFDocument;

  constructor() {
    this.doc = new PDFDocument({
      size: "A4",
      margins: { top: 50, bottom: 50, left: 50, right: 50 },
    });
  }

  async generateResume(data: ResumeData, outputPath: string): Promise<void> {
    // ヘッダー
    this.renderHeader();

    // 個人情報
    this.renderPersonalInfo(data.personal_info);

    // 学歴
    this.renderEducation(data.education);

    // 職歴
    this.renderWorkExperience(data.work_experience);

    // PDF出力
    const stream = createWriteStream(outputPath);
    this.doc.pipe(stream);
    this.doc.end();

    return new Promise((resolve, reject) => {
      stream.on("finish", resolve);
      stream.on("error", reject);
    });
  }

  private renderHeader(): void {
    this.doc.fontSize(20).text("履歴書", { align: "center" });
    this.doc.moveDown(2);
  }

  private renderPersonalInfo(personalInfo: any): void {
    this.doc.fontSize(14).text("個人情報", { underline: true });
    this.doc.moveDown(0.5);

    this.doc.fontSize(12);
    this.doc.text(
      `氏名: ${personalInfo.name.kanji} (${personalInfo.name.furigana})`
    );
    this.doc.text(`生年月日: ${this.formatDate(personalInfo.birth_date)}`);
    this.doc.text(`住所: ${personalInfo.address}`);
    this.doc.text(`電話番号: ${personalInfo.phone}`);
    this.doc.text(`メールアドレス: ${personalInfo.email}`);
    this.doc.moveDown(1);
  }

  private renderEducation(education: any[]): void {
    this.doc.fontSize(14).text("学歴", { underline: true });
    this.doc.moveDown(0.5);

    this.doc.fontSize(12);
    education.forEach((edu) => {
      this.doc.text(`${edu.date} ${edu.institution} ${edu.type}`);
    });
    this.doc.moveDown(1);
  }

  private renderWorkExperience(workExp: any[]): void {
    this.doc.fontSize(14).text("職歴", { underline: true });
    this.doc.moveDown(0.5);

    this.doc.fontSize(12);
    workExp.forEach((work) => {
      this.doc.text(`${work.date} ${work.company} ${work.type}`);
      if (work.detail) {
        this.doc.text(`    ${work.detail}`);
      }
    });
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  }
}
