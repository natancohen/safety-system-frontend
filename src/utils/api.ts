import axios from 'axios';

const API_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Event {
  id: number;
  unitName: string;
  date: string;
  time?: string;
  category: string;
  eventSeverity: string;
  eventResult: string;
  eventOutcome: string;
  damageType?: string;
  location: string;
  locationDescription?: string;
  weather?: string;
  text: string;
  unitActivityType: string;
  activityType: string;
  investigation?: string;
  coordinates: {
    latitude: string;
    longitude: string;
  };
  casualties?: Array<{
    severity: string;
    count: number;
  }>;
  subSubCategoryOptions?: string;
  recommendations?: string;
  costAmount?: number;
  categorySubOptions?: string;
  subCategoryOptions?: string;
  eventFactor?: string;
  createdAt: string;
  status: string;
  imageUrl?: string;
}

export interface CreateEventDto {
  unitName: string;
  date: string;
  time?: string;
  category: string;
  eventSeverity: string;
  eventOutcome: string;
  damageType?: string;
  location: string;
  locationDescription?: string;
  weather?: string;
  text: string;
  unitActivityType: string;
  activityType: string;
  investigation?: string;
  coordinates: {
    latitude: string;
    longitude: string;
  };
  casualties?: Array<{
    severity: string;
    count: number;
  }>;
  subSubCategoryOptions?: string;
  recommendations?: string;
  costAmount?: number;
  categorySubOptions?: string;
  subCategoryOptions?: string;
  eventFactor?: string;
}

// קבלת כל האירועים
export const getEvents = async (): Promise<Event[]> => {
  const response = await api.get<Event[]>('/events');
  return response.data;
};

// קבלת אירוע בודד
export const getEvent = async (id: number): Promise<Event> => {
  const response = await api.get<Event>(`/events/${id}`);
  return response.data;
};

// יצירת אירוע חדש
export const createEvent = async (eventData: CreateEventDto): Promise<Event> => {
  const response = await api.post<Event>('/events', eventData);
  return response.data;
};

// עדכון אירוע
export const updateEvent = async (id: number, eventData: Partial<Event>): Promise<Event> => {
  const response = await api.put<Event>(`/events/${id}`, eventData);
  return response.data;
};

// מחיקת אירוע
export const deleteEvent = async (id: number): Promise<void> => {
  await api.delete(`/events/${id}`);
};

export default api;