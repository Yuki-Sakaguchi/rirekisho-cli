import PDFDocument from "pdfkit";
import { createWriteStream } from "fs";
import { ResumeData } from "../schemas/resume-schema";

export class PDFGenerator {
  private doc: typeof PDFDocument;
  private pageWidth: number = 595.28; // A4 width in points
  private pageHeight: number = 841.89; // A4 height in points
  private margin: number = 30;

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
    // 日本語フォント設定（最初に実行）
    this.setupFonts();

    let currentY = this.margin;

    // Page 1: 個人情報・学歴職歴
    currentY = this.renderPage1Header(currentY);
    currentY = this.renderPersonalInfoTable(data.personal_info, currentY);
    currentY = this.renderEducationWorkTable(
      data.education,
      data.work_experience,
      currentY
    );

    // Page 2: 資格・その他
    this.doc.addPage();
    currentY = this.margin;
    currentY = this.renderCertificationsTable(
      data.certifications || [],
      currentY
    );
    currentY = this.renderAdditionalInfoTables(
      data.additional_info || {},
      currentY
    );

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
    try {
      // 外部フォントファイルを使用
      this.doc.registerFont("Japanese", "./fonts/NotoSans-Regular.ttf");
      this.doc.font("Japanese");
    } catch (error) {
      // フォントファイルがない場合はデフォルト
      console.warn(
        "外部フォントファイルが見つかりません。デフォルトフォントを使用します。"
      );
      this.doc.font("Helvetica");
    }
  }

  private renderPage1Header(startY: number): number {
    // 「履歴書」タイトル - 大きく中央配置
    this.doc.fontSize(28);
    this.doc.text("履　歴　書", 0, startY, {
      align: "center",
      width: this.pageWidth,
      characterSpacing: 8, // 文字間隔を広く
    });

    // 日付（右上）
    const today = new Date();
    const dateStr = `${today.getFullYear()}年${
      today.getMonth() + 1
    }月${today.getDate()}日現在`;
    this.doc.fontSize(12);
    this.doc.text(dateStr, this.pageWidth - 150, startY + 5);

    return startY + 60;
  }

  private renderPersonalInfoTable(personalInfo: any, startY: number): number {
    const tableWidth = this.pageWidth - 2 * this.margin;
    const tableHeight = 180;

    // 外枠
    this.doc.rect(this.margin, startY, tableWidth, tableHeight).stroke();

    // 写真欄（右上）
    const photoWidth = 90;
    const photoHeight = 120;
    const photoX = this.pageWidth - this.margin - photoWidth - 10;
    const photoY = startY + 10;

    this.doc.rect(photoX, photoY, photoWidth, photoHeight).stroke();
    this.doc.fontSize(8);
    this.doc.text("写真を貼る位置", photoX + 15, photoY + 20);
    this.doc.text("1. 縦36〜40 mm", photoX + 5, photoY + 35);
    this.doc.text("   横24〜30 mm", photoX + 5, photoY + 45);
    this.doc.text("2. 本人単身胸から上", photoX + 5, photoY + 55);
    this.doc.text("3. 裏面にのりづけ", photoX + 5, photoY + 65);
    this.doc.text("4. 裏面に氏名記入", photoX + 5, photoY + 75);

    // ふりがな行
    let currentY = startY + 15;
    this.doc.fontSize(10);
    this.doc.text("ふりがな", this.margin + 10, currentY);
    this.doc.text(personalInfo.name.furigana, this.margin + 80, currentY);

    // 区切り線（ふりがなの下）
    this.doc
      .moveTo(this.margin, currentY + 15)
      .lineTo(photoX - 10, currentY + 15)
      .stroke();

    // 氏名行
    currentY += 25;
    this.doc.fontSize(12);
    this.doc.text("氏　　名", this.margin + 10, currentY);
    this.doc.fontSize(18);
    this.doc.text(personalInfo.name.kanji, this.margin + 80, currentY);

    // 区切り線（氏名の下）
    currentY += 30;
    this.doc
      .moveTo(this.margin, currentY)
      .lineTo(photoX - 10, currentY)
      .stroke();

    // 生年月日・性別行
    currentY += 10;
    this.doc.fontSize(12);
    this.doc.text("生年月日", this.margin + 10, currentY);

    const formattedDate = this.formatBirthDate(personalInfo.birth_date);
    this.doc.text(formattedDate, this.margin + 80, currentY);

    // 年齢
    if (personalInfo.age) {
      this.doc.text(`(満 ${personalInfo.age} 歳)`, this.margin + 220, currentY);
    }

    // 性別（右端）
    if (personalInfo.gender) {
      this.doc.text(personalInfo.gender, this.margin + 320, currentY);
    }

    // 区切り線（生年月日の下）
    currentY += 25;
    this.doc
      .moveTo(this.margin, currentY)
      .lineTo(photoX - 10, currentY)
      .stroke();

    // 携帯電話・Email行
    currentY += 10;
    this.doc.fontSize(10);
    this.doc.text("携帯電話番号", this.margin + 10, currentY);
    this.doc.text(personalInfo.phone, this.margin + 80, currentY);
    this.doc.text("E-MAIL", this.margin + 220, currentY);
    this.doc.text(personalInfo.email, this.margin + 260, currentY);

    // 区切り線
    currentY += 15;
    this.doc
      .moveTo(this.margin, currentY)
      .lineTo(this.pageWidth - this.margin, currentY)
      .stroke();

    // 電話・FAX行（空欄）
    currentY += 5;
    this.doc.text("電話", this.margin + 10, currentY);
    this.doc.text("FAX", this.margin + 150, currentY);
    this.doc.text("電話", photoX + photoWidth + 10, currentY);

    currentY += 15;
    this.doc
      .moveTo(this.margin, currentY)
      .lineTo(this.pageWidth - this.margin, currentY)
      .stroke();

    currentY += 5;
    this.doc.text("FAX", photoX + photoWidth + 10, currentY);

    // 住所欄
    currentY += 20;
    this.doc
      .moveTo(this.margin, currentY)
      .lineTo(this.pageWidth - this.margin, currentY)
      .stroke();

    currentY += 5;
    this.doc.fontSize(10);
    this.doc.text("ふりがな", this.margin + 10, currentY);
    this.doc.text(
      this.generateAddressFurigana(personalInfo.address),
      this.margin + 60,
      currentY
    );

    currentY += 15;
    this.doc
      .moveTo(this.margin, currentY)
      .lineTo(this.pageWidth - this.margin, currentY)
      .stroke();

    currentY += 5;
    this.doc.text("現住所", this.margin + 10, currentY);

    // 郵便番号の抽出と住所の表示
    const { postalCode, address } = this.parseAddress(personalInfo.address);
    if (postalCode) {
      this.doc.text(`〒${postalCode}`, this.margin + 60, currentY);
      this.doc.text(address, this.margin + 60, currentY + 15, { width: 400 });
    } else {
      this.doc.text(personalInfo.address, this.margin + 60, currentY, {
        width: 400,
      });
    }

    return startY + tableHeight + 20;
  }

  private renderEducationWorkTable(
    education: any[],
    workExp: any[],
    startY: number
  ): number {
    const tableWidth = this.pageWidth - 2 * this.margin;
    let tableHeight = 300; // 初期値、内容に応じて調整

    // 必要な行数を計算
    const totalRows = education.length + workExp.length + 4; // ヘッダー、学歴ラベル、職歴ラベル、以上
    tableHeight = Math.max(300, totalRows * 20 + 60);

    // 外枠
    this.doc.rect(this.margin, startY, tableWidth, tableHeight).stroke();

    let currentY = startY + 15;

    // ヘッダー
    this.doc.fontSize(12);
    const headerY = currentY;
    this.doc
      .rect(this.margin, headerY, 60, 25)
      .fillAndStroke("#f0f0f0", "#000000");
    this.doc
      .rect(this.margin + 60, headerY, 60, 25)
      .fillAndStroke("#f0f0f0", "#000000");
    this.doc
      .rect(this.margin + 120, headerY, tableWidth - 120, 25)
      .fillAndStroke("#f0f0f0", "#000000");

    this.doc.fillColor("#000000");
    this.doc.text("年", this.margin + 25, headerY + 8);
    this.doc.text("月", this.margin + 85, headerY + 8);
    this.doc.text(
      "学歴・職歴（各項目ごとにまとめて書く）",
      this.margin + 250,
      headerY + 8
    );

    currentY += 25;

    // 学歴ラベル
    currentY += 10;
    this.renderEducationWorkRow("", "", "学歴", currentY, tableWidth, true);
    currentY += 20;

    // 学歴項目
    education.forEach((edu) => {
      const date = this.parseEducationDate(edu.date);
      let description = edu.institution;
      if (edu.type) {
        description += ` ${edu.type}`;
      }
      this.renderEducationWorkRow(
        date.year,
        date.month,
        description,
        currentY,
        tableWidth
      );
      currentY += 20;
    });

    // 職歴ラベル
    currentY += 5;
    this.renderEducationWorkRow("", "", "職歴", currentY, tableWidth, true);
    currentY += 20;

    // 職歴項目
    workExp.forEach((work) => {
      const date = this.parseEducationDate(work.date);
      let description = work.company;
      if (work.type) {
        description += ` ${work.type}`;
      }
      if (work.detail) {
        description += ` (${work.detail})`;
      }
      this.renderEducationWorkRow(
        date.year,
        date.month,
        description,
        currentY,
        tableWidth
      );
      currentY += 20;
    });

    // 「以上」
    currentY += 10;
    this.renderEducationWorkRow("", "", "以上", currentY, tableWidth);

    return startY + tableHeight + 20;
  }

  private renderEducationWorkRow(
    year: string,
    month: string,
    content: string,
    y: number,
    tableWidth: number,
    isLabel: boolean = false
  ): void {
    const rowHeight = 20;

    // 縦線
    this.doc
      .moveTo(this.margin, y)
      .lineTo(this.margin, y + rowHeight)
      .stroke();
    this.doc
      .moveTo(this.margin + 60, y)
      .lineTo(this.margin + 60, y + rowHeight)
      .stroke();
    this.doc
      .moveTo(this.margin + 120, y)
      .lineTo(this.margin + 120, y + rowHeight)
      .stroke();
    this.doc
      .moveTo(this.pageWidth - this.margin, y)
      .lineTo(this.pageWidth - this.margin, y + rowHeight)
      .stroke();

    // 横線
    this.doc
      .moveTo(this.margin, y + rowHeight)
      .lineTo(this.pageWidth - this.margin, y + rowHeight)
      .stroke();

    // 内容
    this.doc.fontSize(isLabel ? 11 : 10);

    // 年月の表示
    if (year) {
      this.doc.text(year, this.margin + 5, y + 5, {
        width: 50,
        align: "center",
      });
    }
    if (month) {
      this.doc.text(month, this.margin + 65, y + 5, {
        width: 50,
        align: "center",
      });
    }

    // 内容の表示
    if (isLabel) {
      // ラベルは中央寄せ
      this.doc.text(content, this.margin + 120, y + 5, {
        width: tableWidth - 120,
        align: "center",
      });
    } else {
      this.doc.text(content, this.margin + 130, y + 5, {
        width: tableWidth - 140,
      });
    }
  }

  private renderCertificationsTable(
    certifications: any[],
    startY: number
  ): number {
    const tableWidth = this.pageWidth - 2 * this.margin;
    const tableHeight = Math.max(200, certifications.length * 20 + 80);

    // 外枠
    this.doc.rect(this.margin, startY, tableWidth, tableHeight).stroke();

    let currentY = startY + 15;

    // ヘッダー
    this.doc.fontSize(12);
    const headerY = currentY;
    this.doc
      .rect(this.margin, headerY, 60, 25)
      .fillAndStroke("#f0f0f0", "#000000");
    this.doc
      .rect(this.margin + 60, headerY, 60, 25)
      .fillAndStroke("#f0f0f0", "#000000");
    this.doc
      .rect(this.margin + 120, headerY, tableWidth - 120, 25)
      .fillAndStroke("#f0f0f0", "#000000");

    this.doc.fillColor("#000000");
    this.doc.text("年", this.margin + 25, headerY + 8);
    this.doc.text("月", this.margin + 85, headerY + 8);
    this.doc.text("免許・資格", this.margin + 280, headerY + 8);

    currentY += 25;

    // 資格項目
    if (certifications.length > 0) {
      certifications.forEach((cert) => {
        const date = this.parseEducationDate(cert.date);
        this.renderEducationWorkRow(
          date.year,
          date.month,
          cert.name,
          currentY,
          tableWidth
        );
        currentY += 20;
      });
    } else {
      // 空行を数行追加
      for (let i = 0; i < 5; i++) {
        this.renderEducationWorkRow("", "", "", currentY, tableWidth);
        currentY += 20;
      }
    }

    return startY + tableHeight + 20;
  }

  private renderAdditionalInfoTables(
    additionalInfo: any,
    startY: number
  ): number {
    let currentY = startY;
    const tableWidth = this.pageWidth - 2 * this.margin;

    // 通勤時間・扶養家族等のテーブル
    const infoTableHeight = 40;
    this.doc.rect(this.margin, currentY, tableWidth, infoTableHeight).stroke();

    // 列の区切り
    const col1Width = tableWidth / 4;
    const col2Width = tableWidth / 4;
    const col3Width = tableWidth / 4;
    const col4Width = tableWidth / 4;

    this.doc
      .moveTo(this.margin + col1Width, currentY)
      .lineTo(this.margin + col1Width, currentY + infoTableHeight)
      .stroke();
    this.doc
      .moveTo(this.margin + col1Width + col2Width, currentY)
      .lineTo(this.margin + col1Width + col2Width, currentY + infoTableHeight)
      .stroke();
    this.doc
      .moveTo(this.margin + col1Width + col2Width + col3Width, currentY)
      .lineTo(
        this.margin + col1Width + col2Width + col3Width,
        currentY + infoTableHeight
      )
      .stroke();

    // 行の区切り
    this.doc
      .moveTo(this.margin, currentY + 20)
      .lineTo(this.pageWidth - this.margin, currentY + 20)
      .stroke();

    // ヘッダー
    this.doc.fontSize(10);
    this.doc.text("通勤時間", this.margin + 10, currentY + 5);
    this.doc.text("扶養家族", this.margin + col1Width + 10, currentY + 5);
    this.doc.text(
      "配偶者",
      this.margin + col1Width + col2Width + 10,
      currentY + 5
    );
    this.doc.text(
      "配偶者の扶養義務",
      this.margin + col1Width + col2Width + col3Width + 5,
      currentY + 5
    );

    // 内容
    this.doc.text(
      additionalInfo.commute_time || "",
      this.margin + 10,
      currentY + 25
    );
    this.doc.text("(配偶者を除く)", this.margin + col1Width + 5, currentY + 25);
    this.doc.fontSize(8);
    this.doc.text(
      additionalInfo.family_dependents === 0 ? "無" : "有",
      this.margin + col1Width + 60,
      currentY + 25
    );
    this.doc.text(
      additionalInfo.spouse ? "有" : "無",
      this.margin + col1Width + col2Width + 30,
      currentY + 25
    );
    this.doc.text(
      additionalInfo.spouse_support ? "有" : "無",
      this.margin + col1Width + col2Width + col3Width + 30,
      currentY + 25
    );

    currentY += infoTableHeight + 20;

    // 趣味・特技欄
    const hobbyTableHeight = 80;
    this.doc.rect(this.margin, currentY, tableWidth, hobbyTableHeight).stroke();

    this.doc.fontSize(10);
    this.doc.text("趣味・特技", this.margin + 10, currentY + 5);

    this.doc
      .moveTo(this.margin, currentY + 20)
      .lineTo(this.pageWidth - this.margin, currentY + 20)
      .stroke();

    const hobbyText = additionalInfo.skills || "";
    this.doc.fontSize(9);
    this.doc.text(hobbyText, this.margin + 10, currentY + 25, {
      width: tableWidth - 20,
      height: hobbyTableHeight - 30,
    });

    currentY += hobbyTableHeight + 20;

    // 志望動機欄
    const motivationTableHeight = 120;
    this.doc
      .rect(this.margin, currentY, tableWidth, motivationTableHeight)
      .stroke();

    this.doc.fontSize(10);
    this.doc.text("志望動機", this.margin + 10, currentY + 5);

    this.doc
      .moveTo(this.margin, currentY + 20)
      .lineTo(this.pageWidth - this.margin, currentY + 20)
      .stroke();

    const motivationText = additionalInfo.motivation || "";
    this.doc.fontSize(9);
    this.doc.text(motivationText, this.margin + 10, currentY + 25, {
      width: tableWidth - 20,
      height: motivationTableHeight - 30,
    });

    currentY += motivationTableHeight + 20;

    // 本人希望記入欄
    const requestTableHeight = 80;
    this.doc
      .rect(this.margin, currentY, tableWidth, requestTableHeight)
      .stroke();

    this.doc.fontSize(10);
    this.doc.text("本人希望記入欄", this.margin + 10, currentY + 5);

    this.doc
      .moveTo(this.margin, currentY + 20)
      .lineTo(this.pageWidth - this.margin, currentY + 20)
      .stroke();

    const requestText = additionalInfo.other || "特にありません。";
    this.doc.fontSize(9);
    this.doc.text(requestText, this.margin + 10, currentY + 25, {
      width: tableWidth - 20,
      height: requestTableHeight - 30,
    });

    return currentY + requestTableHeight;
  }

  // ユーティリティメソッド
  private formatBirthDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${year}年 ${month}月 ${day}日`;
  }

  private parseEducationDate(dateString: string): {
    year: string;
    month: string;
  } {
    if (dateString.includes("現在")) {
      return { year: "2025", month: "2" };
    }

    const match = dateString.match(/(\d{4})-(\d{1,2})/);
    if (match) {
      return { year: match[1], month: match[2] };
    }

    // 年月形式の場合
    const yearMonthMatch = dateString.match(/(\d{4})\s*(\d{1,2})/);
    if (yearMonthMatch) {
      return { year: yearMonthMatch[1], month: yearMonthMatch[2] };
    }

    return { year: "", month: "" };
  }

  private parseAddress(address: string): {
    postalCode: string;
    address: string;
  } {
    // 郵便番号を抽出
    const postalMatch = address.match(/〒?(\d{3}-?\d{4})/);
    const postalCode = postalMatch ? postalMatch[1] : "";

    // 郵便番号を除いた住所
    const cleanAddress = address.replace(/〒?\d{3}-?\d{4}\s*/, "");

    return { postalCode, address: cleanAddress };
  }

  private generateAddressFurigana(address: string): string {
    // 簡易的な住所ふりがな生成（実際にはもっと複雑な処理が必要）
    const prefectureMap: { [key: string]: string } = {
      東京都: "とうきょうと",
      大阪府: "おおさかふ",
      京都府: "きょうとふ",
      北海道: "ほっかいどう",
    };

    for (const [kanji, hiragana] of Object.entries(prefectureMap)) {
      if (address.includes(kanji)) {
        return hiragana + " ..."; // 簡易表示
      }
    }

    return ""; // ふりがなが生成できない場合は空
  }
}
