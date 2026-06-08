import { z } from 'zod';

export const createReportSchema = z.object({
  sampleName: z.string().trim().optional(),
  sieveNo200: z.number().min(0).max(100, 'Sieve No. 200 must be between 0 and 100'),
  sieveNo4: z.number().min(0).max(100, 'Sieve No. 4 must be between 0 and 100'),
  liquidLimit: z.number().min(0).max(100, 'Liquid Limit must be between 0 and 100'),
  plasticLimit: z.number().min(0).max(100, 'Plastic Limit must be between 0 and 100'),
  plasticityIndex: z.number().min(0).max(100, 'Plasticity Index must be between 0 and 100'),
});

export type CreateReportInput = z.infer<typeof createReportSchema>;
