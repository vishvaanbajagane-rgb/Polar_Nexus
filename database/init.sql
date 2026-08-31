-- =====================================================================
-- POLAR NEXUS - PostgreSQL 15 schema
-- Run once against an empty database:
--   createdb polar_nexus
--   psql -d polar_nexus -f database/init.sql
-- The FastAPI app also creates any missing table on startup, so this file
-- is mainly for a clean, reviewable, production-style bootstrap.
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------- enum types --------------------------------
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('public', 'educator', 'researcher', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE application_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE polar_region AS ENUM ('arctic', 'antarctic', 'himalaya', 'southern_ocean', 'global');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE access_level AS ENUM ('public', 'educator', 'researcher', 'restricted');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE expedition_status AS ENUM ('planned', 'ongoing', 'completed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE event_severity AS ENUM ('low', 'moderate', 'high', 'critical');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ------------------------------ users --------------------------------
CREATE TABLE IF NOT EXISTS users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           VARCHAR(255) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    full_name       VARCHAR(255) NOT NULL,
    role            user_role NOT NULL DEFAULT 'public',
    organization    VARCHAR(255),
    country         VARCHAR(120),
    orcid_id        VARCHAR(32),
    avatar_url      TEXT,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    is_verified     BOOLEAN NOT NULL DEFAULT FALSE,
    last_login_at   TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS ix_users_email ON users (email);
CREATE INDEX IF NOT EXISTS ix_users_role ON users (role);

CREATE TABLE IF NOT EXISTS researcher_applications (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    institution             VARCHAR(255) NOT NULL,
    designation             VARCHAR(255),
    research_area           VARCHAR(255),
    orcid_id                VARCHAR(32),
    motivation              TEXT,
    supporting_document_url TEXT,
    status                  application_status NOT NULL DEFAULT 'pending',
    review_notes            TEXT,
    reviewed_by             UUID REFERENCES users (id) ON DELETE SET NULL,
    reviewed_at             TIMESTAMPTZ,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS ix_applications_user ON researcher_applications (user_id);
CREATE INDEX IF NOT EXISTS ix_applications_status ON researcher_applications (status);

-- --------------------------- scientists ------------------------------
CREATE TABLE IF NOT EXISTS scientists (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id           UUID REFERENCES users (id) ON DELETE SET NULL,
    full_name         VARCHAR(255) NOT NULL,
    orcid_id          VARCHAR(32) UNIQUE,
    email             VARCHAR(255),
    institution       VARCHAR(255),
    country           VARCHAR(120),
    specialization    VARCHAR(255),
    bio               TEXT,
    photo_url         TEXT,
    h_index           INTEGER NOT NULL DEFAULT 0,
    citation_count    INTEGER NOT NULL DEFAULT 0,
    publication_count INTEGER NOT NULL DEFAULT 0,
    is_active         BOOLEAN NOT NULL DEFAULT TRUE,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS ix_scientists_name ON scientists (full_name);

-- -------------------------- publications -----------------------------
CREATE TABLE IF NOT EXISTS publications (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title             TEXT NOT NULL,
    abstract          TEXT,
    doi               VARCHAR(255) UNIQUE,
    journal           VARCHAR(255),
    authors           TEXT[],
    keywords          TEXT[],
    region            polar_region NOT NULL DEFAULT 'global',
    published_on      DATE,
    citation_count    INTEGER NOT NULL DEFAULT 0,
    source            VARCHAR(64),
    url               TEXT,
    is_open_access    BOOLEAN NOT NULL DEFAULT TRUE,
    lead_scientist_id UUID REFERENCES scientists (id) ON DELETE SET NULL,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS ix_publications_region ON publications (region);
CREATE INDEX IF NOT EXISTS ix_publications_published_on ON publications (published_on DESC);

-- ---------------------------- datasets -------------------------------
CREATE TABLE IF NOT EXISTS datasets (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title          VARCHAR(500) NOT NULL,
    description    TEXT,
    category       VARCHAR(120),
    region         polar_region NOT NULL DEFAULT 'global',
    source         VARCHAR(120),
    source_url     TEXT,
    file_format    VARCHAR(32),
    size_mb        DOUBLE PRECISION,
    variables      TEXT[],
    access_level   access_level NOT NULL DEFAULT 'public',
    temporal_start DATE,
    temporal_end   DATE,
    download_count INTEGER NOT NULL DEFAULT 0,
    is_live        BOOLEAN NOT NULL DEFAULT FALSE,
    last_synced_at TIMESTAMPTZ,
    uploaded_by    UUID REFERENCES users (id) ON DELETE SET NULL,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS ix_datasets_region ON datasets (region);
CREATE INDEX IF NOT EXISTS ix_datasets_category ON datasets (category);

-- ---------------------------- stations -------------------------------
CREATE TABLE IF NOT EXISTS stations (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name                  VARCHAR(255) NOT NULL,
    code                  VARCHAR(32) UNIQUE,
    country               VARCHAR(120),
    operator              VARCHAR(255),
    region                polar_region NOT NULL DEFAULT 'antarctic',
    latitude              DOUBLE PRECISION NOT NULL,
    longitude             DOUBLE PRECISION NOT NULL,
    elevation_m           DOUBLE PRECISION,
    established_year      INTEGER,
    is_operational        BOOLEAN NOT NULL DEFAULT TRUE,
    current_temperature_c DOUBLE PRECISION,
    current_wind_kph      DOUBLE PRECISION,
    last_reading_at       TIMESTAMPTZ,
    description           TEXT,
    created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------- expeditions -----------------------------
CREATE TABLE IF NOT EXISTS expeditions (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name              VARCHAR(255) NOT NULL,
    code              VARCHAR(64) UNIQUE,
    objective         TEXT,
    region            polar_region NOT NULL DEFAULT 'antarctic',
    status            expedition_status NOT NULL DEFAULT 'planned',
    start_date        DATE,
    end_date          DATE,
    vessel            VARCHAR(255),
    team_size         INTEGER,
    route             JSONB,
    station_id        UUID REFERENCES stations (id) ON DELETE SET NULL,
    lead_scientist_id UUID REFERENCES scientists (id) ON DELETE SET NULL,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------- environmental events -------------------------
CREATE TABLE IF NOT EXISTS environmental_events (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title        VARCHAR(500) NOT NULL,
    event_type   VARCHAR(120) NOT NULL,
    description  TEXT,
    region       polar_region NOT NULL DEFAULT 'global',
    severity     event_severity NOT NULL DEFAULT 'moderate',
    latitude     DOUBLE PRECISION,
    longitude    DOUBLE PRECISION,
    metric_value DOUBLE PRECISION,
    metric_unit  VARCHAR(32),
    occurred_on  DATE,
    source       VARCHAR(120),
    source_url   TEXT,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS ix_events_occurred_on ON environmental_events (occurred_on DESC);

-- --------------------------- observations ----------------------------
CREATE TABLE IF NOT EXISTS observations (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dataset_id  UUID NOT NULL REFERENCES datasets (id) ON DELETE CASCADE,
    station_id  UUID REFERENCES stations (id) ON DELETE SET NULL,
    variable    VARCHAR(120) NOT NULL,
    value       DOUBLE PRECISION NOT NULL,
    unit        VARCHAR(32),
    region      polar_region NOT NULL DEFAULT 'global',
    observed_on DATE NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS ix_observations_lookup
    ON observations (dataset_id, variable, observed_on DESC);
CREATE INDEX IF NOT EXISTS ix_observations_region ON observations (region, variable, observed_on DESC);

-- ------------------------ daily update logs --------------------------
CREATE TABLE IF NOT EXISTS daily_update_logs (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_name        VARCHAR(120) NOT NULL,
    source           VARCHAR(120),
    status           VARCHAR(32) NOT NULL DEFAULT 'success',
    records_created  INTEGER NOT NULL DEFAULT 0,
    records_updated  INTEGER NOT NULL DEFAULT 0,
    message          TEXT,
    duration_seconds DOUBLE PRECISION,
    started_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    finished_at      TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS ix_update_logs_started ON daily_update_logs (started_at DESC);
