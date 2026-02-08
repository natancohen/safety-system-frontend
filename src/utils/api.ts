import axios, { type AxiosResponse } from 'axios';

export interface Coordinates { latitude: number; longitude: number; }
export interface Casualty { severity: string; count: number; }

export interface CreateEventDto {
  rightColumn: {
    unitName: string;
    date: string;
    time?: string;
    text: string;
    unitActivityOptions: string;
    activityOptions: string;
    categoryOptions: string;
    categorySubOptions?: string;
    subCategoryOptions?: string;
    subSubCategoryOptions?: string;
  };
  middleColumn: {
    eventFactorOptions?: string;
    eventResultOptions: string;
    eventSeverity: string;
    eventOutcomeByCategory: string;
    damageType?: string;
  };
  fourthColumn: {
    recommendations?: string;
    costAmount?: number;
  };
  leftColumn: {
    location: string;
    locationDescription?: string;
    weather?: string;
    coordinates?: Coordinates;
  };
}

export interface Event {
  unitActivityOptions: string;
  activityOptions: string;
  categoryOptions: string;
  eventFactorOptions?: string;
  eventOutcomeByCategory: string;
  id: number;
  unitName: string;
  date: string;
  time?: string;
  text: string;
  categorySubOptions?: string;
  subCategoryOptions?: string;
  subSubCategoryOptions?: string;

  eventResultOptions: string;
  eventSeverity: string;
  damageType?: string;

  recommendations?: string;
  costAmount?: number;

  location: string;
  locationDescription?: string;
  weather?: string;
  latitude?: number;
  longitude?: number;
  

  status:  'בטיפול' | 'טופל';
}

const API_BASE = import.meta.env.VITE_API_BASE ?? '/api';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

const getJson = async <T>(p: Promise<AxiosResponse<T>>): Promise<T> => (await p).data;

export const getEvents = async (): Promise<Event[]> =>
  getJson(api.get<Event[]>('/events'));

export const getEvent = async (id: number): Promise<Event> =>
  getJson(api.get<Event>(`/events/${id}`));

export const createEvent = async (dto: CreateEventDto): Promise<Event> =>
  getJson(api.post<Event>('/events', dto));

export const updateEvent = async (id: number, dto: Partial<CreateEventDto> | Partial<Event>): Promise<Event> =>
  getJson(api.patch<Event>(`/events/${id}`, dto));

export const updateEventStatus = async (
  id: number,
  status: Event['status'],
): Promise<Event> => getJson(api.patch<Event>(`/events/${id}/status`, { status }));

export const deleteEvent = async (id: number): Promise<void> => {
  await api.delete(`/events/${id}`);
};

export default api;
