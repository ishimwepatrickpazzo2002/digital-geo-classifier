export interface SoilInputs {
  percentPassing200: number;
  percentPassing4: number;
  liquidLimit?: number;
  plasticLimit?: number;
}

export interface ClassificationResult {
  soilClass: string;
  soilDescription: string;
  plasticityLevel: string;
  confidence: number;
  treatment: string;
  treatmentDetails: TreatmentDetails;
  engineeringCharacteristics: string[];
  composition: { name: string; value: number; color: string }[];
  engineeringProperties: { property: string; rating: number; max: number }[];
}

export interface TreatmentDetails {
  method: string;
  explanation: string;
  advantages: string[];
  constructionSuitability: string;
  severity: 'low' | 'moderate' | 'high' | 'critical';
}

const TREATMENT_MAP: Record<string, TreatmentDetails> = {
  'Lime Stabilization': {
    method: 'Lime Stabilization',
    explanation: 'Adding lime (calcium oxide or calcium hydroxide) reacts with clay minerals to improve strength and reduce plasticity through pozzolanic reactions.',
    advantages: ['Reduces plasticity index', 'Increases bearing capacity', 'Reduces swell potential', 'Cost-effective for large volumes'],
    constructionSuitability: 'Subgrade improvement, road base, embankments',
    severity: 'moderate',
  },
  'Cement Stabilization': {
    method: 'Cement Stabilization',
    explanation: 'Portland cement binds soil particles through hydration reactions, significantly increasing compressive strength and durability of high-plasticity clays.',
    advantages: ['High strength gain', 'Durable long-term performance', 'Reduces permeability', 'Applicable to wide soil types'],
    constructionSuitability: 'Pavement base, deep foundations, retaining structures',
    severity: 'high',
  },
  'Compaction': {
    method: 'Compaction',
    explanation: 'Mechanical densification reduces void ratio, increases density, and improves engineering properties through controlled compaction equipment.',
    advantages: ['Simple and economical', 'Improves bearing capacity', 'Reduces settlement', 'No additives required'],
    constructionSuitability: 'Fills, embankments, general earthworks, road subgrade',
    severity: 'low',
  },
  'Drainage Improvement': {
    method: 'Drainage Improvement',
    explanation: 'Installing drainage systems (French drains, wick drains) to reduce pore water pressure and improve consolidation in silty soils.',
    advantages: ['Reduces pore pressure', 'Accelerates consolidation', 'Improves stability', 'Prevents frost heave'],
    constructionSuitability: 'Waterlogged sites, slopes, retaining walls, foundations',
    severity: 'moderate',
  },
  'Mechanical Stabilization': {
    method: 'Mechanical Stabilization',
    explanation: 'Blending granular materials to achieve optimal gradation and improve load-bearing characteristics of silty/sandy soils.',
    advantages: ['Improves gradation', 'Increases friction angle', 'Cost-effective', 'Uses local materials'],
    constructionSuitability: 'Road base, unpaved surfaces, general fill',
    severity: 'low',
  },
  'Geosynthetic Reinforcement': {
    method: 'Geosynthetic Reinforcement',
    explanation: 'Using geotextiles or geogrids to reinforce poorly-graded soils, distributing loads and preventing shear failure.',
    advantages: ['Rapid installation', 'High tensile strength', 'Long service life', 'Minimal site disruption'],
    constructionSuitability: 'Soft ground foundations, steep slopes, retaining walls',
    severity: 'high',
  },
  'Cement + Drainage Combination': {
    method: 'Cement + Drainage Combination',
    explanation: 'Combined approach of cement stabilization and improved drainage for organic silts, addressing both strength and moisture issues.',
    advantages: ['Comprehensive treatment', 'Improves both strength and drainage', 'Reduces organic activity', 'Long-term stability'],
    constructionSuitability: 'Organic silt sites, waterfront construction, weak subgrade',
    severity: 'critical',
  },
  'Vibroflotation / Densification': {
    method: 'Vibroflotation / Densification',
    explanation: 'Vibro-compaction or stone columns improve loose sand deposits by densification and drainage, reducing liquefaction risk.',
    advantages: ['Deep improvement', 'Reduces liquefaction potential', 'Increases relative density', 'Minimal material usage'],
    constructionSuitability: 'Loose sand sites, seismic zones, port and harbor works',
    severity: 'high',
  },
};

export function classifySoil(inputs: SoilInputs): ClassificationResult {
  const { percentPassing200, percentPassing4, liquidLimit = 0, plasticLimit = 0 } = inputs;
  const pi = liquidLimit - plasticLimit;

  let soilClass = 'GW';
  let soilDescription = '';
  let plasticityLevel = '';
  let confidence = 92;
  let treatment = 'Compaction';
  let engineeringCharacteristics: string[] = [];

  if (percentPassing200 > 50) {
    // Fine-grained soil
    if (liquidLimit < 50) {
      if (pi > 7) {
        soilClass = 'CL';
        soilDescription = 'Lean Clay (Clay with Low Plasticity)';
        plasticityLevel = 'Low Plasticity';
        treatment = 'Lime Stabilization';
        confidence = 94;
        engineeringCharacteristics = ['Low to medium compressibility', 'Medium shear strength', 'Low permeability', 'Moderate swelling potential', 'Suitable for compaction with moisture control'];
      } else if (pi >= 4 && pi <= 7) {
        soilClass = 'CL-ML';
        soilDescription = 'Silty Clay (Borderline Clay-Silt)';
        plasticityLevel = 'Low to Medium Plasticity';
        treatment = 'Lime Stabilization';
        confidence = 87;
        engineeringCharacteristics = ['Variable properties', 'Medium compressibility', 'Low permeability', 'Moderate strength', 'Requires moisture control'];
      } else {
        soilClass = 'ML';
        soilDescription = 'Silt with Low Plasticity (Inorganic Silt)';
        plasticityLevel = 'Non-Plastic to Low Plasticity';
        treatment = 'Drainage Improvement';
        confidence = 91;
        engineeringCharacteristics = ['Sensitive to frost', 'Low cohesion', 'Medium permeability', 'Susceptible to piping', 'Poor when saturated'];
      }
    } else {
      if (pi > 0.73 * (liquidLimit - 20)) {
        soilClass = 'CH';
        soilDescription = 'Fat Clay (Clay with High Plasticity)';
        plasticityLevel = 'High Plasticity';
        treatment = 'Cement Stabilization';
        confidence = 96;
        engineeringCharacteristics = ['High compressibility', 'High swelling/shrinking', 'Low permeability', 'High cohesion', 'Difficult to compact'];
      } else {
        soilClass = 'MH';
        soilDescription = 'Elastic Silt (Silt with High Plasticity)';
        plasticityLevel = 'High Plasticity';
        treatment = 'Cement + Drainage Combination';
        confidence = 89;
        engineeringCharacteristics = ['High compressibility', 'Very sensitive', 'High void ratio', 'Low bearing capacity', 'Expansive when wetted'];
      }
    }
  } else {
    // Coarse-grained soil
    const finesContent = percentPassing200;
    const sandContent = percentPassing4 - percentPassing200;
    const gravelContent = 100 - percentPassing4;

    if (gravelContent > sandContent) {
      // Gravel
      if (finesContent < 5) {
        soilClass = finesContent < 2 ? 'GW' : 'GP';
        soilDescription = soilClass === 'GW' ? 'Well-Graded Gravel' : 'Poorly-Graded Gravel';
        plasticityLevel = 'Non-Plastic';
        treatment = 'Compaction';
        confidence = 93;
        engineeringCharacteristics = ['Excellent drainage', 'High shear strength', 'Low compressibility', 'High bearing capacity', 'Good for foundations'];
      } else if (finesContent <= 12) {
        soilClass = pi < 4 ? 'GM' : 'GC';
        soilDescription = soilClass === 'GM' ? 'Silty Gravel' : 'Clayey Gravel';
        plasticityLevel = soilClass === 'GM' ? 'Non-Plastic' : 'Low Plasticity';
        treatment = soilClass === 'GM' ? 'Compaction' : 'Mechanical Stabilization';
        confidence = 90;
        engineeringCharacteristics = ['Good strength', 'Moderate drainage', 'Low to medium compressibility', 'Suitable for base courses', 'Requires moisture control'];
      } else {
        soilClass = pi < 4 ? 'GM' : 'GC';
        soilDescription = soilClass === 'GM' ? 'Silty Gravel (High Fines)' : 'Clayey Gravel (High Fines)';
        plasticityLevel = soilClass === 'GM' ? 'Non-Plastic' : 'Low Plasticity';
        treatment = soilClass === 'GM' ? 'Mechanical Stabilization' : 'Lime Stabilization';
        confidence = 88;
        engineeringCharacteristics = ['Moderate strength', 'Reduced drainage', 'Medium compressibility', 'Fines affect performance', 'Moisture sensitive'];
      }
    } else {
      // Sand
      if (finesContent < 5) {
        soilClass = finesContent < 2 ? 'SW' : 'SP';
        soilDescription = soilClass === 'SW' ? 'Well-Graded Sand' : 'Poorly-Graded Sand';
        plasticityLevel = 'Non-Plastic';
        treatment = soilClass === 'SP' ? 'Vibroflotation / Densification' : 'Compaction';
        confidence = 92;
        engineeringCharacteristics = ['Good drainage', 'Medium shear strength', 'Low cohesion', 'Susceptible to liquefaction (loose)', 'Good for fills when compacted'];
      } else if (finesContent <= 12) {
        soilClass = pi < 4 ? 'SM' : 'SC';
        soilDescription = soilClass === 'SM' ? 'Silty Sand' : 'Clayey Sand';
        plasticityLevel = soilClass === 'SM' ? 'Non-Plastic' : 'Low Plasticity';
        treatment = soilClass === 'SM' ? 'Compaction' : 'Mechanical Stabilization';
        confidence = 91;
        engineeringCharacteristics = ['Moderate strength', 'Limited drainage', 'Low to medium compressibility', 'Sensitive to moisture', 'Requires controlled compaction'];
      } else {
        soilClass = pi < 4 ? 'SM' : 'SC';
        soilDescription = soilClass === 'SM' ? 'Silty Sand (High Fines)' : 'Clayey Sand (High Fines)';
        plasticityLevel = soilClass === 'SM' ? 'Non-Plastic' : 'Low Plasticity';
        treatment = soilClass === 'SM' ? 'Drainage Improvement' : 'Lime Stabilization';
        confidence = 88;
        engineeringCharacteristics = ['Lower strength', 'Poor drainage', 'Medium compressibility', 'High fines content', 'Moisture-sensitive'];
      }
    }
  }

  const treatmentDetails = TREATMENT_MAP[treatment] ?? TREATMENT_MAP['Compaction'];

  const gravelPct = Math.max(0, 100 - percentPassing4);
  const sandPct = Math.max(0, percentPassing4 - percentPassing200);
  const siltClay = percentPassing200;

  const composition = [
    { name: 'Gravel', value: Math.round(gravelPct), color: '#94a3b8' },
    { name: 'Sand', value: Math.round(sandPct), color: '#d38432' },
    { name: 'Silt/Clay', value: Math.round(siltClay), color: '#497fb0' },
  ].filter(c => c.value > 0);

  const engineeringProperties = [
    { property: 'Bearing Capacity', rating: Math.min(10, Math.round(10 - siltClay / 15)), max: 10 },
    { property: 'Drainage', rating: Math.min(10, Math.round(gravelPct / 12 + sandPct / 20 + 1)), max: 10 },
    { property: 'Compressibility', rating: Math.min(10, Math.round(siltClay / 10 + pi / 8)), max: 10 },
    { property: 'Shear Strength', rating: Math.min(10, Math.round(10 - siltClay / 14 + (pi > 0 ? 1 : 0))), max: 10 },
    { property: 'Workability', rating: Math.min(10, Math.round(gravelPct / 15 + sandPct / 20 + 2)), max: 10 },
  ];

  return {
    soilClass,
    soilDescription,
    plasticityLevel,
    confidence,
    treatment,
    treatmentDetails,
    engineeringCharacteristics,
    composition,
    engineeringProperties,
  };
}

export const SOIL_CLASS_COLORS: Record<string, string> = {
  GW: '#22c55e', GP: '#86efac', GM: '#84cc16', GC: '#a3e635',
  SW: '#f59e0b', SP: '#fbbf24', SM: '#d97706', SC: '#b45309',
  ML: '#60a5fa', CL: '#3b82f6', OL: '#93c5fd',
  MH: '#818cf8', CH: '#6366f1', OH: '#a5b4fc',
  PT: '#ef4444',
  'CL-ML': '#7dd3fc',
};

export const USCS_GROUPS = [
  { class: 'GW', group: 'Gravel', description: 'Well-Graded Gravel' },
  { class: 'GP', group: 'Gravel', description: 'Poorly-Graded Gravel' },
  { class: 'GM', group: 'Gravel', description: 'Silty Gravel' },
  { class: 'GC', group: 'Gravel', description: 'Clayey Gravel' },
  { class: 'SW', group: 'Sand', description: 'Well-Graded Sand' },
  { class: 'SP', group: 'Sand', description: 'Poorly-Graded Sand' },
  { class: 'SM', group: 'Sand', description: 'Silty Sand' },
  { class: 'SC', group: 'Sand', description: 'Clayey Sand' },
  { class: 'ML', group: 'Silt', description: 'Inorganic Silt, Low Plasticity' },
  { class: 'CL', group: 'Clay', description: 'Inorganic Clay, Low Plasticity' },
  { class: 'MH', group: 'Silt', description: 'Elastic Silt, High Plasticity' },
  { class: 'CH', group: 'Clay', description: 'Fat Clay, High Plasticity' },
  { class: 'OL', group: 'Organic', description: 'Organic Clay/Silt, Low Plasticity' },
  { class: 'OH', group: 'Organic', description: 'Organic Clay/Silt, High Plasticity' },
  { class: 'PT', group: 'Peat', description: 'Peat and Muck' },
];
