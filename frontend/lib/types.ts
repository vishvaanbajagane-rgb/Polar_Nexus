export type UserRole = 'public' | 'educator' | 'researcher' | 'admin';
export type PolarRegion = 'arctic' | 'antarctic' | 'himalaya' | 'southern_ocean' | 'global';
export type AccessLevel = 'public' | 'educator' | 'researcher' | 'restricted';
export type ExpeditionStatus = 'planned' | 'ongoing' | 'completed' | 'cancelled';
export type EventSeverity = 'low' | 'moderate' | 'high' | 'critical';
export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  age?: number | string;
  doctorate_degree?: string;
  worked_in?: string;
  worked_as?: string;
  location?: string;
  field_of_research?: string;
  organization?: string | null;
  country?: string | null;
  orcid_id?: string | null;
  avatar_url?: string | null;
  is_active?: boolean;
  is_verified?: boolean;
  is_approved?: boolean;
  last_login_at?: string | null;
  created_at: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

export interface Page<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface Dataset {
  id: string;
  title: string;
  description?: string | null;
  category?: string | null;
  region: PolarRegion;
  source?: string | null;
  source_url?: string | null;
  file_format?: string | null;
  size_mb?: number | null;
  variables?: string[] | null;
  access_level: AccessLevel;
  temporal_start?: string | null;
  temporal_end?: string | null;
  download_count: number;
  is_live: boolean;
  last_synced_at?: string | null;
  created_at: string;
}

export interface Publication {
  id: string;
  title: string;
  abstract?: string | null;
  doi?: string | null;
  journal?: string | null;
  authors?: string[] | null;
  keywords?: string[] | null;
  region: PolarRegion;
  published_on?: string | null;
  citation_count: number;
  source?: string | null;
  url?: string | null;
  is_open_access: boolean;
  created_at: string;
}

export interface Scientist {
  id: string;
  full_name: string;
  orcid_id?: string | null;
  institution?: string | null;
  country?: string | null;
  specialization?: string | null;
  bio?: string | null;
  photo_url?: string | null;
  h_index: number;
  citation_count: number;
  publication_count: number;
  is_active: boolean;
}

export interface Station {
  id: string;
  name: string;
  code?: string | null;
  country?: string | null;
  operator?: string | null;
  region: PolarRegion;
  latitude: number;
  longitude: number;
  elevation_m?: number | null;
  established_year?: number | null;
  is_operational: boolean;
  current_temperature_c?: number | null;
  current_wind_kph?: number | null;
  last_reading_at?: string | null;
  description?: string | null;
}

export interface Expedition {
  id: string;
  name: string;
  code?: string | null;
  objective?: string | null;
  region: PolarRegion;
  status: ExpeditionStatus;
  start_date?: string | null;
  end_date?: string | null;
  vessel?: string | null;
  team_size?: number | null;
  created_at: string;
}

export interface EnvironmentalEvent {
  id: string;
  title: string;
  event_type: string;
  description?: string | null;
  region: PolarRegion;
  severity: EventSeverity;
  latitude?: number | null;
  longitude?: number | null;
  metric_value?: number | null;
  metric_unit?: string | null;
  occurred_on?: string | null;
  source?: string | null;
  source_url?: string | null;
}

export interface ObservationPoint {
  observed_on: string;
  value: number;
  unit?: string | null;
  variable: string;
  region: PolarRegion;
}

export interface DashboardStats {
  total_datasets: number;
  total_publications: number;
  total_scientists: number;
  total_stations: number;
  active_expeditions: number;
  pending_applications: number;
  latest_sea_ice_extent_mkm2?: number | null;
  sea_ice_trend: ObservationPoint[];
  recent_events: EnvironmentalEvent[];
  last_daily_update?: string | null;
}

export interface RegionSummary {
  region: PolarRegion;
  label: string;
  color: string;
  sea_ice_extent_mkm2?: number | null;
  temperature_anomaly_c?: number | null;
  station_count: number;
  dataset_count: number;
  active_expeditions: number;
}

export interface MapConfig {
  maptiler_api_key: string;
  styles: { basemap: string; satellite: string };
  attribution: string;
  regions: { region: PolarRegion; label: string; color: string }[];
}

export interface ResearcherApplication {
  id: string;
  user_id: string;
  institution: string;
  designation?: string | null;
  research_area?: string | null;
  orcid_id?: string | null;
  motivation?: string | null;
  status: ApplicationStatus;
  review_notes?: string | null;
  reviewed_at?: string | null;
  created_at: string;
  user?: User | null;
}

export interface DailyUpdateLog {
  id: string;
  task_name: string;
  source?: string | null;
  status: string;
  records_created: number;
  records_updated: number;
  message?: string | null;
  duration_seconds?: number | null;
  started_at: string;
  finished_at?: string | null;
}

export interface AssistantAnswer {
  answer: string;
  sources: string[];
  suggestions: string[];
}
