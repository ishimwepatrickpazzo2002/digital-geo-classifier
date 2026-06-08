import { eq, and, desc } from 'drizzle-orm';
import { db } from '../db/connection';
import { soilReports, users } from '../schemas/index';
import { classificationService } from './classificationService';
import { AppError, createError } from '../utils/errors';
import type { CreateReportInput } from '../validators/reports';

export const reportService = {
  async createReport(userId: string, input: CreateReportInput) {
    // Get user to verify existence
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));

    if (userResult.length === 0) {
      throw createError(404, 'User not found');
    }

    // Classify soil
    const classification = classificationService.classify(
      input.sieveNo200,
      input.sieveNo4,
      input.liquidLimit,
      input.plasticLimit,
      input.plasticityIndex
    );

    // Create report
    const result = await db
      .insert(soilReports)
      .values({
        userId,
        sampleName: input.sampleName ?? 'Unnamed Sample',
        sieveNo200: input.sieveNo200.toString(),
        sieveNo4: input.sieveNo4.toString(),
        liquidLimit: input.liquidLimit.toString(),
        plasticLimit: input.plasticLimit.toString(),
        plasticityIndex: input.plasticityIndex.toString(),
        soilClassification: classification.classification,
        treatmentRecommendation: classification.treatment,
      })
      .returning();

    const report = result[0];

    return {
      id: report.id,
      userId: report.userId, // Changed from report.user_id
      sampleName: report.sampleName ?? report.sample_name ?? 'Unnamed Sample',
      sieveNo200: parseFloat(report.sieveNo200 as unknown as string), // Changed from report.sieve_no_200
      sieveNo4: parseFloat(report.sieveNo4 as unknown as string), // Changed from report.sieve_no_4
      liquidLimit: parseFloat(report.liquidLimit as unknown as string), // Changed from report.liquid_limit
      plasticLimit: parseFloat(report.plasticLimit as unknown as string), // Changed from report.plastic_limit
      plasticityIndex: parseFloat(report.plasticityIndex as unknown as string), // Changed from report.plasticity_index
      soilClassification: report.soilClassification, // Changed from report.soil_classification
      treatmentRecommendation: report.treatmentRecommendation, // Changed from report.treatment_recommendation
      createdAt: report.createdAt, // Changed from report.created_at
    };
  },

  async getReports(userId: string) {
    const reports = await db
      .select()
      .from(soilReports)
      .where(eq(soilReports.userId, userId))
      .orderBy(desc(soilReports.createdAt));

    return reports.map((report) => ({
      id: report.id,
      userId: report.userId, // Changed from report.user_id
      sampleName: report.sampleName ?? report.sample_name ?? 'Unnamed Sample',
      sieveNo200: parseFloat(report.sieveNo200 as unknown as string),
      sieveNo4: parseFloat(report.sieveNo4 as unknown as string),
      liquidLimit: parseFloat(report.liquidLimit as unknown as string),
      plasticLimit: parseFloat(report.plasticLimit as unknown as string),
      plasticityIndex: parseFloat(report.plasticityIndex as unknown as string),
      soilClassification: report.soilClassification,
      treatmentRecommendation: report.treatmentRecommendation,
      createdAt: report.createdAt,
    }));
  },

  async getReportById(reportId: string, userId: string) {
    const result = await db
      .select()
      .from(soilReports)
      .where(and(eq(soilReports.id, reportId), eq(soilReports.userId, userId)));

    if (result.length === 0) {
      throw createError(404, 'Report not found');
    }

    const report = result[0];

    return {
      id: report.id,
      userId: report.userId, // Changed from report.user_id
      sampleName: report.sampleName ?? report.sample_name ?? 'Unnamed Sample',
      sieveNo200: parseFloat(report.sieveNo200 as unknown as string),
      sieveNo4: parseFloat(report.sieveNo4 as unknown as string),
      liquidLimit: parseFloat(report.liquidLimit as unknown as string),
      plasticLimit: parseFloat(report.plasticLimit as unknown as string),
      plasticityIndex: parseFloat(report.plasticityIndex as unknown as string),
      soilClassification: report.soilClassification,
      treatmentRecommendation: report.treatmentRecommendation,
      createdAt: report.createdAt,
    };
  },

  async deleteReport(reportId: string, userId: string) {
    const result = await db
      .delete(soilReports)
      .where(and(eq(soilReports.id, reportId), eq(soilReports.userId, userId)))
      .returning();

    if (result.length === 0) {
      throw createError(404, 'Report not found');
    }

    return result[0];
  },

  async getDashboardStats(userId: string) {
    const reports = await db
      .select()
      .from(soilReports)
      .where(eq(soilReports.userId, userId));

    const classifications = reports.reduce(
      (acc, report) => {
        acc[report.soilClassification] = (acc[report.soilClassification] || 0) + 1; // Changed from report.soil_classification
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      totalReports: reports.length,
      classifications,
      lastReportDate: reports.length > 0 ? reports[0].createdAt : null, // Changed from reports[0].created_at
    };
  },
};