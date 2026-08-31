export interface DatasetItem {
  id: string;
  code: string;
  title: string;
  domain: string;
  region: string;
  status: 'Approved' | 'Under Review' | 'Incomplete';
  updated_date: string;
  description: string;
  quality_score?: string;
  parameters: string[];
  spatial_resolution: string;
  temporal_coverage: string;
  format: string;
  file_size: string;
  pi_scientist: string;
  doi?: string;
  source_url: string;
  downloads_count: number;
}

export interface PublicationItem {
  id: string;
  title: string;
  journal: string;
  year: number;
  authors: string;
  domain: string;
  doi: string;
  abstract: string;
  citations: number;
  url: string;
  source_repository: string;
  linked_datasets?: string[];
}

export interface ScientistItem {
  id: string;
  name: string;
  role_title: string;
  domains: string[];
  avatar_color: string;
  bio: string;
  email: string;
  organization: string;
  expeditions: string[];
  stations: string[];
  publication_ids: string[];
  orcid_url: string;
}

export interface StationItem {
  id: string;
  name: string;
  code: string;
  location: string;
  region: 'Antarctic' | 'Arctic' | 'Southern Ocean' | 'Himalayas';
  lat: number;
  lng: number;
  status: 'nominal' | 'degraded' | 'offline';
  established_year: number;
  sensors_active: number;
  live_temp: number;
  live_wind: number;
  live_pressure: number;
  description: string;
  source_telemetry_url: string;
  monthly_temps: number[];
  monthly_wind: number[];
  monthly_ice: number[];
  monthly_radiation: number[];
}

export interface ExpeditionItem {
  id: string;
  code: string;
  title: string;
  vessel: string;
  season: string;
  leader: string;
  region: string;
  dates: string;
  status: 'Completed' | 'Active' | 'Planned';
  objectives: string[];
  stations_visited: string[];
  datasets_collected: number;
  report_url: string;
}

export interface EnvironmentalEventItem {
  id: string;
  title: string;
  category: 'Sea Ice' | 'Glaciology' | 'Atmospheric' | 'Oceanographic';
  severity: 'Critical' | 'Warning' | 'Advisory' | 'Observation';
  date: string;
  location: string;
  coordinates: string;
  description: string;
  anomaly_metric: string;
  source_feed_url: string;
}

export interface MediaStoryItem {
  id: string;
  title: string;
  category: 'Documentary' | 'Field Dispatch' | 'Photo Story' | 'Interview' | 'Daily Live Video';
  duration: string;
  date: string;
  thumbnail_url: string;
  video_url?: string;
  youtube_id?: string;
  author: string;
  summary: string;
  location: string;
  source_url: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'success' | 'alert' | 'system';
  read: boolean;
  link_tab?: string;
  target_role?: 'all' | 'admin' | 'researcher' | 'educator' | 'public';
  target_email?: string;
}

export const INITIAL_DATASETS: DatasetItem[] = [
  {
    id: 'ds-1',
    code: 'NCPOR-BIO-0073',
    title: 'Antarctic coastal phytoplankton biomass survey',
    domain: 'Biology',
    region: 'Antarctic coast',
    status: 'Approved',
    quality_score: '69%',
    updated_date: '2026-08-14',
    description: 'Coastal phytoplankton chlorophyll-a biomass and community composition along the Indian Antarctic sector.',
    parameters: ['Chlorophyll-a', 'HPLC Pigments', 'Microplankton Cell Counts', 'Water Salinity', 'PAR Radiance'],
    spatial_resolution: '0.05° Grid',
    temporal_coverage: '2023-11 to 2026-02',
    format: 'NetCDF / CSV',
    file_size: '342 MB',
    pi_scientist: 'Dr. Rahul Mohan',
    doi: '10.5067/NCPOR/BIO-0073-V2',
    source_url: 'https://doi.org/10.1594/PANGAEA.948201',
    downloads_count: 312,
  },
  {
    id: 'ds-2',
    code: 'NCPOR-CLM-0094',
    title: 'Antarctic Peninsula air temperature reanalysis subset',
    domain: 'Climate',
    region: 'Antarctic Peninsula',
    status: 'Approved',
    quality_score: '90%',
    updated_date: '2026-08-10',
    description: 'High-resolution reanalysis subset of 2 m air temperature over the Antarctic Peninsula, pending verification against station records.',
    parameters: ['2m Air Temperature', 'Skin Temperature', 'Sensible Heat Flux', 'Surface Wind Vectors'],
    spatial_resolution: '3 km WRF model grid',
    temporal_coverage: '1989-01 to 2026-06',
    format: 'GRIB2 / NetCDF4',
    file_size: '1.8 GB',
    pi_scientist: 'Dr. Thamban Meloth',
    doi: '10.5067/NCPOR/CLM-0094-V1',
    source_url: 'https://doi.org/10.5067/NCPOR/CLM-0094-V1',
    downloads_count: 580,
  },
  {
    id: 'ds-3',
    code: 'NCPOR-SI-0207',
    title: 'Weddell Sea sea-ice thickness composite',
    domain: 'Sea Ice',
    region: 'Weddell Sea',
    status: 'Approved',
    quality_score: '78%',
    updated_date: '2026-07-28',
    description: 'Satellite-altimetry and in-situ upward-looking sonar composite of Weddell Sea sea-ice thickness, currently under expert review.',
    parameters: ['Sea Ice Thickness', 'Snow Depth', 'Freeboard Height', 'Ice Concentration'],
    spatial_resolution: '12.5 km Polar Stereographic',
    temporal_coverage: '2010-09 to 2026-05',
    format: 'GeoTIFF / HDF5',
    file_size: '890 MB',
    pi_scientist: 'Dr. Rohit Srivastava',
    doi: '10.5067/NCPOR/SI-0207-V3',
    source_url: 'https://nsidc.org/data/polar-sea-ice',
    downloads_count: 425,
  },
  {
    id: 'ds-4',
    code: 'NCPOR-SI-0228',
    title: 'Ross Sea polynya extent record',
    domain: 'Sea Ice',
    region: 'Ross Sea',
    status: 'Approved',
    quality_score: '74%',
    updated_date: '2026-07-15',
    description: 'Polynya extent and ice-production estimates for the Ross Sea; missing 2022 winter gap marked as incomplete.',
    parameters: ['Polynya Area (km²)', 'Thin Ice Fraction', 'Latent Heat Flux', 'Katabatic Wind Index'],
    spatial_resolution: '6.25 km',
    temporal_coverage: '2002-04 to 2026-04',
    format: 'CSV / NetCDF',
    file_size: '185 MB',
    pi_scientist: 'Dr. Rohit Srivastava',
    doi: '10.5067/NCPOR/SI-0228-V1',
    source_url: 'https://doi.org/10.5067/NCPOR/SI-0228-V1',
    downloads_count: 278,
  },
  {
    id: 'ds-5',
    code: 'NCPOR-OCN-0119',
    title: 'Kongsfjorden hydrography and fjord heat content',
    domain: 'Hydrography',
    region: 'Svalbard',
    status: 'Approved',
    quality_score: '83%',
    updated_date: '2026-06-30',
    description: 'Hydrographic transects and heat-content estimates for Kongsfjorden, Svalbard, tracking Atlantic water intrusion.',
    parameters: ['Potential Temperature', 'Practical Salinity', 'Heat Content Index', 'Fjord Mooring Depth'],
    spatial_resolution: '12 Moored CTD Stations',
    temporal_coverage: '2014-06 to 2026-05',
    format: 'NetCDF / CSV',
    file_size: '620 MB',
    pi_scientist: 'Dr. M. Ravichandran',
    doi: '10.5067/NCPOR/OCN-0119-V2',
    source_url: 'https://doi.org/10.5194/os-20-411-2024',
    downloads_count: 390,
  },
  {
    id: 'ds-6',
    code: 'NCPOR-GLC-0052',
    title: 'Schirmacher Oasis glacier velocity fields',
    domain: 'Glaciology',
    region: 'Schirmacher Oasis',
    status: 'Approved',
    quality_score: '88%',
    updated_date: '2026-06-12',
    description: 'Feature-tracked glacier surface velocity fields for the Schirmacher Oasis derived from Sentinel-1 SAR imagery.',
    parameters: ['Ice Velocity (m/yr)', 'Flow Vectors', 'Displacement Uncertainty', 'Crevasse Density'],
    spatial_resolution: '50 m Grid',
    temporal_coverage: '2016-01 to 2026-04',
    format: 'GeoTIFF / NetCDF',
    file_size: '480 MB',
    pi_scientist: 'Dr. Thamban Meloth',
    doi: '10.5067/NCPOR/GLC-0052-V1',
    source_url: 'https://doi.org/10.1029/2024GL108920',
    downloads_count: 450,
  },
  {
    id: 'ds-7',
    code: 'NCPOR-OCN-0088',
    title: 'Southern Ocean CTD profiles, Indian sector',
    domain: 'Oceanography',
    region: 'Southern Ocean',
    status: 'Approved',
    quality_score: '86%',
    updated_date: '2026-05-20',
    description: 'Conductivity-temperature-depth profiles collected during Indian Southern Ocean expeditions along 35°E and 65°E transects.',
    parameters: ['Conductivity', 'Temperature', 'Depth (dbar)', 'Dissolved Oxygen', 'Salinity'],
    spatial_resolution: '48 Hydrographic Casts',
    temporal_coverage: '2018-01 to 2026-03',
    format: 'ASCII / NetCDF',
    file_size: '760 MB',
    pi_scientist: 'Dr. M. Ravichandran',
    doi: '10.5067/NCPOR/OCN-0088-V3',
    source_url: 'https://incois.gov.in/portal/datainfo/southern_ocean.jsp',
    downloads_count: 520,
  },
  {
    id: 'ds-8',
    code: 'NCPOR-MET-0031',
    title: 'Maitri surface meteorological record',
    domain: 'Atmospheric Science',
    region: 'East Antarctica',
    status: 'Approved',
    quality_score: '95%',
    updated_date: '2026-05-02',
    description: 'Continuous surface meteorological observations (temperature, pressure, wind, humidity) from Maitri station, Schirmacher Oasis.',
    parameters: ['Air Temperature (°C)', 'Station Pressure (hPa)', 'Wind Speed & Direction', 'Relative Humidity', 'Solar Irradiance'],
    spatial_resolution: 'Automatic Weather Station Point',
    temporal_coverage: '1989-01 to 2026-08 (Continuous)',
    format: 'CSV / NetCDF',
    file_size: '1.2 GB',
    pi_scientist: 'Dr. Neloy Khare',
    doi: '10.5067/NCPOR/MET-0031-V5',
    source_url: 'https://ncpor.res.in/polar-science/antarctic-meteorology',
    downloads_count: 940,
  },
  {
    id: 'ds-9',
    code: 'NCPOR-SI-0147',
    title: 'Daily sea-ice concentration, Indian Ocean sector of Antarctica',
    domain: 'Sea Ice',
    region: 'Indian Ocean sector',
    status: 'Approved',
    quality_score: '92%',
    updated_date: '2026-04-18',
    description: 'Passive-microwave daily sea-ice concentration at 6.25 km resolution covering the Indian Ocean sector of the Southern Ocean, validated against station observations.',
    parameters: ['Sea Ice Concentration (%)', 'Sea Ice Extent (km²)', 'Brightness Temperature 89GHz', 'Sea Ice Drift Vectors'],
    spatial_resolution: '6.25 km Polar Grid',
    temporal_coverage: '2000-01 to 2026-07',
    format: 'HDF5 / NetCDF4',
    file_size: '3.4 GB',
    pi_scientist: 'Dr. Rohit Srivastava',
    doi: '10.5067/NCPOR/SI-0147-V2',
    source_url: 'https://nsidc.org/data/polar-sea-ice',
    downloads_count: 610,
  },
];

export const INITIAL_PUBLICATIONS: PublicationItem[] = [
  {
    id: 'pub-1',
    title: 'Decadal variability of Indian Antarctic station temperatures and Southern Annular Mode teleconnections',
    journal: 'Journal of Climate & Polar Meteorology',
    year: 2025,
    authors: 'Dr. Thamban Meloth, Dr. Rohit Srivastava, Dr. M. Ravichandran',
    domain: 'Climate',
    doi: '10.1016/j.polar.2025.104820',
    abstract: 'Analysis of long-term temperature records at Maitri (1989-2024) and Bharati (2012-2024) reveals pronounced asymmetric warming patterns modulated by positive phases of the Southern Annular Mode and Amundsen Sea Low shifts.',
    citations: 34,
    url: 'https://doi.org/10.1016/j.polar.2025.104820',
    source_repository: 'ScienceDirect / Elsevier',
    linked_datasets: ['ds-2', 'ds-8'],
  },
  {
    id: 'pub-2',
    title: 'Marine ecosystem responses to winter sea-ice minima along the Princess Elizabeth Land coast',
    journal: 'Polar Biology Reviews',
    year: 2025,
    authors: 'Dr. Rahul Mohan, Dr. Neloy Khare',
    domain: 'Biology',
    doi: '10.1007/s00300-025-03112-x',
    abstract: 'Investigation of phytoplankton bloom dynamics following record low winter sea-ice extents in Prydz Bay. Results demonstrate shifts toward smaller nanoflagellate dominance over micro-diatoms.',
    citations: 28,
    url: 'https://doi.org/10.1007/s00300-025-03112-x',
    source_repository: 'Springer Nature',
    linked_datasets: ['ds-1', 'ds-4'],
  },
  {
    id: 'pub-3',
    title: 'Atlantic Water warming and glacial meltwater interactions in Kongsfjorden: Insights from IndARC mooring',
    journal: 'Ocean Science & Cryosphere',
    year: 2024,
    authors: 'Dr. M. Ravichandran, Dr. Neloy Khare',
    domain: 'Hydrography',
    doi: '10.5194/os-20-411-2024',
    abstract: 'A ten-year synthesis of continuous mooring observations from India’s Arctic mooring IndARC shows episodic summer pulses of transformed Atlantic water altering the fjord thermal structure.',
    citations: 52,
    url: 'https://doi.org/10.5194/os-20-411-2024',
    source_repository: 'Copernicus Publications',
    linked_datasets: ['ds-5', 'ds-7'],
  },
  {
    id: 'pub-4',
    title: 'Chemical stratigraphy and biomass burning plumes recorded in Central Dronning Maud Land ice cores',
    journal: 'Geophysical Research Letters',
    year: 2024,
    authors: 'Dr. Thamban Meloth',
    domain: 'Glaciology',
    doi: '10.1029/2024GL108920',
    abstract: 'High-resolution levoglucosan, black carbon, and ammonium records from shallow ice cores indicate increased Southern Hemisphere wildfire emissions reaching East Antarctic plateaus over the last two centuries.',
    citations: 41,
    url: 'https://doi.org/10.1029/2024GL108920',
    source_repository: 'AGU / Wiley Online Library',
    linked_datasets: ['ds-6'],
  },
  {
    id: 'pub-5',
    title: 'Thermobaric sea-ice draft variations in the Western Weddell Gyre from merged CryoSat-2 and altimetry',
    journal: 'The Cryosphere',
    year: 2024,
    authors: 'Dr. Rohit Srivastava, Dr. Thamban Meloth',
    domain: 'Sea Ice',
    doi: '10.5194/tc-18-1891-2024',
    abstract: 'Multi-year sea ice deformation features in the western Weddell Sea examined through satellite radar altimeter freeboards and coordinated shipborne electromagnetic induction soundings.',
    citations: 19,
    url: 'https://doi.org/10.5194/tc-18-1891-2024',
    source_repository: 'Copernicus Publications',
    linked_datasets: ['ds-3'],
  },
  {
    id: 'pub-6',
    title: 'Aerosol optical depth and long-range transport of black carbon to the Arctic high observatory Himadri',
    journal: 'Atmospheric Chemistry and Physics',
    year: 2023,
    authors: 'Dr. Neloy Khare, Dr. Rahul Mohan',
    domain: 'Atmospheric Science',
    doi: '10.5194/acp-23-9821-2023',
    abstract: 'Comprehensive characterization of springtime Arctic Haze events and soot deposition at Ny-Ålesund, highlighting source-receptor pathways from Eurasian boreal forest fires.',
    citations: 37,
    url: 'https://doi.org/10.5194/acp-23-9821-2023',
    source_repository: 'Copernicus Publications',
    linked_datasets: ['ds-8'],
  },
  {
    id: 'pub-7',
    title: 'Hydrographic fronts and biogeochemical nutrient partitioning in the Indian sector of Southern Ocean',
    journal: 'Deep Sea Research Part II',
    year: 2023,
    authors: 'Dr. M. Ravichandran, Dr. Rahul Mohan',
    domain: 'Oceanography',
    doi: '10.1016/j.dsr2.2023.105190',
    abstract: 'Transects along 57°30\'E spanning Subtropical, Subantarctic, and Polar Fronts delineate silicate-nitrate limitation regimes controlling primary productivity.',
    citations: 45,
    url: 'https://doi.org/10.1016/j.dsr2.2023.105190',
    source_repository: 'ScienceDirect / Elsevier',
    linked_datasets: ['ds-7'],
  },
  {
    id: 'pub-8',
    title: 'Sub-ice shelf circulation and basal melting along the Amery Ice Shelf calving fronts',
    journal: 'Journal of Geophysical Research: Oceans',
    year: 2023,
    authors: 'Dr. Rohit Srivastava, Dr. M. Ravichandran',
    domain: 'Glaciology',
    doi: '10.1029/2023JC019800',
    abstract: 'Moorings and shipboard surveys in Prydz Bay quantify Modified Circumpolar Deep Water inflows into the sub-ice cavity driving seasonal basal melt rate fluctuations.',
    citations: 29,
    url: 'https://doi.org/10.1029/2023JC019800',
    source_repository: 'AGU / Wiley Online Library',
    linked_datasets: ['ds-6', 'ds-7'],
  },
];

export const INITIAL_SCIENTISTS: ScientistItem[] = [
  {
    id: 'sci-1',
    name: 'Dr. Thamban Meloth',
    role_title: 'Director & Lead Paleoclimate Scientist',
    domains: ['Glaciology', 'Climate', 'Paleoclimatology'],
    avatar_color: '#0B5C8E',
    bio: 'Director of NCPOR and pioneering researcher in polar ice cores, paleoclimate reconstructions, and Himalayan cryosphere monitoring. Recipient of National Geoscience Award and polar expedition leader.',
    email: 'meloth@ncpor.res.in',
    organization: 'National Centre for Polar and Ocean Research (NCPOR)',
    expeditions: ['25th Indian Antarctic Expedition', '33rd Indian Antarctic Expedition', 'Arctic Summer Campaign 2018'],
    stations: ['Maitri', 'Bharati', 'Himadri'],
    publication_ids: ['pub-1', 'pub-4', 'pub-5'],
    orcid_url: 'https://orcid.org/0000-0002-0546-2489',
  },
  {
    id: 'sci-2',
    name: 'Dr. Rahul Mohan',
    role_title: 'Scientist-G & Head of Polar Marine Biology',
    domains: ['Biology', 'Oceanography', 'Biogeochemistry'],
    avatar_color: '#8b5cf6',
    bio: 'Expert in Southern Ocean micro-plankton, diatom taxonomy, marine biogeochemistry, and polar ecosystems. Over 20 years of research across Arctic, Antarctic, and Southern Ocean expeditions.',
    email: 'rmohan@ncpor.res.in',
    organization: 'NCPOR Polar Biology Division',
    expeditions: ['18th Indian Antarctic Expedition', '28th Indian Antarctic Expedition', '10th Southern Ocean Expedition'],
    stations: ['Maitri', 'Bharati'],
    publication_ids: ['pub-2', 'pub-6', 'pub-7'],
    orcid_url: 'https://orcid.org/0000-0002-8392-1920',
  },
  {
    id: 'sci-3',
    name: 'Dr. Rohit Srivastava',
    role_title: 'Senior Scientist · Sea Ice & Remote Sensing',
    domains: ['Sea Ice', 'Remote Sensing', 'Cryosphere Dynamics'],
    avatar_color: '#008b8b',
    bio: 'Specialist in satellite microwave remote sensing of polar sea ice, altimetry, snow-ice thermodynamics, and Antarctic fast ice kinematics. Principal investigator for NCPOR sea-ice monitoring.',
    email: 'rohit@ncpor.res.in',
    organization: 'NCPOR Cryosphere Science Wing',
    expeditions: ['36th Indian Antarctic Expedition', '41st Indian Antarctic Expedition'],
    stations: ['Bharati', 'Maitri'],
    publication_ids: ['pub-1', 'pub-5', 'pub-8'],
    orcid_url: 'https://orcid.org/0000-0003-4129-8756',
  },
  {
    id: 'sci-4',
    name: 'Dr. Neloy Khare',
    role_title: 'Distinguished Scientist · Polar Paleoceanography',
    domains: ['Atmospheric Science', 'Hydrography', 'Marine Geology'],
    avatar_color: '#2e9e8f',
    bio: 'Veteran polar scientist with extensive contributions in micropaleontology, monsoonal teleconnections recorded in polar sediments, and high-latitude atmospheric aerosol characterization.',
    email: 'nkhare@moes.gov.in',
    organization: 'Ministry of Earth Sciences / NCPOR',
    expeditions: ['11th Indian Antarctic Expedition', '21st Indian Antarctic Expedition', '1st Indian Arctic Expedition'],
    stations: ['Maitri', 'Himadri', 'Dakshin Gangotri'],
    publication_ids: ['pub-2', 'pub-3', 'pub-6'],
    orcid_url: 'https://orcid.org/0000-0001-9281-4011',
  },
  {
    id: 'sci-5',
    name: 'Dr. M. Ravichandran',
    role_title: 'Secretary MoES & Polar Oceanographer',
    domains: ['Oceanography', 'Hydrography', 'Climate Systems'],
    avatar_color: '#3b82f6',
    bio: 'Secretary to the Government of India, Ministry of Earth Sciences. Eminent oceanographer leading international Argo program initiatives and polar ocean observing systems across the Arctic and Southern Oceans.',
    email: 'secretary@moes.gov.in',
    organization: 'Ministry of Earth Sciences, Govt. of India',
    expeditions: ['Southern Ocean Expedition 2008', 'Arctic Expedition 2014'],
    stations: ['Bharati', 'IndARC', 'Himadri'],
    publication_ids: ['pub-1', 'pub-3', 'pub-7', 'pub-8'],
    orcid_url: 'https://orcid.org/0000-0002-1234-5678',
  },
];

export const INITIAL_STATIONS: StationItem[] = [
  {
    id: 'st-1',
    name: 'Maitri',
    code: 'IN-MAITRI',
    location: 'Schirmacher Oasis, Queen Maud Land',
    region: 'Antarctic',
    lat: -70.7667,
    lng: 11.7333,
    status: 'nominal',
    established_year: 1989,
    sensors_active: 38,
    live_temp: -18.4,
    live_wind: 24.5,
    live_pressure: 986.2,
    description: 'India\'s second permanent Antarctic research base, situated in an ice-free rocky oasis. Year-round multidisciplinary observatory for atmospheric science, geomagnetism, meteorology, and glaciology.',
    source_telemetry_url: 'https://ncpor.res.in/polar-science/antarctic-stations/maitri',
    monthly_temps: [-2.1, -6.8, -12.4, -18.2, -21.5, -23.1, -24.8, -25.2, -22.1, -16.3, -8.7, -3.2],
    monthly_wind: [18.2, 19.5, 24.1, 28.3, 31.2, 29.8, 30.5, 32.1, 28.4, 25.1, 21.0, 17.8],
    monthly_ice: [0, 0, 15, 45, 78, 92, 98, 100, 95, 82, 40, 10],
    monthly_radiation: [320, 240, 120, 30, 0, 0, 0, 15, 80, 190, 290, 350],
  },
  {
    id: 'st-2',
    name: 'Bharati',
    code: 'IN-BHARATI',
    location: 'Larsemann Hills, Princess Elizabeth Land',
    region: 'Antarctic',
    lat: -69.4069,
    lng: 76.1914,
    status: 'nominal',
    established_year: 2012,
    sensors_active: 52,
    live_temp: -14.2,
    live_wind: 18.0,
    live_pressure: 994.8,
    description: 'State-of-the-art energy-efficient permanent Antarctic station made of 134 modular prefabricated containers. Hub for Southern Ocean oceanography, coastal biology, satellite ground communications, and laser radar.',
    source_telemetry_url: 'https://ncpor.res.in/polar-science/antarctic-stations/bharati',
    monthly_temps: [-0.8, -4.5, -9.8, -14.2, -17.9, -19.4, -20.6, -21.1, -18.3, -12.7, -6.2, -1.5],
    monthly_wind: [14.1, 16.2, 20.4, 23.8, 25.1, 26.2, 27.0, 26.5, 24.2, 20.9, 17.5, 13.9],
    monthly_ice: [5, 12, 35, 68, 88, 96, 99, 100, 98, 89, 52, 18],
    monthly_radiation: [340, 260, 140, 45, 0, 0, 0, 25, 95, 210, 310, 370],
  },
  {
    id: 'st-3',
    name: 'Himadri',
    code: 'IN-HIMADRI',
    location: 'Ny-Ålesund, Spitsbergen, Svalbard',
    region: 'Arctic',
    lat: 78.9236,
    lng: 11.9278,
    status: 'nominal',
    established_year: 2008,
    sensors_active: 29,
    live_temp: 4.8,
    live_wind: 11.2,
    live_pressure: 1012.4,
    description: 'India\'s first permanent Arctic research station located at the world\'s northernmost permanent civilian settlement. Focuses on Arctic aerosol radiative forcing, fjord dynamics, and microbial ecology.',
    source_telemetry_url: 'https://ncpor.res.in/polar-science/arctic-research/himadri',
    monthly_temps: [-14.5, -15.2, -14.8, -10.1, -3.2, 2.8, 5.9, 5.1, 1.2, -4.8, -9.5, -12.6],
    monthly_wind: [16.4, 17.1, 15.8, 13.2, 11.0, 9.8, 9.2, 10.1, 12.5, 14.8, 16.0, 16.7],
    monthly_ice: [95, 98, 99, 96, 80, 45, 15, 8, 22, 60, 85, 92],
    monthly_radiation: [0, 5, 45, 140, 240, 280, 260, 180, 90, 20, 0, 0],
  },
  {
    id: 'st-4',
    name: 'IndARC',
    code: 'IN-INDARC',
    location: 'Kongsfjorden Fjord Mooring, Svalbard',
    region: 'Arctic',
    lat: 79.0012,
    lng: 11.8341,
    status: 'nominal',
    established_year: 2014,
    sensors_active: 16,
    live_temp: 2.1,
    live_wind: 0,
    live_pressure: 1018.0,
    description: 'India\'s multi-sensor underwater moored observatory deployed at 192 meters depth in the Arctic fjord Kongsfjorden. Continuous telemetry recording Atlantic water inflows and Arctic climate teleconnections.',
    source_telemetry_url: 'https://ncpor.res.in/polar-science/arctic-research/indarc',
    monthly_temps: [0.8, 0.4, 0.2, 0.9, 1.8, 2.9, 4.2, 4.8, 3.9, 2.8, 1.9, 1.2],
    monthly_wind: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    monthly_ice: [80, 85, 90, 80, 60, 30, 5, 0, 10, 40, 70, 78],
    monthly_radiation: [0, 0, 10, 40, 90, 110, 100, 60, 25, 5, 0, 0],
  },
  {
    id: 'st-5',
    name: 'Dakshin Gangotri',
    code: 'IN-DG',
    location: 'Ice Shelf, Queen Maud Land',
    region: 'Antarctic',
    lat: -70.0900,
    lng: 12.0000,
    status: 'degraded',
    established_year: 1983,
    sensors_active: 4,
    live_temp: -22.6,
    live_wind: 36.8,
    live_pressure: 981.0,
    description: 'India\'s historic first Antarctic station, established in 1983 and submerged beneath snow in 1990. Currently preserved as an automated unmanned meteorological and historic heritage telemetry node.',
    source_telemetry_url: 'https://ncpor.res.in/polar-science/antarctic-stations/dakshin-gangotri',
    monthly_temps: [-4.5, -9.2, -15.8, -21.4, -25.2, -27.8, -29.1, -29.6, -26.4, -19.8, -11.5, -5.8],
    monthly_wind: [22.4, 25.1, 29.8, 35.2, 38.9, 37.4, 38.2, 39.9, 35.1, 31.0, 26.5, 21.8],
    monthly_ice: [40, 60, 85, 98, 100, 100, 100, 100, 100, 95, 75, 50],
    monthly_radiation: [310, 230, 110, 20, 0, 0, 0, 10, 70, 180, 280, 340],
  },
  {
    id: 'st-6',
    name: 'Prydz Bay Ocean Observatory',
    code: 'IN-PBOO',
    location: 'Continental Shelf Break, Prydz Bay',
    region: 'Southern Ocean',
    lat: -67.5000,
    lng: 75.0000,
    status: 'nominal',
    established_year: 2017,
    sensors_active: 22,
    live_temp: -1.8,
    live_wind: 16.4,
    live_pressure: 998.1,
    description: 'Deep-ocean moored array monitoring Circumpolar Deep Water upwelling, Antarctic Bottom Water (AABW) export pathways, and sea-ice draft variations near the Amery Ice Shelf.',
    source_telemetry_url: 'https://incois.gov.in/portal/datainfo/prydz_bay.jsp',
    monthly_temps: [-0.2, -0.8, -1.4, -1.8, -1.9, -1.9, -1.9, -1.9, -1.8, -1.6, -1.1, -0.5],
    monthly_wind: [15.2, 17.8, 22.0, 26.1, 28.5, 29.1, 30.2, 29.8, 27.2, 23.4, 19.1, 15.9],
    monthly_ice: [10, 25, 60, 85, 95, 99, 100, 100, 99, 90, 60, 25],
    monthly_radiation: [290, 210, 110, 30, 0, 0, 0, 15, 75, 175, 260, 320],
  },
];

export const INITIAL_EXPEDITIONS: ExpeditionItem[] = [
  {
    id: 'exp-1',
    code: '43-ISEA',
    title: '43rd Indian Scientific Expedition to Antarctica',
    vessel: 'MV Vasiliy Golovnin',
    season: '2023-2024 / 2024-2025',
    leader: 'Dr. Rohit Srivastava',
    region: 'East Antarctica (Maitri & Bharati)',
    dates: 'Nov 2023 - Apr 2024',
    status: 'Completed',
    objectives: [
      'Resupply and maintenance of Maitri and Bharati stations',
      'Deployment of new GNSS baseline stations in Larsemann Hills',
      'Atmospheric aerosol and ice-core sampling on polar plateau',
      'Southern Ocean oceanographic CTD transect along 57°E',
    ],
    stations_visited: ['Maitri', 'Bharati', 'Cape Town Port'],
    datasets_collected: 18,
    report_url: 'https://ncpor.res.in/polar-science/antarctic-expeditions/43-isea',
  },
  {
    id: 'exp-2',
    code: '44-ISEA',
    title: '44th Indian Scientific Expedition to Antarctica',
    vessel: 'MV Vasiliy Golovnin / S.A. Agulhas II',
    season: '2025-2026',
    leader: 'Dr. Rahul Mohan',
    region: 'Princess Elizabeth Land & Dronning Maud Land',
    dates: 'Nov 2025 - Apr 2026',
    status: 'Active',
    objectives: [
      'Construction phase of Maitri-II next generation replacement station',
      'Deep ice drilling project at Dome C transition zone',
      'Continuous fast ice thickness and snow radar surveys',
      'Microplastic pollution and microbial genomics cataloging',
    ],
    stations_visited: ['Maitri', 'Bharati'],
    datasets_collected: 9,
    report_url: 'https://ncpor.res.in/polar-science/antarctic-expeditions/44-isea',
  },
  {
    id: 'exp-3',
    code: 'IND-ARC-24',
    title: 'Indian Arctic Winter Campaign 2024-2025',
    vessel: 'RV Lance / Ny-Ålesund Field Fleet',
    season: '2024-2025',
    leader: 'Dr. Neloy Khare',
    region: 'Svalbard & Fram Strait',
    dates: 'Oct 2024 - Mar 2025',
    status: 'Completed',
    objectives: [
      'Turnaround of IndARC deep fjord mooring system in Kongsfjorden',
      'Winter boundary layer atmospheric profiling using tethered balloon',
      'Benthic ecology and biogeochemistry under sea-ice cover',
    ],
    stations_visited: ['Himadri', 'IndARC', 'Longyearbyen'],
    datasets_collected: 12,
    report_url: 'https://ncpor.res.in/polar-science/arctic-research/winter-campaign',
  },
  {
    id: 'exp-4',
    code: 'SOE-12',
    title: '12th Indian Southern Ocean Expedition',
    vessel: 'ORV Sagar Nidhi',
    season: '2024',
    leader: 'Dr. M. Ravichandran',
    region: 'Southern Ocean (40°S to 69°S)',
    dates: 'Jan 2024 - Mar 2024',
    status: 'Completed',
    objectives: [
      'Biogeochemical flux measurements across Antarctic Polar Front',
      'Deployment of 24 deep-sea biogeochemical Argo floats',
      'Marine carbon sequestration and phytoplankton bloom genomics',
    ],
    stations_visited: ['Mauritius', 'Prydz Bay Observatories'],
    datasets_collected: 15,
    report_url: 'https://ncpor.res.in/polar-science/southern-ocean-expeditions',
  },
];

export const INITIAL_EVENTS: EnvironmentalEventItem[] = [
  {
    id: 'evt-1',
    title: 'Weddell Sea Sea-Ice Extent Record Anomaly',
    category: 'Sea Ice',
    severity: 'Critical',
    date: '2026-08-12',
    location: 'Western Weddell Sea',
    coordinates: '68°15\'S, 48°30\'W',
    description: 'Satellite microwave sensors detected an unprecedented negative sea-ice concentration anomaly of 32% below the 1991-2020 climatological baseline across the northwestern Weddell Sea.',
    anomaly_metric: '-32% below baseline (480,000 km² loss)',
    source_feed_url: 'https://nsidc.org/arcticseaicenews/',
  },
  {
    id: 'evt-2',
    title: 'Amery Ice Shelf Marginal Calving Discharge',
    category: 'Glaciology',
    severity: 'Warning',
    date: '2026-07-29',
    location: 'Amery Ice Shelf Front',
    coordinates: '67°45\'S, 73°50\'E',
    description: 'Sentinel-1 SAR imagery identified rift propagation and a 140 km² tabular iceberg separation at the eastern flank of the Amery Ice Shelf, 180 km northwest of Bharati station.',
    anomaly_metric: '140 km² ice mass detachment',
    source_feed_url: 'https://sentinels.copernicus.eu/',
  },
  {
    id: 'evt-3',
    title: 'Antarctic Spring Stratospheric Ozone Depletion Dynamics',
    category: 'Atmospheric',
    severity: 'Advisory',
    date: '2026-08-01',
    location: 'Over Polar Vortex / Maitri Sector',
    coordinates: '70°46\'S, 11°44\'E',
    description: 'Ozonesonde soundings launched from Maitri recorded total column ozone dropping below 180 Dobson Units with enhanced polar stratospheric cloud (PSC Type 1) formation.',
    anomaly_metric: '178 DU (35% below normal)',
    source_feed_url: 'https://ozonewatch.gsfc.nasa.gov/',
  },
  {
    id: 'evt-4',
    title: 'Kongsfjorden Atlantic Water Intrusion Surge',
    category: 'Oceanographic',
    severity: 'Observation',
    date: '2026-06-18',
    location: 'Svalbard Fjord Transect',
    coordinates: '79°00\'N, 11°50\'E',
    description: 'IndARC underwater sensor cluster recorded an early seasonal influx of warm, saline West Spitsbergen Current water (+1.8°C above average) into the inner basin.',
    anomaly_metric: '+1.8°C thermal pulse at 100m depth',
    source_feed_url: 'https://ncpor.res.in/indarc-telemetry',
  },
];

export const INITIAL_MEDIA_STORIES: MediaStoryItem[] = [
  {
    id: 'med-1',
    title: 'Indian Antarctic Expedition: Life at Bharati & Maitri Stations',
    category: 'Documentary',
    duration: '18 min',
    date: '2026-08-30',
    thumbnail_url: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=800&q=80',
    youtube_id: 'Qp_dG3Z-Y6U',
    video_url: 'https://www.youtube-nocookie.com/embed/Qp_dG3Z-Y6U',
    author: 'National Centre for Polar and Ocean Research (NCPOR)',
    summary: 'Official documentary highlighting the scientific voyage of Indian researchers, living conditions, and year-round cryosphere monitoring at Bharati and Maitri Stations in Antarctica.',
    location: 'Larsemann Hills, Antarctica',
    source_url: 'https://ncpor.res.in/antarctic-expeditions',
  },
  {
    id: 'med-2',
    title: 'Arctic Frontiers: Inside India\'s Himadri Station at Ny-Ålesund',
    category: 'Field Dispatch',
    duration: '14 min',
    date: '2026-08-29',
    thumbnail_url: 'https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?auto=format&fit=crop&w=800&q=80',
    youtube_id: 'o_T_7_fBvEw',
    video_url: 'https://www.youtube-nocookie.com/embed/o_T_7_fBvEw',
    author: 'Arctic Research Wing',
    summary: 'Join Indian atmospheric scientists at Ny-Ålesund, Svalbard (79°N), deploying laser lidar spectrometers and observing rapid glacier dynamics along Kongsfjorden fjord.',
    location: 'Ny-Ålesund, Svalbard, Arctic',
    source_url: 'https://ncpor.res.in/arctic-program',
  },
  {
    id: 'med-3',
    title: 'IndARC Observatory: Deep Ocean Sensors in the Arctic Fjord',
    category: 'Daily Live Video',
    duration: '12 min',
    date: '2026-08-28',
    thumbnail_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    youtube_id: 'Zk9J5xlZ2HU',
    video_url: 'https://www.youtube-nocookie.com/embed/Zk9J5xlZ2HU',
    author: 'Ocean Observation Division',
    summary: 'Subsea mooring deployment and acoustic telemetry retrieval from India\'s IndARC underwater observatory moored 192 meters deep in the Arctic Ocean.',
    location: 'Kongsfjorden Fjord, Arctic',
    source_url: 'https://ncpor.res.in/indarc',
  },
  {
    id: 'med-4',
    title: 'Voyage into the Roaring Forties: Southern Ocean Hydrographic Cruise',
    category: 'Field Dispatch',
    duration: '16 min',
    date: '2026-08-27',
    thumbnail_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    youtube_id: '2g811Eo7K8U',
    video_url: 'https://www.youtube-nocookie.com/embed/2g811Eo7K8U',
    author: 'Southern Ocean Research Mission',
    summary: 'Onboard research vessels navigating heavy swells across the Subantarctic Front to sample biogeochemical parameters and understand monsoon teleconnections.',
    location: 'Southern Ocean (40°S - 60°S)',
    source_url: 'https://ncpor.res.in/southern-ocean',
  },
  {
    id: 'med-5',
    title: 'Glaciology & Ice Core Records: Unlocking 50,000 Years of Climate',
    category: 'Photo Story',
    duration: '10 min',
    date: '2026-08-26',
    thumbnail_url: 'https://images.unsplash.com/photo-1488441770602-aed21fc49bd5?auto=format&fit=crop&w=800&q=80',
    youtube_id: 'qXfKk0B06h0',
    video_url: 'https://www.youtube-nocookie.com/embed/qXfKk0B06h0',
    author: 'Ice Core Laboratory',
    summary: 'Deep ice-core drilling operations and ground-penetrating radar profiling across the high plateau of Dronning Maud Land, Antarctica.',
    location: 'Schirmacher Oasis, Antarctica',
    source_url: 'https://ncpor.res.in/gallery/antarctica',
  },
  {
    id: 'med-6',
    title: 'India in the Polar Regions: 40 Years of Frontiers & Discoveries',
    category: 'Interview',
    duration: '22 min',
    date: '2026-08-25',
    thumbnail_url: 'https://images.unsplash.com/photo-1516431883659-655d41c09bf9?auto=format&fit=crop&w=800&q=80',
    youtube_id: 'kpHxU72l3F0',
    video_url: 'https://www.youtube-nocookie.com/embed/kpHxU72l3F0',
    author: 'Directorate of Polar Science',
    summary: 'In-depth retrospective on four decades of Indian polar expeditions, establishing Maitri and Bharati, and future climate observing satellites.',
    location: 'NCPOR Headquarters, Goa',
    source_url: 'https://ncpor.res.in/director-interviews',
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  // Admin-specific notifications
  {
    id: 'notif-adm-1',
    title: 'Pending Researcher Verification Requests',
    message: '3 new researcher credentials require administrator review and identity verification in the Admin Console.',
    timestamp: '10 mins ago',
    type: 'alert',
    read: false,
    link_tab: 'console',
    target_role: 'admin',
  },
  {
    id: 'notif-adm-2',
    title: 'System Security & Telemetry Audit',
    message: 'All 6 polar telemetry station nodes and API gateways authenticated successfully. Zero security violations recorded.',
    timestamp: '3 hours ago',
    type: 'system',
    read: false,
    link_tab: 'stations',
    target_role: 'admin',
  },
  {
    id: 'notif-adm-3',
    title: 'Batch Sync Engine Report',
    message: 'Nightly batch ingestion completed across 18 public science feeds at 04:10 UTC with 100% nominal record parsing.',
    timestamp: '1 day ago',
    type: 'system',
    read: true,
    link_tab: 'overview',
    target_role: 'admin',
  },

  // Researcher-specific notifications
  {
    id: 'notif-res-1',
    title: 'Dataset Verification Approved & Live',
    message: 'Your dataset NCPOR-SI-0228 (Ross Sea polynya extent record) passed QA verification and is now indexed across all research nodes.',
    timestamp: '1 hour ago',
    type: 'success',
    read: false,
    link_tab: 'datasets',
    target_role: 'researcher',
  },
  {
    id: 'notif-res-2',
    title: 'Publication Citation Alert',
    message: 'Your co-authored publication on decadal variability of Antarctic temperatures was cited in 3 new Nature Cryosphere preprints.',
    timestamp: '4 hours ago',
    type: 'info',
    read: false,
    link_tab: 'publications',
    target_role: 'researcher',
  },
  {
    id: 'notif-res-3',
    title: 'Field Ingestion Window Open',
    message: 'The 44th ISEA telemetry ingest portal is open for preliminary raw CTD and meteorological log submissions.',
    timestamp: '2 days ago',
    type: 'info',
    read: true,
    link_tab: 'expeditions',
    target_role: 'researcher',
  },

  // Educator-specific notifications
  {
    id: 'notif-edu-1',
    title: 'New 3D Polar Simulation Module Available',
    message: 'Interactive Antarctic Ice Shelf calving and ice-velocity 3D educational visualizations are now available for classroom curriculum.',
    timestamp: '5 hours ago',
    type: 'info',
    read: false,
    link_tab: 'map',
    target_role: 'educator',
  },
  {
    id: 'notif-edu-2',
    title: 'Live Polar Science Webinar Scheduled',
    message: 'Directorate live stream on ice-core paleoclimatology scheduled for next Friday. Interactive Q&A for student cohorts enabled.',
    timestamp: '1 day ago',
    type: 'info',
    read: false,
    link_tab: 'media',
    target_role: 'educator',
  },

  // Public / Explorer notifications
  {
    id: 'notif-pub-1',
    title: 'Polar Science Virtual Tour Published',
    message: 'High-definition 360° documentary dispatches from Bharati and Maitri stations are now streaming in the Media & Stories portal.',
    timestamp: '6 hours ago',
    type: 'info',
    read: false,
    link_tab: 'media',
    target_role: 'public',
  },

  // Universal notifications (Visible to all users)
  {
    id: 'notif-exp-1',
    title: 'New Expedition Flagged Off: 44th ISEA to Antarctica',
    message: 'The 44th Indian Scientific Expedition to Antarctica has officially set sail from Cape Town aboard MV Vasiliy Golovnin with 48 scientists and wintering crew.',
    timestamp: '30 mins ago',
    type: 'success',
    read: false,
    link_tab: 'expeditions',
    target_role: 'all',
  },
  {
    id: 'notif-all-1',
    title: 'Environmental Warning: Weddell Sea Anomaly',
    message: 'Rapid sea-ice concentration anomaly detected in the Weddell Sea sector. Daily satellite sensors flagged sudden retreat.',
    timestamp: '5 hours ago',
    type: 'alert',
    read: false,
    link_tab: 'events',
    target_role: 'all',
  },
];

export const PROMPT_SUGGESTIONS = [
  'Show ocean temperature datasets near Antarctic research stations.',
  'What research has been conducted on Antarctic climate change?',
  'Find expeditions connected to sea-ice observations.',
  'Compare temperature trends at Maitri and Bharati stations.',
  'Which datasets describe sea-ice variability in the Weddell Sea?',
  'Show current observations that differ significantly from the historical average.',
];
