import { z } from "zod";

export const PersonalInfoSchema = z.object({
  name: z.object({
    kanji: z.string().min(1, "氏名は必須です"),
    furigana: z.string().min(1, "ふりがなは必須です"),
  }),
  birth_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "生年月日はYYYY-MM-DD形式で入力してください"),
  address: z.string().min(1, "住所は必須です"),
  phone: z.string().min(1, "電話番号は必須です"),
  email: z.string().email("正しいメールアドレスを入力してください"),
});

export const WorkExperienceSchema = z.object({
  date: z.string(),
  type: z.enum(["入社", "退職", "在職中"]),
  company: z.string(),
  detail: z.string().optional(),
});

export const EducationSchema = z.object({
  date: z.string(),
  type: z.enum(["入学", "卒業"]),
  institution: z.string(),
});

export const ResumeSchema = z.object({
  personal_info: PersonalInfoSchema,
  education: z.array(EducationSchema),
  work_experience: z.array(WorkExperienceSchema),
});

export type ResumeData = z.infer<typeof ResumeSchema>;
