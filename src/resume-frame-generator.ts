import PDFDocument from "pdfkit";
import { createWriteStream } from "fs";

export class ResumeFrameGenerator {
  private readonly pageWidth = 595.28; // A4 width in points
  private readonly pageHeight = 841.89; // A4 height in points
  private readonly margin = 30;

  /**
   * 履歴書の枠線を描画したPDFを生成する
   * @param outputPath 出力パス
   * @returns 生成したPDFファイルのパス
   */
  async generate(outputPath: string): Promise<void> {
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

  /**
   * 履歴書の枠線を描画する
   * @param doc PDFドキュメント
   */
  private drawPreciseResumeFrame(doc: PDFKit.PDFDocument): void {
    const contentWidth = this.pageWidth - 2 * this.margin;
    const startX = this.margin;

    // Page 1: 個人情報セクション ---------------------------------------------
    const personalInfoY = 100;
    const personalInfoHeight = 280;
    const offsetX = 120;
    const offsetY = 160;

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

    // 個人情報の内部区切り線
    // ふりがな行
    doc
      .moveTo(startX, personalInfoY + 20)
      .lineTo(startX + contentWidth - offsetX, personalInfoY + 20)
      .dash(1, [10, 5])
      .stroke()
      .undash();

    // 氏名行
    doc
      .moveTo(startX, personalInfoY + 60)
      .lineTo(startX + contentWidth - offsetX, personalInfoY + 60)
      .stroke();

    // 生年月日行
    doc
      .moveTo(startX, personalInfoY + 100)
      .lineTo(startX + contentWidth - offsetX, personalInfoY + 100)
      .stroke()
      .moveTo(startX + 60, personalInfoY + 60)
      .lineTo(startX + 60, personalInfoY + 100)
      .stroke()
      .moveTo(startX + 320, personalInfoY + 60)
      .lineTo(startX + 320, personalInfoY + 100)
      .stroke();

    // 連絡先行1（携帯電話・EMAIL）
    doc
      .moveTo(startX, personalInfoY + 100)
      .lineTo(startX + contentWidth - offsetX, personalInfoY + 100)
      .stroke()
      .moveTo(startX + 80, personalInfoY + 100)
      .lineTo(startX + 80, personalInfoY + 120)
      .dash(1, [10, 5])
      .stroke()
      .undash()
      .moveTo(startX + 200, personalInfoY + 100)
      .lineTo(startX + 200, personalInfoY + 120)
      .stroke()
      .moveTo(startX + 280, personalInfoY + 100)
      .lineTo(startX + 280, personalInfoY + 120)
      .dash(1, [10, 5])
      .stroke()
      .undash();

    // 写真下の電話・FAX
    const phoneFaxY = personalInfoY + 120;
    const phoneFaxHalfHeight =
      (personalInfoY + personalInfoHeight - phoneFaxY) / 2;
    const phoneFaxHalfY = phoneFaxY + phoneFaxHalfHeight;

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
    doc
      .moveTo(startX, personalInfoY + 120)
      .lineTo(startX + contentWidth - 120, personalInfoY + 120)
      .stroke();
    // 住所行1（ふりがな）
    doc
      .moveTo(startX, personalInfoY + 140)
      .lineTo(startX + contentWidth - offsetX, personalInfoY + 140)
      .dash(1, [10, 5])
      .stroke()
      .undash();

    // 住所行2
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

    // Page 2を追加 ------------------------------------------------------------
    doc.addPage();

    // Page 2: 資格・免許セクション
    const certificateY = 100;
    const certificateHeight = 140;

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
    const hobbyHeight = 120;

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
    const requestHeight = 120;

    // 外枠（太線）
    doc.lineWidth(2);
    doc.rect(startX, requestY, contentWidth, requestHeight).stroke();
    doc.lineWidth(1);
  }
}
