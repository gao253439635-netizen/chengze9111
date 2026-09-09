import { z } from 'zod';

/** 接单线索创建：contact 必填，其余字段长度受限。 */
export const leadCreateSchema = z.object({
  name: z.string().max(100).optional(),
  contact: z.string().min(1).max(100),
  project: z.string().max(100).optional(),
  budget: z.string().max(100).optional(),
  message: z.string().max(2000).optional(),
  source: z.string().max(50).optional(),
  category: z.string().max(100).optional(),
  intent: z.string().max(20).optional(),
});

/** 图片上传：filename 可选，data 为 data:image/...;base64,。 */
export const uploadSchema = z.object({
  filename: z.string().optional(),
  data: z.string().min(1),
});
