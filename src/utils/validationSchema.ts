import { z } from 'zod';

export const formSchema = z.object({
  unitName: z.string().min(1, 'יש לבחור יחידת משנה'),
  date: z.string().min(1, 'יש להזין תאריך'),
  text: z.string().min(1, 'יש להזין תיאור מפורט').max(800, 'התיאור ארוך מדי'),
  unitActivityType: z.string().min(1, 'יש לבחור מאפיין פעילות יחידה'),
  activityType: z.string().min(1, 'יש לבחור מאפיין פעילות פרט'),
  category: z.string().min(1, 'יש לבחור מאפיין פעילות תחומי'),
  eventSeverity: z.string().min(1, 'יש לבחור חומרת אירוע'),
  eventOutcome: z.string().min(1, 'יש לבחור תוצאת אירוע'),
  damageType: z.string().min(1, 'יש לבחור חומרת נזק לרכוש'),
  location: z.string().min(1, 'יש לבחור מיקום'),
  locationDescription: z.string().max(800, 'תיאור המיקום ארוך מדי').optional(),
  weather: z.string().optional(),
  coordinates: z.object({
    latitude: z.string().optional(),
    longitude: z.string().optional()
  }),
  casualties: z.array(z.object({
    severity: z.string().min(1, 'יש לבחור חומרת פציעה'),
    count: z.number().min(1, 'מספר נפגעים חייב להיות לפחות 1').max(100, 'מספר נפגעים גבוה מדי')
  })),
  subSubCategoryOptions: z.string().optional(),
  recommendations: z.string().max(800, 'ההמלצות ארוכות מדי').optional(),
  costAmount: z.number().optional(),
  categorySubOptions: z.string().min(1, 'יש לבחור גורמים לאירוע'),
  subCategoryOptions: z.string().min(1, 'יש לבחור תת-קטגוריה')
});

export type FormData = z.infer<typeof formSchema>;