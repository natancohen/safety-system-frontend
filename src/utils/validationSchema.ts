import { z } from 'zod';

export const formSchema = z.object({
  unitName: z.string().min(1, 'יחידת משנה הינה שדה חובה'),
  date: z.string().min(1, 'תאריך הינו שדה חובה'),
  time: z.string().min(1, 'שעה הינה שדה חובה'),
  text: z.string().max(800, 'תיאור לא יכול לעבור 800 תווים'),
  unitActivityType: z.string().min(1, 'מאפיין פעילות יחידה הינו שדה חובה'),
  activityType: z.string().min(1, 'מאפיין פעילות פרט הינו שדה חובה'),
  category: z.string().min(1, 'מאפיין פעילות תחומי הינו שדה חובה'),
  
  categorySubOptions: z.string().min(1, 'קטגוריית פעילות תחומי הינה שדה חובה'),
  subCategoryOptions: z.string().min(1, 'תת קטגוריית פעילות תחומי הינה שדה חובה'),
  subSubCategoryOptions: z.string().optional(),
  
  eventFactor: z.string().min(1, 'גורמים לאירוע הינו שדה חובה'),
  
  eventSeverity: z.string().min(1, 'חומרת אירוע הינה שדה חובה'),
  eventOutcome: z.string().min(1, 'תוצאת אירוע הינה שדה חובה'),
  damageType: z.string().min(1, 'חומרת נזק לרכוש הינה שדה חובה'),
  location: z.string().min(1, 'מיקום הינו שדה חובה'),
  locationDescription: z.string().optional(),
  weather: z.string().min(1, 'מזג אוויר הינו שדה חובה'),
  coordinates: z.object({
    latitude: z.string().optional(),
    longitude: z.string().optional()
  }),
  recommendations: z.string().optional(),
  costAmount: z.number().optional(),
  casualties: z.array(z.object({
    severity: z.string().min(1, 'חומרת פגיעה הינה שדה חובה'),
    count: z.number().min(1, 'מספר נפגעים חייב להיות לפחות 1')
  })).optional()
});

export type FormData = z.infer<typeof formSchema>;