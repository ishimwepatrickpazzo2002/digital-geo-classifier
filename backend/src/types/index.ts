export type User = {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
};

export type SoilReport = {
  id: string;
  userId: string;
  sieveNo200: number;
  sieveNo4: number;
  liquidLimit: number;
  plasticLimit: number;
  plasticityIndex: number;
  soilClassification: string;
  treatmentRecommendation: string;
  createdAt: Date;
};

export type JWTPayload = {
  userId: string;
  email: string;
};

export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};
