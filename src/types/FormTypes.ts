
export interface FormData {
  unitName: string;
  date: string;
  text: string;
  unitActivityType: string;
  activityType: string;
  category: string;
  eventSeverity: string;
  eventOutcome: string;
  damageType: string;
  location: string;
  locationDescription?: string;
  weather?: string;
  coordinates: {
    latitude?: string;
    longitude?: string;
  };
  casualties: Array<{
    severity: string;
    count: number;
  }>;
  subSubCategoryOptions?: string;
  recommendations?: string;
  costAmount?: number;
  categorySubOptions: string;
  subCategoryOptions: string;
}

export interface Casualty {
  severity: string;
  count: number;
}

