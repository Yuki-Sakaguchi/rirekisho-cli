import PDFDocument from "pdfkit";
import { createWriteStream } from "fs";

export class ResumeFrameGenerator {
  private readonly pageWidth = 595.28; // A4 width in points
  private readonly pageHeight = 841.89; // A4 height in points
  private readonly margin = 20;

  async generateFrame(outputPath: string): Promise<void> {
    const doc = new PDFDocument({
      size: "A4",
      margins: {
        top: this.margin,
        bottom: this.margin,
        left: this.margin,
        right: this.margin,
      },
    });

    // PDF出力
    const stream = createWriteStream(outputPath);
    doc.pipe(stream);
    doc.end();

    return new Promise((resolve, reject) => {
      stream.on("finish", resolve);
      stream.on("error", reject);
    });
  }

  async generateResumeLayout(outputPath: string): Promise<void> {
    const doc = new PDFDocument({
      size: "A4",
      margins: {
        top: this.margin,
        bottom: this.margin,
        left: this.margin,
        right: this.margin,
      },
    });

    // 履歴書の枠線を描画
    this.drawResumeFrame(doc);

    // PDF出力
    const stream = createWriteStream(outputPath);
    doc.pipe(stream);
    doc.end();

    return new Promise((resolve, reject) => {
      stream.on("finish", resolve);
      stream.on("error", reject);
    });
  }

  private drawResumeFrame(doc: PDFKit.PDFDocument): void {
    const contentWidth = this.pageWidth - 2 * this.margin;
    const startX = this.margin;
    const startY = 60;

    // Page 1: 履歴書タイトル部分
    // タイトル「履歴書」の位置（上部中央）

    // Page 1: 個人情報セクション
    const personalInfoHeight = 180;
    doc.rect(startX, startY, contentWidth, personalInfoHeight).stroke();

    // 個人情報内の区切り線（横線）
    doc
      .moveTo(startX, startY + 40)
      .lineTo(startX + contentWidth, startY + 40)
      .stroke(); // 氏名欄下
    doc
      .moveTo(startX, startY + 80)
      .lineTo(startX + contentWidth, startY + 80)
      .stroke(); // 生年月日欄下
    doc
      .moveTo(startX, startY + 120)
      .lineTo(startX + contentWidth, startY + 120)
      .stroke(); // 連絡先欄下

    // 個人情報内の区切り線（縦線）
    doc
      .moveTo(startX + 100, startY)
      .lineTo(startX + 100, startY + personalInfoHeight)
      .stroke(); // ラベル列
    doc
      .moveTo(startX + contentWidth - 120, startY)
      .lineTo(startX + contentWidth - 120, startY + personalInfoHeight)
      .stroke(); // 写真欄

    // Page 1: 学歴・職歴セクション
    const educationWorkY = startY + personalInfoHeight + 20;
    const educationWorkHeight = 400;
    doc
      .rect(startX, educationWorkY, contentWidth, educationWorkHeight)
      .stroke();

    // 学歴・職歴の表ヘッダー
    doc
      .moveTo(startX, educationWorkY + 30)
      .lineTo(startX + contentWidth, educationWorkY + 30)
      .stroke();

    // 学歴・職歴の縦線
    doc
      .moveTo(startX + 60, educationWorkY)
      .lineTo(startX + 60, educationWorkY + educationWorkHeight)
      .stroke(); // 年列
    doc
      .moveTo(startX + 100, educationWorkY)
      .lineTo(startX + 100, educationWorkY + educationWorkHeight)
      .stroke(); // 月列

    // 学歴・職歴の行線（複数行）
    for (let i = 1; i <= 12; i++) {
      const y = educationWorkY + 30 + i * 30;
      if (y < educationWorkY + educationWorkHeight) {
        doc
          .moveTo(startX, y)
          .lineTo(startX + contentWidth, y)
          .stroke();
      }
    }
  }
}
