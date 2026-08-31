#!/usr/bin/env python3
"""
Migration script to fetch data from the reference Polar Nexus app and seed local database.
This script fetches scientists, publications, expeditions, datasets, etc. from the reference API.
"""

import asyncio
import json
import sys
import uuid
from datetime import datetime
from typing import Any, Optional

import httpx
import psycopg2
from psycopg2.extras import execute_values

# Configuration
REFERENCE_API_URL = "https://quixotic-polar-nexus-hub.base44.app/api/v1"
DB_HOST = "localhost"
DB_PORT = 5432
DB_NAME = "polar_nexus"
DB_USER = "postgres"
DB_PASSWORD = "vishva@15"


def get_db_connection():
    """Connect to PostgreSQL database."""
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
        )
        print(f"✅ Connected to PostgreSQL at {DB_HOST}:{DB_PORT}/{DB_NAME}")
        return conn
    except Exception as e:
        print(f"❌ Failed to connect to database: {e}")
        sys.exit(1)


async def fetch_from_api(endpoint: str) -> list:
    """Fetch data from the reference API."""
    try:
        url = f"{REFERENCE_API_URL}{endpoint}"
        print(f"📡 Fetching from: {url}")
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(url)
            if response.status_code == 200:
                data = response.json()
                print(f"   ✓ Got {len(data) if isinstance(data, list) else 1} records")
                return data if isinstance(data, list) else [data]
            else:
                print(f"   ✗ Status {response.status_code}: {response.text[:200]}")
                return []
    except Exception as e:
        print(f"   ✗ Error: {e}")
        return []


def insert_scientists(conn, scientists: list):
    """Insert scientists into the database."""
    if not scientists:
        print("No scientists to insert")
        return
    
    cur = conn.cursor()
    records = []
    
    for scientist in scientists:
        records.append((
            str(uuid.uuid4()),  # id
            None,  # user_id
            scientist.get("full_name", "Unknown"),
            scientist.get("orcid_id"),
            scientist.get("email"),
            scientist.get("institution"),
            scientist.get("country"),
            scientist.get("specialization"),
            scientist.get("bio"),
            scientist.get("photo_url"),
            scientist.get("h_index", 0),
            scientist.get("citation_count", 0),
            scientist.get("publication_count", 0),
            scientist.get("is_active", True),
            datetime.utcnow(),
            datetime.utcnow(),
        ))
    
    try:
        sql = """
            INSERT INTO scientists 
            (id, user_id, full_name, orcid_id, email, institution, country, 
             specialization, bio, photo_url, h_index, citation_count, publication_count, 
             is_active, created_at, updated_at)
            VALUES %s
            ON CONFLICT (orcid_id) DO NOTHING
        """
        execute_values(cur, sql, records)
        conn.commit()
        print(f"✅ Inserted {cur.rowcount} scientists")
    except Exception as e:
        conn.rollback()
        print(f"❌ Error inserting scientists: {e}")
    finally:
        cur.close()


def insert_publications(conn, publications: list):
    """Insert publications into the database."""
    if not publications:
        print("No publications to insert")
        return
    
    cur = conn.cursor()
    records = []
    
    for pub in publications:
        records.append((
            str(uuid.uuid4()),  # id
            pub.get("title", "Untitled"),
            None,  # lead_scientist_id (would need to match)
            pub.get("abstract"),
            pub.get("doi"),
            pub.get("year"),
            pub.get("journal"),
            pub.get("volume"),
            pub.get("issue"),
            pub.get("pages"),
            pub.get("url"),
            pub.get("published_date"),
            pub.get("is_open_access", False),
            datetime.utcnow(),
            datetime.utcnow(),
        ))
    
    try:
        sql = """
            INSERT INTO publications 
            (id, title, lead_scientist_id, abstract, doi, year, journal, 
             volume, issue, pages, url, published_date, is_open_access, created_at, updated_at)
            VALUES %s
            ON CONFLICT (doi) DO NOTHING
        """
        execute_values(cur, sql, records)
        conn.commit()
        print(f"✅ Inserted {cur.rowcount} publications")
    except Exception as e:
        conn.rollback()
        print(f"❌ Error inserting publications: {e}")
    finally:
        cur.close()


def insert_stations(conn, stations: list):
    """Insert stations into the database."""
    if not stations:
        print("No stations to insert")
        return
    
    cur = conn.cursor()
    records = []
    
    for station in stations:
        records.append((
            str(uuid.uuid4()),  # id
            station.get("name", "Unknown Station"),
            station.get("country"),
            station.get("region"),
            station.get("latitude"),
            station.get("longitude"),
            station.get("altitude"),
            station.get("operator"),
            station.get("is_operational", True),
            station.get("current_temperature_c"),
            station.get("current_wind_kph"),
            datetime.utcnow(),
            datetime.utcnow(),
        ))
    
    try:
        sql = """
            INSERT INTO stations 
            (id, name, country, region, latitude, longitude, altitude, operator, 
             is_operational, current_temperature_c, current_wind_kph, created_at, updated_at)
            VALUES %s
        """
        execute_values(cur, sql, records)
        conn.commit()
        print(f"✅ Inserted {cur.rowcount} stations")
    except Exception as e:
        conn.rollback()
        print(f"❌ Error inserting stations: {e}")
    finally:
        cur.close()


def insert_expeditions(conn, expeditions: list):
    """Insert expeditions into the database."""
    if not expeditions:
        print("No expeditions to insert")
        return
    
    cur = conn.cursor()
    records = []
    
    for exp in expeditions:
        records.append((
            str(uuid.uuid4()),  # id
            None,  # lead_scientist_id
            exp.get("name", "Unnamed Expedition"),
            exp.get("region"),
            exp.get("start_date"),
            exp.get("end_date"),
            exp.get("budget"),
            exp.get("status", "planned"),
            datetime.utcnow(),
            datetime.utcnow(),
        ))
    
    try:
        sql = """
            INSERT INTO expeditions 
            (id, lead_scientist_id, name, region, start_date, end_date, budget, status, 
             created_at, updated_at)
            VALUES %s
        """
        execute_values(cur, sql, records)
        conn.commit()
        print(f"✅ Inserted {cur.rowcount} expeditions")
    except Exception as e:
        conn.rollback()
        print(f"❌ Error inserting expeditions: {e}")
    finally:
        cur.close()


async def main():
    """Main migration function."""
    print("\n" + "="*60)
    print("🌍 Polar Nexus Data Migration Script")
    print("="*60 + "\n")
    
    # Connect to local database
    conn = get_db_connection()
    
    print(f"\n📥 Fetching data from: {REFERENCE_API_URL}\n")
    
    # Fetch and insert scientists
    print("1️⃣  SCIENTISTS")
    scientists = await fetch_from_api("/scientists")
    insert_scientists(conn, scientists)
    
    # Fetch and insert publications
    print("\n2️⃣  PUBLICATIONS")
    publications = await fetch_from_api("/publications")
    insert_publications(conn, publications)
    
    # Fetch and insert stations
    print("\n3️⃣  STATIONS")
    stations = await fetch_from_api("/stations")
    insert_stations(conn, stations)
    
    # Fetch and insert expeditions
    print("\n4️⃣  EXPEDITIONS")
    expeditions = await fetch_from_api("/expeditions")
    insert_expeditions(conn, expeditions)
    
    conn.close()
    
    print("\n" + "="*60)
    print("✅ Data migration complete!")
    print("="*60 + "\n")


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n⚠️  Migration cancelled by user")
    except Exception as e:
        print(f"\n❌ Fatal error: {e}")
        sys.exit(1)
