// USCS Soil Classification Logic
export type USCSClassification = 'CH' | 'CL' | 'SM' | 'ML' | 'SC' | 'Unknown';

export interface ClassificationResult {
  classification: USCSClassification;
  description: string;
}

const classifyUSCS = (
  sieveNo4: number,
  sieveNo200: number,
  liquidLimit: number,
  plasticLimit: number,
  plasticityIndex: number
): ClassificationResult => {
  // Determine if fine or coarse grained
  const isFineGrained = sieveNo200 > 50;

  if (isFineGrained) {
    // Fine-grained soil (more than 50% passing No. 200 sieve)
    if (liquidLimit >= 50) {
      // High plasticity clays
      return {
        classification: 'CH',
        description: 'High Plasticity Clay',
      };
    } else {
      // Low plasticity clays
      return {
        classification: 'CL',
        description: 'Low Plasticity Clay',
      };
    }
  } else {
    // Coarse-grained soil (less than 50% passing No. 200 sieve)
    const finesPercentage = sieveNo200;

    if (finesPercentage < 5) {
      // Clean sand
      return {
        classification: 'SM',
        description: 'Silty Sand',
      };
    } else if (finesPercentage < 12) {
      // Sand with some fines
      if (plasticityIndex < 4) {
        return {
          classification: 'ML',
          description: 'Silt',
        };
      } else {
        return {
          classification: 'SC',
          description: 'Clayey Sand',
        };
      }
    } else {
      // Sand with significant fines
      if (plasticityIndex < 4) {
        return {
          classification: 'ML',
          description: 'Silt',
        };
      } else {
        return {
          classification: 'SC',
          description: 'Clayey Sand',
        };
      }
    }
  }
};

export const getTreatmentRecommendation = (classification: USCSClassification): string => {
  const treatments: Record<USCSClassification, string> = {
    CH: 'Cement Stabilization - Add 3-5% Portland cement by weight',
    CL: 'Lime Stabilization - Add 2-4% hydrated lime by weight',
    SM: 'Compaction - Compact to 95% Standard Proctor density',
    ML: 'Drainage Improvement - Install drainage layer and improve moisture control',
    SC: 'Mechanical Stabilization - Use mechanical methods or add stabilizing agent',
    Unknown: 'Consult with geotechnical engineer for proper treatment',
  };

  return treatments[classification];
};

export const classificationService = {
  classify(
    sieveNo200: number,
    sieveNo4: number,
    liquidLimit: number,
    plasticLimit: number,
    plasticityIndex: number
  ): {
    classification: string;
    description: string;
    treatment: string;
  } {
    const result = classifyUSCS(
      sieveNo4,
      sieveNo200,
      liquidLimit,
      plasticLimit,
      plasticityIndex
    );

    return {
      classification: result.classification,
      description: result.description,
      treatment: getTreatmentRecommendation(result.classification),
    };
  },
};
