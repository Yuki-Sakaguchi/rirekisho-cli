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

  async generateAccurateResumeLayout(outputPath: string): Promise<void> {
    const doc = new PDFDocument({
      size: "A4",
      margins: {
        top: this.margin,
        bottom: this.margin,
        left: this.margin,
        right: this.margin,
      },
    });

    // 添付画像に正確に合わせた履歴書の枠線を描画
    this.drawAccurateResumeFrame(doc);

    // PDF出力
    const stream = createWriteStream(outputPath);
    doc.pipe(stream);
    doc.end();

    return new Promise((resolve, reject) => {
      stream.on("finish", resolve);
      stream.on("error", reject);
    });
  }

  async generatePreciseResumeLayout(outputPath: string): Promise<void> {
    const doc = new PDFDocument({
      size: "A4",
      margins: {
        top: this.margin,
        bottom: this.margin,
        left: this.margin,
        right: this.margin,
      },
    });

    // 写真欄と太線外枠を含む正確な履歴書の枠線を描画
    this.drawPreciseResumeFrame(doc);

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

  private drawAccurateResumeFrame(doc: PDFKit.PDFDocument): void {
    const contentWidth = this.pageWidth - 2 * this.margin;
    const startX = this.margin;

    // Page 1: 個人情報セクション（添付画像に合わせて調整）
    const personalInfoY = 80;
    const personalInfoHeight = 160;

    // 個人情報の外枠
    doc.rect(startX, personalInfoY, contentWidth, personalInfoHeight).stroke();

    // 個人情報の内部区切り線
    // 氏名行（ふりがな・氏名）
    doc
      .moveTo(startX, personalInfoY + 40)
      .lineTo(startX + contentWidth, personalInfoY + 40)
      .stroke();

    // 生年月日・性別行
    doc
      .moveTo(startX, personalInfoY + 80)
      .lineTo(startX + contentWidth, personalInfoY + 80)
      .stroke();

    // 連絡先行1（電話・メール）
    doc
      .moveTo(startX, personalInfoY + 120)
      .lineTo(startX + contentWidth, personalInfoY + 120)
      .stroke();

    // 住所行の区切り
    doc
      .moveTo(startX, personalInfoY + 140)
      .lineTo(startX + contentWidth, personalInfoY + 140)
      .stroke();

    // 縦線の区切り
    // ラベル列（ふりがな、氏名等のラベル部分）
    doc
      .moveTo(startX + 80, personalInfoY)
      .lineTo(startX + 80, personalInfoY + personalInfoHeight)
      .stroke();

    // 写真欄の区切り
    doc
      .moveTo(startX + contentWidth - 100, personalInfoY)
      .lineTo(startX + contentWidth - 100, personalInfoY + personalInfoHeight)
      .stroke();

    // 生年月日と性別の区切り
    doc
      .moveTo(startX + 300, personalInfoY + 40)
      .lineTo(startX + 300, personalInfoY + 80)
      .stroke();

    // 電話とメールの区切り
    doc
      .moveTo(startX + 200, personalInfoY + 80)
      .lineTo(startX + 200, personalInfoY + 120)
      .stroke();
    doc
      .moveTo(startX + 350, personalInfoY + 80)
      .lineTo(startX + 350, personalInfoY + 120)
      .stroke();

    // Page 1: 学歴・職歴セクション
    const educationWorkY = personalInfoY + personalInfoHeight + 20;
    const educationWorkHeight = 380;

    // 学歴・職歴の外枠
    doc
      .rect(startX, educationWorkY, contentWidth, educationWorkHeight)
      .stroke();

    // ヘッダー行（年・月・学歴・職歴（各項目ごとにまとめて書く））
    doc
      .moveTo(startX, educationWorkY + 25)
      .lineTo(startX + contentWidth, educationWorkY + 25)
      .stroke();

    // 縦線
    // 年列
    doc
      .moveTo(startX + 50, educationWorkY)
      .lineTo(startX + 50, educationWorkY + educationWorkHeight)
      .stroke();
    // 月列
    doc
      .moveTo(startX + 80, educationWorkY)
      .lineTo(startX + 80, educationWorkY + educationWorkHeight)
      .stroke();

    // 各行の横線（学歴・職歴の各項目）
    for (let i = 1; i <= 15; i++) {
      const y = educationWorkY + 25 + i * 23;
      if (y < educationWorkY + educationWorkHeight) {
        doc
          .moveTo(startX, y)
          .lineTo(startX + contentWidth, y)
          .stroke();
      }
    }

    // Page 2を追加
    doc.addPage();

    // Page 2: 資格・免許セクション
    const certificateY = 50;
    const certificateHeight = 120;

    doc.rect(startX, certificateY, contentWidth, certificateHeight).stroke();

    // 資格の表ヘッダー
    doc
      .moveTo(startX, certificateY + 25)
      .lineTo(startX + contentWidth, certificateY + 25)
      .stroke();

    // 資格の縦線
    doc
      .moveTo(startX + 50, certificateY)
      .lineTo(startX + 50, certificateY + certificateHeight)
      .stroke(); // 年
    doc
      .moveTo(startX + 80, certificateY)
      .lineTo(startX + 80, certificateY + certificateHeight)
      .stroke(); // 月

    // 資格の行線
    for (let i = 1; i <= 4; i++) {
      const y = certificateY + 25 + i * 23;
      if (y < certificateY + certificateHeight) {
        doc
          .moveTo(startX, y)
          .lineTo(startX + contentWidth, y)
          .stroke();
      }
    }

    // Page 2: 通勤時間・扶養家族等の情報セクション
    const infoY = certificateY + certificateHeight + 20;
    const infoHeight = 40;

    doc.rect(startX, infoY, contentWidth, infoHeight).stroke();

    // 4つの項目に分割
    doc
      .moveTo(startX + contentWidth / 4, infoY)
      .lineTo(startX + contentWidth / 4, infoY + infoHeight)
      .stroke();
    doc
      .moveTo(startX + contentWidth / 2, infoY)
      .lineTo(startX + contentWidth / 2, infoY + infoHeight)
      .stroke();
    doc
      .moveTo(startX + (3 * contentWidth) / 4, infoY)
      .lineTo(startX + (3 * contentWidth) / 4, infoY + infoHeight)
      .stroke();

    // Page 2: 趣味・特技セクション
    const hobbyY = infoY + infoHeight + 20;
    const hobbyHeight = 80;

    doc.rect(startX, hobbyY, contentWidth, hobbyHeight).stroke();

    // Page 2: 志望動機セクション
    const motivationY = hobbyY + hobbyHeight + 20;
    const motivationHeight = 120;

    doc.rect(startX, motivationY, contentWidth, motivationHeight).stroke();

    // Page 2: 本人希望記入欄
    const requestY = motivationY + motivationHeight + 20;
    const requestHeight = 80;

    doc.rect(startX, requestY, contentWidth, requestHeight).stroke();
  }

  private drawPreciseResumeFrame(doc: PDFKit.PDFDocument): void {
    const contentWidth = this.pageWidth - 2 * this.margin;
    const startX = this.margin;

    // Page 1: 個人情報セクション（写真欄を正確に配置）
    const personalInfoY = 80;
    const personalInfoHeight = 160;

    // 個人情報の外枠（太線）
    doc.lineWidth(2);
    doc.rect(startX, personalInfoY, contentWidth, personalInfoHeight).stroke();
    doc.lineWidth(1); // 通常線に戻す

    // 個人情報の内部区切り線
    // ふりがな行
    doc
      .moveTo(startX, personalInfoY + 20)
      .lineTo(startX + contentWidth - 120, personalInfoY + 20)
      .stroke();

    // 氏名行
    doc
      .moveTo(startX, personalInfoY + 40)
      .lineTo(startX + contentWidth - 120, personalInfoY + 40)
      .stroke();

    // 生年月日行
    doc
      .moveTo(startX, personalInfoY + 80)
      .lineTo(startX + contentWidth - 120, personalInfoY + 80)
      .stroke();

    // 連絡先行1（携帯電話・EMAIL）
    doc
      .moveTo(startX, personalInfoY + 100)
      .lineTo(startX + contentWidth - 120, personalInfoY + 100)
      .stroke();

    // 住所行1（ふりがな）
    doc
      .moveTo(startX, personalInfoY + 120)
      .lineTo(startX + contentWidth - 120, personalInfoY + 120)
      .stroke();

    // 住所行2（住所）
    doc
      .moveTo(startX, personalInfoY + 140)
      .lineTo(startX + contentWidth - 120, personalInfoY + 140)
      .stroke();

    // 縦線の区切り
    // ラベル列
    doc
      .moveTo(startX + 80, personalInfoY)
      .lineTo(startX + 80, personalInfoY + personalInfoHeight)
      .stroke();

    // 写真欄の区切り（右端から120pt）
    doc
      .moveTo(startX + contentWidth - 120, personalInfoY)
      .lineTo(startX + contentWidth - 120, personalInfoY + personalInfoHeight)
      .stroke();

    // 生年月日と性別の区切り
    doc
      .moveTo(startX + 300, personalInfoY + 40)
      .lineTo(startX + 300, personalInfoY + 80)
      .stroke();

    // 携帯電話とEMAILの区切り
    doc
      .moveTo(startX + 200, personalInfoY + 80)
      .lineTo(startX + 200, personalInfoY + 100)
      .stroke();
    doc
      .moveTo(startX + 320, personalInfoY + 80)
      .lineTo(startX + 320, personalInfoY + 100)
      .stroke();

    // 写真欄内の区切り線
    // 写真欄の上部（写真貼付位置）
    doc
      .moveTo(startX + contentWidth - 120, personalInfoY + 100)
      .lineTo(startX + contentWidth, personalInfoY + 100)
      .stroke();

    // 写真欄の中央（電話・FAX欄）
    doc
      .moveTo(startX + contentWidth - 120, personalInfoY + 120)
      .lineTo(startX + contentWidth, personalInfoY + 120)
      .stroke();
    doc
      .moveTo(startX + contentWidth - 120, personalInfoY + 140)
      .lineTo(startX + contentWidth, personalInfoY + 140)
      .stroke();

    // 写真欄内の縦線
    doc
      .moveTo(startX + contentWidth - 60, personalInfoY + 100)
      .lineTo(startX + contentWidth - 60, personalInfoY + personalInfoHeight)
      .stroke();

    // Page 1: 学歴・職歴セクション
    const educationWorkY = personalInfoY + personalInfoHeight + 20;
    const educationWorkHeight = 380;

    // 学歴・職歴の外枠（太線）
    doc.lineWidth(2);
    doc
      .rect(startX, educationWorkY, contentWidth, educationWorkHeight)
      .stroke();
    doc.lineWidth(1); // 通常線に戻す

    // ヘッダー行
    doc
      .moveTo(startX, educationWorkY + 25)
      .lineTo(startX + contentWidth, educationWorkY + 25)
      .stroke();

    // 縦線
    // 年列
    doc
      .moveTo(startX + 50, educationWorkY)
      .lineTo(startX + 50, educationWorkY + educationWorkHeight)
      .stroke();
    // 月列
    doc
      .moveTo(startX + 80, educationWorkY)
      .lineTo(startX + 80, educationWorkY + educationWorkHeight)
      .stroke();

    // 各行の横線
    for (let i = 1; i <= 15; i++) {
      const y = educationWorkY + 25 + i * 23;
      if (y < educationWorkY + educationWorkHeight) {
        doc
          .moveTo(startX, y)
          .lineTo(startX + contentWidth, y)
          .stroke();
      }
    }

    // Page 2を追加
    doc.addPage();

    // Page 2: 資格・免許セクション
    const certificateY = 50;
    const certificateHeight = 120;

    // 外枠（太線）
    doc.lineWidth(2);
    doc.rect(startX, certificateY, contentWidth, certificateHeight).stroke();
    doc.lineWidth(1);

    // 資格の表ヘッダー
    doc
      .moveTo(startX, certificateY + 25)
      .lineTo(startX + contentWidth, certificateY + 25)
      .stroke();

    // 資格の縦線
    doc
      .moveTo(startX + 50, certificateY)
      .lineTo(startX + 50, certificateY + certificateHeight)
      .stroke();
    doc
      .moveTo(startX + 80, certificateY)
      .lineTo(startX + 80, certificateY + certificateHeight)
      .stroke();

    // 資格の行線
    for (let i = 1; i <= 4; i++) {
      const y = certificateY + 25 + i * 23;
      if (y < certificateY + certificateHeight) {
        doc
          .moveTo(startX, y)
          .lineTo(startX + contentWidth, y)
          .stroke();
      }
    }

    // Page 2: 通勤時間・扶養家族等の情報セクション
    const infoY = certificateY + certificateHeight + 20;
    const infoHeight = 40;

    // 外枠（太線）
    doc.lineWidth(2);
    doc.rect(startX, infoY, contentWidth, infoHeight).stroke();
    doc.lineWidth(1);

    // 4つの項目に分割
    doc
      .moveTo(startX + contentWidth / 4, infoY)
      .lineTo(startX + contentWidth / 4, infoY + infoHeight)
      .stroke();
    doc
      .moveTo(startX + contentWidth / 2, infoY)
      .lineTo(startX + contentWidth / 2, infoY + infoHeight)
      .stroke();
    doc
      .moveTo(startX + (3 * contentWidth) / 4, infoY)
      .lineTo(startX + (3 * contentWidth) / 4, infoY + infoHeight)
      .stroke();

    // Page 2: 趣味・特技セクション
    const hobbyY = infoY + infoHeight + 20;
    const hobbyHeight = 80;

    // 外枠（太線）
    doc.lineWidth(2);
    doc.rect(startX, hobbyY, contentWidth, hobbyHeight).stroke();
    doc.lineWidth(1);

    // Page 2: 志望動機セクション
    const motivationY = hobbyY + hobbyHeight + 20;
    const motivationHeight = 120;

    // 外枠（太線）
    doc.lineWidth(2);
    doc.rect(startX, motivationY, contentWidth, motivationHeight).stroke();
    doc.lineWidth(1);

    // Page 2: 本人希望記入欄
    const requestY = motivationY + motivationHeight + 20;
    const requestHeight = 80;

    // 外枠（太線）
    doc.lineWidth(2);
    doc.rect(startX, requestY, contentWidth, requestHeight).stroke();
    doc.lineWidth(1);
  }
}
