import PDFDocument from "pdfkit";
import { createWriteStream, existsSync } from "fs";
import path from "path";
import { ResumeConfig } from "./types";

export class ResumeFrameGenerator {
  private readonly pageWidth = 595.28; // A4 width in points
  private readonly pageHeight = 841.89; // A4 height in points
  private readonly margin = 30;
  private readonly fontPath = path.join(
    process.cwd(),
    "fonts",
    "NotoSerifJP-Regular.ttf"
  );

  /**
   * 履歴書の枠線を描画したPDFを生成する
   * @param outputPath 出力パス
   * @returns 生成したPDFファイルのパス
   */
  async generate(outputPath: string, config: ResumeConfig): Promise<void> {
    const doc = new PDFDocument({
      size: "A4",
      margins: {
        top: this.margin,
        bottom: this.margin,
        left: this.margin,
        right: this.margin,
      },
      bufferPages: true,
    });

    // 日本語フォントを登録
    doc.registerFont("NotoSerifJP", this.fontPath);
    doc.font("NotoSerifJP");

    this.drawPreciseResumeFrameAndText(doc, config);

    // PDF出力
    const stream = createWriteStream(outputPath);
    doc.pipe(stream);
    doc.end();

    return new Promise((resolve, reject) => {
      stream.on("finish", resolve);
      stream.on("error", reject);
    });
  }

  /**
   * 履歴書の枠線を描画する
   * @param doc PDFドキュメント
   */
  private drawPreciseResumeFrameAndText(
    doc: PDFKit.PDFDocument,
    config: ResumeConfig
  ): void {
    const contentWidth = this.pageWidth - 2 * this.margin;
    const startX = this.margin;

    // Page 1: 個人情報セクション ---------------------------------------------
    const personalInfoY = 100;
    const personalInfoHeight = 280;
    const offsetX = 120;
    const offsetY = 160;

    // 履歴書タイトル
    doc.fontSize(16);
    const titleText = "履歴書";
    const titleX = startX + 4;
    const titleHeight = doc.heightOfString(titleText);
    const titleY = personalInfoY - titleHeight - 4;
    doc.text(titleText, titleX, titleY, {
      characterSpacing: 10,
    });

    // 作成日
    doc.fontSize(10);
    const now = new Date();
    const dateText = `${now.getFullYear()}年 ${
      now.getMonth() + 1
    }月 ${now.getDate()}日現在`;
    const dateWidth = doc.widthOfString(dateText);
    const dataHeight = doc.heightOfString(dateText);
    doc.text(
      dateText,
      startX + contentWidth - offsetX - dateWidth,
      personalInfoY - dataHeight - 4
    );

    // 個人情報ラベル
    doc.fontSize(9);

    // 個人情報の外枠（太線）
    doc.lineWidth(2);
    doc
      .moveTo(startX, personalInfoY)
      .lineTo(startX + contentWidth - offsetX, personalInfoY)
      .lineTo(
        startX + contentWidth - offsetX,
        personalInfoY + personalInfoHeight - offsetY
      )
      .lineTo(
        startX + contentWidth,
        personalInfoY + personalInfoHeight - offsetY
      )
      .lineTo(startX + contentWidth, personalInfoY + personalInfoHeight)
      .lineTo(startX, personalInfoY + personalInfoHeight)
      .lineTo(startX, personalInfoY)
      .stroke();

    // 通常線に戻す
    doc.lineWidth(1);

    // 写真枠の位置とサイズ
    const photoX = startX + contentWidth - offsetX + 20;
    const photoY = personalInfoY - 20;
    const photoWidth = 90;
    const photoHeight = 120;
    const photoPath = path.join(process.cwd(), "data", "photo.png");
    doc
      .rect(photoX, photoY, photoWidth, photoHeight)
      .dash(1, [10, 5])
      .stroke()
      .undash();
    if (this.imageExists(photoPath)) {
      try {
        doc.image(photoPath, photoX - 1, photoY - 1, {
          fit: [photoWidth * 1.07, photoHeight * 1.07],
        });
      } catch (error) {
        console.warn(`写真の読み込みに失敗しました: ${photoPath}`, error);
        this.drawPhotoPlaceholder(doc, photoX, photoY, photoWidth, photoHeight);
      }
    }

    // 個人情報の内部区切り線
    // ふりがな行
    doc.text("ふりがな", startX + 5, personalInfoY + 3);
    doc.text(config.personal.ruby, startX + 80, personalInfoY + 3);
    doc
      .moveTo(startX, personalInfoY + 20)
      .lineTo(startX + contentWidth - offsetX, personalInfoY + 20)
      .dash(1, [10, 5])
      .stroke()
      .undash();

    // 氏名行
    doc.text("氏名", startX + 5, personalInfoY + 23, {
      characterSpacing: 16,
    });
    doc.fontSize(14);
    doc.text(config.personal.name, startX + 80, personalInfoY + 28);
    doc
      .moveTo(startX, personalInfoY + 60)
      .lineTo(startX + contentWidth - offsetX, personalInfoY + 60)
      .stroke();

    // 生年月日行
    doc.fontSize(9);
    doc.text("生年月日", startX + 5, personalInfoY + 61);
    doc.fontSize(14);
    const birthDay = new Date(config.personal.birth_day);
    doc.text(
      `${birthDay.getFullYear()}年 ${
        birthDay.getMonth() + 1
      }月 ${birthDay.getDate()}日（満 ${
        new Date().getFullYear() - birthDay.getFullYear()
      } 歳）`,
      startX + 80,
      personalInfoY + 68
    );
    doc.text(config.personal.gender, startX + 360, personalInfoY + 68);
    doc
      .moveTo(startX, personalInfoY + 100)
      .lineTo(startX + contentWidth - offsetX, personalInfoY + 100)
      .stroke()
      .moveTo(startX + 50, personalInfoY + 60)
      .lineTo(startX + 50, personalInfoY + 100)
      .stroke()
      .moveTo(startX + 320, personalInfoY + 60)
      .lineTo(startX + 320, personalInfoY + 100)
      .stroke();

    // 連絡先行1（携帯電話・EMAIL）
    doc.fontSize(9);
    doc.text("携帯電話番号", startX + 5, personalInfoY + 103);
    doc.text(config.personal.phone, startX + 80, personalInfoY + 103);
    doc.text("E-MAIL", startX + 186, personalInfoY + 103);
    doc.text(config.personal.email, startX + 233, personalInfoY + 103);
    doc
      .moveTo(startX, personalInfoY + 100)
      .lineTo(startX + contentWidth - offsetX, personalInfoY + 100)
      .stroke()
      .moveTo(startX + 65, personalInfoY + 100)
      .lineTo(startX + 65, personalInfoY + 120)
      .dash(1, [10, 5])
      .stroke()
      .undash()
      .moveTo(startX + 180, personalInfoY + 100)
      .lineTo(startX + 180, personalInfoY + 120)
      .stroke()
      .moveTo(startX + 225, personalInfoY + 100)
      .lineTo(startX + 225, personalInfoY + 120)
      .dash(1, [10, 5])
      .stroke()
      .undash();

    // 写真下の電話・FAX
    const phoneFaxY = personalInfoY + 120;
    const phoneFaxHalfHeight =
      (personalInfoY + personalInfoHeight - phoneFaxY) / 2;
    const phoneFaxHalfY = phoneFaxY + phoneFaxHalfHeight;
    doc.text("電話", startX + contentWidth - 116, personalInfoY + 122);
    doc.text(
      config.personal.address.phone,
      startX + contentWidth - 116,
      personalInfoY + 139
    );
    doc.text("FAX", startX + contentWidth - 115, personalInfoY + 162);
    doc.text(
      config.personal.address.fax,
      startX + contentWidth - 115,
      personalInfoY + 179
    );
    doc.text("電話", startX + contentWidth - 116, phoneFaxHalfY + 2);
    doc.text(
      config.personal.contact.phone,
      startX + contentWidth - 116,
      phoneFaxHalfY + 19
    );
    doc.text("FAX", startX + contentWidth - 115, phoneFaxHalfY + 42);
    doc.text(
      config.personal.contact.phone,
      startX + contentWidth - 115,
      phoneFaxHalfY + 59
    );
    doc
      .moveTo(startX + contentWidth - offsetX, phoneFaxY)
      .lineTo(
        startX + contentWidth - offsetX,
        personalInfoY + personalInfoHeight
      )
      .moveTo(startX + contentWidth - offsetX, phoneFaxHalfY)
      .lineTo(startX + contentWidth, phoneFaxHalfY)
      .stroke()
      .dash(1, [10, 5])
      .moveTo(
        startX + contentWidth - offsetX,
        phoneFaxY + phoneFaxHalfHeight / 2
      )
      .lineTo(startX + contentWidth, phoneFaxY + phoneFaxHalfHeight / 2)
      .moveTo(
        startX + contentWidth - offsetX,
        phoneFaxHalfY + phoneFaxHalfHeight / 2
      )
      .lineTo(startX + contentWidth, phoneFaxHalfY + phoneFaxHalfHeight / 2)
      .stroke()
      .undash();

    // 住所行1
    doc.text("ふりがな", startX + 5, personalInfoY + 123);
    doc.text(
      config.personal.address.value_ruby,
      startX + 60,
      personalInfoY + 123
    );

    doc.text("現住所 〒", startX + 5, personalInfoY + 143);
    doc.text(config.personal.address.zip, startX + 60, personalInfoY + 143);
    doc.fontSize(12);
    doc.text(config.personal.address.value, startX + 60, personalInfoY + 163);
    doc.fontSize(9);
    doc
      .moveTo(startX, personalInfoY + 120)
      .lineTo(startX + contentWidth - 110, personalInfoY + 120)
      .stroke();
    // 住所行1（ふりがな）
    doc
      .moveTo(startX, personalInfoY + 140)
      .lineTo(startX + contentWidth - offsetX, personalInfoY + 140)
      .dash(1, [10, 5])
      .stroke()
      .undash();

    // 住所行2
    doc.text("ふりがな", startX + 5, phoneFaxHalfY + 3);
    doc.text(
      config.personal.contact.value_ruby,
      startX + 60,
      phoneFaxHalfY + 3
    );
    doc.text("連絡先 〒", startX + 5, phoneFaxHalfY + 20 + 3);
    doc.text(config.personal.contact.zip, startX + 60, phoneFaxHalfY + 20 + 3);
    doc.fontSize(12);
    doc.text(
      config.personal.contact.value,
      startX + 60,
      phoneFaxHalfY + 40 + 3
    );
    doc.fontSize(9);
    doc
      .moveTo(startX, phoneFaxHalfY)
      .lineTo(startX + contentWidth - offsetX, phoneFaxHalfY)
      .stroke()
      .stroke();
    // 住所行2（ふりがな）
    doc
      .moveTo(startX, phoneFaxHalfY + 20)
      .lineTo(startX + contentWidth - offsetX, phoneFaxHalfY + 20)
      .dash(1, [10, 5])
      .stroke()
      .undash();

    // Page 1: 学歴・職歴セクション ---------------------------------------------
    const educationWorkY = personalInfoY + personalInfoHeight + 30;
    const educationWorkHeight = 370;

    // 表ヘッダー
    doc.text("年", startX + 26, educationWorkY + 6);
    doc.text("月", startX + 76, educationWorkY + 6);
    doc.text("学歴・職歴", startX + 295, educationWorkY + 6);

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
      .moveTo(startX + 60, educationWorkY)
      .lineTo(startX + 60, educationWorkY + educationWorkHeight)
      .stroke();
    // 月列
    doc
      .moveTo(startX + 100, educationWorkY)
      .lineTo(startX + 100, educationWorkY + educationWorkHeight)
      .stroke();

    // 各行の横線
    for (let i = 1; i <= 14; i++) {
      const y = educationWorkY + 25 + i * 23;
      if (y < educationWorkY + educationWorkHeight) {
        doc
          .moveTo(startX, y)
          .lineTo(startX + contentWidth, y)
          .stroke();
      }
    }

    let index = 0;
    if (config.education.length > 0) {
      doc.fontSize(12);
      doc.text("学歴", startX + 305, educationWorkY + 26);
      index++;
      for (let i = 1; i <= config.education.length; i++) {
        const y = educationWorkY + 26 + i * 23;
        const data = config.education[i - 1];
        doc.text(data.year.toString(), startX + 17, y);
        doc.text(data.month.toString(), startX + 71, y, {
          align: "center",
          width: 20,
        });
        doc.text(data.value, startX + 110, y + 1);
        index++;
      }
    }

    if (config.experience.length > 0) {
      doc.fontSize(12);
      doc.text("職歴", startX + 305, educationWorkY + 26 + index * 23);
      for (let i = 1; i <= config.experience.length; i++) {
        const y = educationWorkY + 26 + (i + index) * 23;
        const data = config.experience[i - 1];
        doc.text(data.year.toString(), startX + 17, y);
        doc.text(data.month.toString(), startX + 71, y, {
          align: "center",
          width: 20,
        });
        doc.text(data.value, startX + 110, y + 1);
      }
      doc.text(
        "以上",
        startX + 480,
        educationWorkY + 26 + (index + config.experience.length + 1) * 23 + 1
      );
    }

    // Page 2を追加 ------------------------------------------------------------
    doc.addPage();

    // Page 2: 資格・免許セクション
    const certificateY = 100;
    const certificateHeight = 140;

    // 外枠（太線）
    doc.lineWidth(2);
    doc.rect(startX, certificateY, contentWidth, certificateHeight).stroke();
    doc.lineWidth(1);

    doc.fontSize(9);
    doc.text("年", startX + 26, certificateY + 6);
    doc.text("月", startX + 76, certificateY + 6);
    doc.text("免許・資格", startX + 295, certificateY + 6);

    // 資格の表ヘッダー
    doc
      .moveTo(startX, certificateY + 25)
      .lineTo(startX + contentWidth, certificateY + 25)
      .stroke();

    // 資格の縦線
    doc
      .moveTo(startX + 60, certificateY)
      .lineTo(startX + 60, certificateY + certificateHeight)
      .stroke();
    doc
      .moveTo(startX + 100, certificateY)
      .lineTo(startX + 100, certificateY + certificateHeight)
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

    if (config.licences.length > 0) {
      doc.fontSize(12);
      for (let i = 0; i < config.licences.length; i++) {
        const y = certificateY + 26 + i * 23;
        const data = config.licences[i];
        doc.text(data.year.toString(), startX + 17, y);
        doc.text(data.month.toString(), startX + 71, y, {
          align: "center",
          width: 20,
        });
        doc.text(data.value, startX + 110, y + 1);
      }
    }

    // Page 2: 通勤時間・扶養家族等の情報セクション
    const infoY = certificateY + certificateHeight + 20;
    const infoHeight = 50;
    doc.fontSize(9);
    doc.text("通勤時間", startX + 6, infoY + 4);
    doc.text("扶養家族", startX + 140, infoY + 4);
    doc.text("配偶者", startX + 275, infoY + 4);
    doc.text("配偶者の扶養義務", startX + 408, infoY + 4);
    doc.fontSize(12);
    doc.text(config.commuting_time, startX, infoY + 24, {
      align: "center",
      width: 138,
    });
    doc.text(config.dependents, startX + 134, infoY + 24, {
      align: "center",
      width: 138,
    });
    doc.text(config.spouse, startX + 263, infoY + 24, {
      align: "center",
      width: 138,
    });
    doc.text(config.supporting_spouse, startX + 396, infoY + 24, {
      align: "center",
      width: 138,
    });
    doc.fontSize(9);

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
    const hobbyHeight = 120;
    doc.text("趣味・特技", startX + 7, hobbyY + 5);
    doc.fontSize(12);
    doc.text(config.hobby, startX + 7, hobbyY + 24, {
      align: "left",
      width: contentWidth - startX - 14,
    });

    // 外枠（太線）
    doc.lineWidth(2);
    doc.rect(startX, hobbyY, contentWidth, hobbyHeight).stroke();
    doc.lineWidth(1);

    // Page 2: 志望動機セクション
    const motivationY = hobbyY + hobbyHeight + 20;
    const motivationHeight = 120;
    doc.fontSize(9);
    doc.text("志望動機", startX + 7, motivationY + 5);
    doc.fontSize(12);
    doc.text(config.motivation, startX + 7, motivationY + 24, {
      align: "left",
      width: contentWidth - startX - 14,
    });

    // 外枠（太線）
    doc.lineWidth(2);
    doc.rect(startX, motivationY, contentWidth, motivationHeight).stroke();
    doc.lineWidth(1);

    // Page 2: 本人希望記入欄
    const requestY = motivationY + motivationHeight + 20;
    const requestHeight = 120;
    doc.fontSize(9);
    doc.text("本人希望記入欄", startX + 7, requestY + 5);
    doc.fontSize(12);
    doc.text(config.request, startX + 7, requestY + 24, {
      align: "left",
      width: contentWidth - startX - 14,
    });

    // 外枠（太線）
    doc.lineWidth(2);
    doc.rect(startX, requestY, contentWidth, requestHeight).stroke();
    doc.lineWidth(1);
  }

  /**
   * 日本語テキストを追加する
   */
  private addPage1Text(doc: PDFKit.PDFDocument): void {
    doc.switchToPage(1);
    const contentWidth = this.pageWidth - 2 * this.margin;
    const startX = this.margin;

    // 履歴書タイトル
    doc.fontSize(20);
    const titleText = "履歴書";
    const titleWidth = doc.widthOfString(titleText);
    const titleX = startX + (contentWidth - titleWidth) / 2;
    doc.text(titleText, titleX, 40);

    // 作成日
    doc.fontSize(10);
    const dateText = "2024年 4月 1日現在";
    const dateWidth = doc.widthOfString(dateText);
    const dateX = startX + contentWidth - dateWidth;
    doc.text(dateText, dateX, 50);

    // 個人情報ラベル
    doc.fontSize(9);
    const personalInfoY = 100;

    // ふりがな
    doc.text("ふりがな", startX + 5, personalInfoY + 5);

    // 氏名
    doc.text("氏名", startX + 5, personalInfoY + 25);

    // 生年月日
    doc.text("生年月日", startX + 5, personalInfoY + 65);

    // 性別
    doc.text("男", startX + 330, personalInfoY + 75);

    // 連絡先ラベル
    doc.text("携帯電話", startX + 5, personalInfoY + 105);
    doc.text("E-MAIL", startX + 210, personalInfoY + 105);

    // 住所ラベル
    doc.text("ふりがな", startX + 5, personalInfoY + 125);
    doc.text("現住所", startX + 5, personalInfoY + 145);

    // 写真欄ラベル
    doc.text("写真", startX + contentWidth - 80, personalInfoY + 50);
    doc.text("電話", startX + contentWidth - 110, personalInfoY + 125);
    doc.text("FAX", startX + contentWidth - 110, personalInfoY + 145);

    // 学歴・職歴セクション
    const educationWorkY = personalInfoY + 280 + 30;

    // 表ヘッダー
    doc.text("年", startX + 20, educationWorkY + 8);
    doc.text("月", startX + 60, educationWorkY + 8);
    doc.text(
      "学歴・職歴（各項目ごとにまとめて書く）",
      startX + 200,
      educationWorkY + 8
    );
  }

  /**
   * 2ページ目の日本語テキストを追加する
   */
  private addPage2Text(doc: PDFKit.PDFDocument): void {
    // doc.switchToPage(2);
    const contentWidth = this.pageWidth - 2 * this.margin;
    const startX = this.margin;

    // 2ページ目の各セクションのラベルを追加
    doc.fontSize(9);

    // 資格・免許セクション
    const certificateY = 100;
    doc.text("年", startX + 20, certificateY + 8);
    doc.text("月", startX + 60, certificateY + 8);
    doc.text("免許・資格", startX + 200, certificateY + 8);

    // 通勤時間・扶養家族等の情報セクション
    const infoY = certificateY + 140 + 20;
    doc.text("通勤時間", startX + 10, infoY + 15);
    doc.text("扶養家族数", startX + contentWidth / 4 + 10, infoY + 15);
    doc.text("配偶者", startX + contentWidth / 2 + 10, infoY + 15);
    doc.text(
      "配偶者の扶養義務",
      startX + (3 * contentWidth) / 4 + 10,
      infoY + 15
    );

    // 趣味・特技セクション
    const hobbyY = infoY + 40 + 20;
    doc.text("趣味・特技", startX + 10, hobbyY + 15);

    // 志望動機セクション
    const motivationY = hobbyY + 120 + 20;
    doc.text("志望動機", startX + 10, motivationY + 15);

    // 本人希望記入欄
    const requestY = motivationY + 120 + 20;
    doc.text("本人希望記入欄", startX + 10, requestY + 15);
  }

  /**
   * ファイルが存在するかチェック
   */
  private imageExists(imagePath: string): boolean {
    try {
      return existsSync(imagePath);
    } catch {
      return false;
    }
  }

  /**
   * 写真プレースホルダーを描画
   */
  private drawPhotoPlaceholder(
    doc: PDFKit.PDFDocument,
    x: number,
    y: number,
    width: number,
    height: number
  ): void {
    doc.fontSize(12);
    const photoText = "写真";
    const textWidth = doc.widthOfString(photoText);
    const textHeight = doc.heightOfString(photoText);

    // 写真枠の中央にテキストを配置
    doc.text(
      photoText,
      x + (width - textWidth) / 2,
      y + (height - textHeight) / 2
    );

    // 小さなテキストで説明を追加
    doc.fontSize(8);
    const noteText = "縦4cm×横3cm";
    const noteWidth = doc.widthOfString(noteText);
    doc.text(noteText, x + (width - noteWidth) / 2, y + height - 15);
  }
}
