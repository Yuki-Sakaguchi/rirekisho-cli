import { PDFGenerator } from "../core/pdf-generator";

// PDFGeneratorのprivateメソッドをテストするためのクラス拡張
class TestPDFGenerator extends PDFGenerator {
  public testParseEducationDate(dateString: string) {
    return (this as any).parseEducationDate(dateString);
  }

  public testFormatBirthDate(dateString: string) {
    return (this as any).formatBirthDate(dateString);
  }

  public testParseAddress(address: string) {
    return (this as any).parseAddress(address);
  }
}

describe("Date and Address Parsing", () => {
  let generator: TestPDFGenerator;

  beforeEach(() => {
    generator = new TestPDFGenerator();
  });

  describe("教育・職歴日付の解析", () => {
    test("標準的な日付形式を正しく解析する", () => {
      const result = generator.testParseEducationDate("2020-04");
      expect(result).toEqual({ year: "2020", month: "4" });
    });

    test("現在を正しく解析する", () => {
      const result = generator.testParseEducationDate("現在");
      expect(result.year).toBe("2025");
      expect(result.month).toBe("2");
    });

    test("年月スペース形式を解析する", () => {
      const result = generator.testParseEducationDate("2018 3");
      expect(result).toEqual({ year: "2018", month: "3" });
    });
  });

  describe("生年月日のフォーマット", () => {
    test("平成生まれの日付を正しくフォーマットする", () => {
      const result = generator.testFormatBirthDate("1995-06-04");
      expect(result).toBe("1995年 6月 4日");
    });

    test("令和生まれの日付を正しくフォーマットする", () => {
      const result = generator.testFormatBirthDate("2020-01-01");
      expect(result).toBe("2020年 1月 1日");
    });
  });

  describe("住所の解析", () => {
    test("郵便番号付きの住所を正しく解析する", () => {
      const result = generator.testParseAddress(
        "〒166-0003 東京都杉並区高円寺南1-7-3"
      );
      expect(result.postalCode).toBe("166-0003");
      expect(result.address).toBe("東京都杉並区高円寺南1-7-3");
    });

    test("郵便番号なしの住所も処理できる", () => {
      const result = generator.testParseAddress("東京都新宿区西新宿1-1-1");
      expect(result.postalCode).toBe("");
      expect(result.address).toBe("東京都新宿区西新宿1-1-1");
    });

    test("〒記号なしの郵便番号も解析する", () => {
      const result = generator.testParseAddress("100-0001 東京都千代田区");
      expect(result.postalCode).toBe("100-0001");
      expect(result.address).toBe("東京都千代田区");
    });
  });
});
