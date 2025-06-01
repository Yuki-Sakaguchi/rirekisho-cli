import PDFDocument from "pdfkit";
import { createWriteStream } from "fs";
import { ResumeData } from "../schemas/resume-schema";

export class PDFGenerator {
  private doc: typeof PDFDocument;
  private pageWidth: number = 595.28; // A4 width in points
  private pageHeight: number = 841.89; // A4 height in points
  private margin: number = 40;

  constructor() {
    this.doc = new PDFDocument({
      size: "A4",
      margins: {
        top: this.margin,
        bottom: this.margin,
        left: this.margin,
        right: this.margin,
      },
    });
  }

  async generateResume(data: ResumeData, outputPath: string): Promise<void> {
    // 日本語フォント設定
    this.setupFonts();

    let currentY = this.margin;

    // 履歴書ヘッダー
    currentY = this.renderHeader(currentY);

    // 個人情報セクション
    currentY = this.renderPersonalInfoSection(data.personal_info, currentY);

    // 学歴・職歴セクション（表形式）
    currentY = this.renderCareerSection(
      data.education,
      data.work_experience,
      currentY
    );

    // 免許・資格セクション
    if (data.certifications && data.certifications.length > 0) {
      currentY = this.renderCertificationsSection(
        data.certifications,
        currentY
      );
    }

    // PDF出力
    const stream = createWriteStream(outputPath);
    this.doc.pipe(stream);
    this.doc.end();

    return new Promise((resolve, reject) => {
      stream.on("finish", resolve);
      stream.on("error", reject);
    });
  }

  private setupFonts(): void {
    // システムフォントを使用（日本語対応）
    // macOS/Linux: Hiragino Sans, Windows: MS Gothic
    try {
      // Noto Sans CJKが利用可能な場合は使用
      this.doc.registerFont("Japanese", "fonts/NotoSans-Regular.ttf");
      // this.doc.registerFont("Japanese-Bold", "fonts/NotoSansCJK-Bold.ttf");
    } catch {
      // フォントファイルが無い場合はシステムフォント使用
      // PDFKitのデフォルトフォントで代用
    }
  }

  private renderHeader(startY: number): number {
    const headerHeight = 60;

    // 「履歴書」タイトル
    this.doc.fontSize(24);
    this.doc.text("履歴書", 0, startY + 10, {
      align: "center",
      width: this.pageWidth,
    });

    // 日付（右上）
    const today = new Date();
    const dateStr = `${today.getFullYear()}年${
      today.getMonth() + 1
    }月${today.getDate()}日現在`;
    this.doc.fontSize(10);
    this.doc.text(dateStr, this.pageWidth - this.margin - 120, startY + 10);

    return startY + headerHeight;
  }

  private renderPersonalInfoSection(personalInfo: any, startY: number): number {
    const sectionHeight = 120;
    let currentY = startY;

    // セクション枠
    this.drawSectionBorder(startY, sectionHeight);

    // 氏名エリア
    const nameAreaHeight = 40;
    this.doc
      .rect(
        this.margin,
        currentY,
        this.pageWidth - 2 * this.margin,
        nameAreaHeight
      )
      .stroke();

    // ふりがな
    this.doc.fontSize(8);
    this.doc.text("ふりがな", this.margin + 10, currentY + 5);
    this.doc.text(personalInfo.name.furigana, this.margin + 60, currentY + 5);

    // 氏名
    this.doc.fontSize(16);
    this.doc.text("氏名", this.margin + 10, currentY + 20);
    this.doc.text(personalInfo.name.kanji, this.margin + 60, currentY + 20);

    // 写真枠（右側）
    const photoX = this.pageWidth - this.margin - 100;
    const photoY = currentY + 5;
    this.doc.rect(photoX, photoY, 90, 110).stroke();
    this.doc.fontSize(8);
    this.doc.text("写真を貼る位置", photoX + 20, photoY + 50);
    this.doc.fontSize(6);
    this.doc.text("縦4cm×横3cm", photoX + 25, photoY + 65);

    currentY += nameAreaHeight + 10;

    // 生年月日・年齢
    this.doc.fontSize(10);
    this.doc.text("生年月日", this.margin + 10, currentY);
    this.doc.text(
      this.formatDate(personalInfo.birth_date),
      this.margin + 80,
      currentY
    );
    this.doc.text("(満   歳)", this.margin + 200, currentY);

    currentY += 20;

    // 住所
    this.doc.text("現住所", this.margin + 10, currentY);
    this.doc.text(personalInfo.address, this.margin + 80, currentY, {
      width: 300,
      height: 30,
    });

    currentY += 35;

    // 連絡先
    this.doc.text("電話", this.margin + 10, currentY);
    this.doc.text(personalInfo.phone, this.margin + 80, currentY);

    this.doc.text("E-mail", this.margin + 250, currentY);
    this.doc.text(personalInfo.email, this.margin + 300, currentY);

    return startY + sectionHeight + 20;
  }

  private renderCareerSection(
    education: any[],
    workExp: any[],
    startY: number
  ): number {
    let currentY = startY;

    // 学歴・職歴見出し
    this.doc.fontSize(12);
    this.doc.text("学歴・職歴", this.margin + 10, currentY);
    currentY += 20;

    // テーブルヘッダー
    this.renderTableHeader(currentY);
    currentY += 25;

    // 学歴部分
    if (education.length > 0) {
      this.doc.fontSize(10);
      this.doc.text("学歴", this.margin + 150, currentY);
      currentY += 15;

      education.forEach((edu) => {
        this.renderTableRow(
          edu.date,
          `${edu.institution} ${edu.type}`,
          currentY
        );
        currentY += 15;
      });

      currentY += 5;
    }

    // 職歴部分
    if (workExp.length > 0) {
      this.doc.fontSize(10);
      this.doc.text("職歴", this.margin + 150, currentY);
      currentY += 15;

      workExp.forEach((work) => {
        let description = `${work.company} ${work.type}`;
        if (work.detail) {
          description += ` (${work.detail})`;
        }

        this.renderTableRow(work.date, description, currentY);
        currentY += 15;
      });
    }

    // 「以上」を追加
    currentY += 5;
    this.renderTableRow("", "以上", currentY);

    return currentY + 30;
  }

  private renderCertificationsSection(
    certifications: any[],
    startY: number
  ): number {
    let currentY = startY;

    // 免許・資格見出し
    this.doc.fontSize(12);
    this.doc.text("免許・資格", this.margin + 10, currentY);
    currentY += 20;

    // テーブルヘッダー
    this.renderTableHeader(currentY);
    currentY += 25;

    // 資格一覧
    this.doc.fontSize(10);
    certifications.forEach((cert) => {
      this.renderTableRow(cert.date, cert.name, currentY);
      currentY += 15;
    });

    return currentY + 20;
  }

  private renderTableHeader(y: number): void {
    const tableWidth = this.pageWidth - 2 * this.margin;
    const dateColWidth = 80;
    const contentColWidth = tableWidth - dateColWidth;

    // ヘッダー背景
    this.doc
      .rect(this.margin, y, tableWidth, 20)
      .fillAndStroke("#f0f0f0", "#000000");

    // ヘッダーテキスト
    this.doc.fillColor("#000000");
    this.doc.fontSize(10);
    this.doc.text("年月", this.margin + 10, y + 5);
    this.doc.text(
      "学歴・職歴・免許・資格等",
      this.margin + dateColWidth + 10,
      y + 5
    );

    // 区切り線
    this.doc
      .moveTo(this.margin + dateColWidth, y)
      .lineTo(this.margin + dateColWidth, y + 20)
      .stroke();
  }

  private renderTableRow(date: string, content: string, y: number): void {
    const tableWidth = this.pageWidth - 2 * this.margin;
    const dateColWidth = 80;
    const rowHeight = 15;

    // 行の枠線
    this.doc.rect(this.margin, y, tableWidth, rowHeight).stroke();

    // 区切り線
    this.doc
      .moveTo(this.margin + dateColWidth, y)
      .lineTo(this.margin + dateColWidth, y + rowHeight)
      .stroke();

    // 内容
    this.doc.fontSize(9);
    this.doc.text(date, this.margin + 5, y + 3, { width: dateColWidth - 10 });
    this.doc.text(content, this.margin + dateColWidth + 5, y + 3, {
      width: tableWidth - dateColWidth - 10,
    });
  }

  private drawSectionBorder(y: number, height: number): void {
    this.doc
      .rect(this.margin, y, this.pageWidth - 2 * this.margin, height)
      .stroke();
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // 和暦変換（簡易版）
    let era = "";
    let eraYear = 0;

    if (year >= 2019) {
      era = "令和";
      eraYear = year - 2018;
    } else if (year >= 1989) {
      era = "平成";
      eraYear = year - 1988;
    } else if (year >= 1926) {
      era = "昭和";
      eraYear = year - 1925;
    }

    return `${era}${eraYear}年${month}月${day}日`;
  }
}
