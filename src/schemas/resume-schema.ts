import { z } from "zod";

export const PersonalInfoSchema = z.object({
  name: z.object({
    kanji: z.string().min(1, "氏名は必須です"),
    furigana: z.string().min(1, "ふりがなは必須です"),
  }),
  birth_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "生年月日はYYYY-MM-DD形式で入力してください"),
  age: z.number().optional(),
  gender: z.enum(["男", "女"]).optional(),
  address: z.string().min(1, "住所は必須です"),
  phone: z.string().min(1, "電話番号は必須です"),
  email: z.string().email("正しいメールアドレスを入力してください"),
  landline: z.string().optional(), // 固定電話
  fax: z.string().optional(), // FAX
});

export const WorkExperienceSchema = z.object({
  date: z.string(),
  type: z.enum(["入社", "退職", "在職中"]),
  company: z.string(),
  detail: z.string().optional(),
});

export const EducationSchema = z.object({
  date: z.string(),
  type: z.enum(["入学", "卒業", "修了", "中退"]),
  institution: z.string(),
});

export const CertificationSchema = z.object({
  date: z.string(),
  name: z.string(),
});

export const AdditionalInfoSchema = z.object({
  motivation: z.string().optional(), // 志望動機
  self_pr: z.string().optional(), // 自己PR・趣味特技
  skills: z.string().optional(), // スキル・趣味特技
  other: z.string().optional(), // 本人希望記入欄
  commute_time: z.string().optional(), // 通勤時間
  family_dependents: z.number().optional(), // 扶養家族数
  spouse: z.boolean().optional(), // 配偶者の有無
  spouse_support: z.boolean().optional(), // 配偶者の扶養義務
});

export const ResumeSchema = z.object({
  personal_info: PersonalInfoSchema,
  education: z.array(EducationSchema),
  work_experience: z.array(WorkExperienceSchema),
  certifications: z.array(CertificationSchema).optional(),
  additional_info: AdditionalInfoSchema.optional(),
});

export type ResumeData = z.infer<typeof ResumeSchema>;
