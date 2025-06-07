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
}
