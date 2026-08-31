#!/usr/bin/env python3
"""
Seed script to populate the local database with sample polar science data.
"""

import uuid
from datetime import datetime, timedelta
import psycopg2
from psycopg2.extras import execute_values

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
        import sys
        sys.exit(1)


def seed_database():
    """Seed the database with sample polar science data."""
    print("\n" + "="*60)
    print("🌍 Seeding Polar Nexus Database with Sample Data")
    print("="*60 + "\n")
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    # Sample Scientists
    print("1️⃣  Adding Scientists...")
    scientists = [
        (str(uuid.uuid4()), None, "Dr. James Smith", "0000-0001-2345-6789", "james.smith@polarsci.edu", "Arctic Research Institute", "Canada", "Arctic Climate", "Leading expert in Arctic climate systems", None, 45, 1250, 87, True),
        (str(uuid.uuid4()), None, "Dr. Elena Volkov", "0000-0002-3456-7890", "elena.volkov@uniark.ru", "Moscow State University", "Russia", "Polar Oceanography", "Specializes in polar ocean currents", None, 52, 1680, 124, True),
        (str(uuid.uuid4()), None, "Dr. Sarah Johnson", "0000-0003-4567-8901", "s.johnson@antarctica.org.uk", "British Antarctic Survey", "UK", "Glaciology", "Ice sheet dynamics expert", None, 38, 950, 65, True),
        (str(uuid.uuid4()), None, "Dr. Marcus Zhang", "0000-0004-5678-9012", "m.zhang@tsinghua.edu.cn", "Tsinghua University", "China", "Atmospheric Science", "Studies polar atmospheric phenomena", None, 41, 1100, 78, True),
        (str(uuid.uuid4()), None, "Dr. Ana Rodriguez", "0000-0005-6789-0123", "ana.rodriguez@unal.edu.co", "National University of Colombia", "Colombia", "Environmental Biology", "Polar ecosystem researcher", None, 35, 780, 52, True),
    ]
    
    try:
        sql = """
            INSERT INTO scientists 
            (id, user_id, full_name, orcid_id, email, institution, country, 
             specialization, bio, photo_url, h_index, citation_count, publication_count, 
             is_active, created_at, updated_at)
            VALUES %s
        """
        records = [(s[0], s[1], s[2], s[3], s[4], s[5], s[6], s[7], s[8], s[9], s[10], s[11], s[12], s[13], datetime.utcnow(), datetime.utcnow()) for s in scientists]
        execute_values(cur, sql, records)
        conn.commit()
        scientist_ids = [s[0] for s in scientists]
        print(f"   ✅ Added {len(scientist_ids)} scientists")
    except Exception as e:
        conn.rollback()
        print(f"   ❌ Error: {e}")
        scientist_ids = []
    
    # Sample Publications
    print("\n2️⃣  Adding Publications...")
    publications = [
        (str(uuid.uuid4()), "Climate Change Impacts on Arctic Ice Extent", scientist_ids[0] if scientist_ids else None, "Recent satellite data shows accelerating Arctic ice loss", "10.1038/nature12345", 2024, "Nature Climate Change", "15", "2", "145-152", "https://nature.com/articles/ncc.2024.001", "2024-02-15", True),
        (str(uuid.uuid4()), "Deep Ocean Currents in the Southern Ocean", scientist_ids[1] if len(scientist_ids) > 1 else None, "Analysis of thermohaline circulation patterns", "10.1016/j.dsr.2024.104001", 2024, "Deep Sea Research", "206", "1", "104001", "https://sciencedirect.com/science/article/pii/S0967064524001234", "2024-01-20", False),
        (str(uuid.uuid4()), "Greenland Ice Sheet Mass Balance Assessment", scientist_ids[2] if len(scientist_ids) > 2 else None, "Multi-sensor approach to ice mass estimation", "10.5194/tc-18-543-2024", 2024, "The Cryosphere", "18", "2", "543-558", "https://tc.copernicus.org/articles/18/543/2024/", "2024-03-10", True),
        (str(uuid.uuid4()), "Ozone Depletion in Antarctic Stratosphere", scientist_ids[3] if len(scientist_ids) > 3 else None, "Spring ozone hole measurements and projections", "10.1038/s41467-024-45678", 2024, "Nature Communications", "15", "1", "1234", "https://nature.com/articles/s41467-024-45678", "2024-04-05", True),
        (str(uuid.uuid4()), "Biodiversity of Polar Microorganisms", scientist_ids[4] if len(scientist_ids) > 4 else None, "Genomic survey of extremophile organisms", "10.1128/mBio.00123-24", 2024, "mBio", "15", "2", "e00123-24", "https://mbio.asm.org/content/15/2/e00123-24", "2024-05-12", True),
    ]
    
    try:
        sql = """
            INSERT INTO publications 
            (id, title, lead_scientist_id, abstract, doi, year, journal, 
             volume, issue, pages, url, published_date, is_open_access, created_at, updated_at)
            VALUES %s
        """
        records = [(p[0], p[1], p[2], p[3], p[4], p[5], p[6], p[7], p[8], p[9], p[10], p[11], p[12], datetime.utcnow(), datetime.utcnow()) for p in publications]
        execute_values(cur, sql, records)
        conn.commit()
        print(f"   ✅ Added {len(publications)} publications")
    except Exception as e:
        conn.rollback()
        print(f"   ❌ Error: {e}")
    
    # Sample Stations
    print("\n3️⃣  Adding Research Stations...")
    stations = [
        (str(uuid.uuid4()), "Barrow Arctic Research Center", "USA", "arctic", 71.2906, -156.6113, 4, "NOAA", True, -8.5, 22.5),
        (str(uuid.uuid4()), "Svalbard Global Seed Vault Research Station", "Norway", "arctic", 78.2232, 15.5267, 209, "Global Crop Diversity Trust", True, -12.3, 18.9),
        (str(uuid.uuid4()), "South Pole Amundsen-Scott Station", "Antarctica", "antarctic", -90.0, 0.0, 2835, "NSF", True, -45.2, 28.3),
        (str(uuid.uuid4()), "Concordia Station", "Antarctica/France", "antarctic", -75.1069, 123.3292, 3233, "IPEV/PNRA", True, -52.1, 24.7),
        (str(uuid.uuid4()), "Zhongshan Station", "China", "antarctic", -69.3743, 76.3809, 80, "CAA", True, -28.5, 15.2),
    ]
    
    try:
        sql = """
            INSERT INTO stations 
            (id, name, country, region, latitude, longitude, altitude, operator, 
             is_operational, current_temperature_c, current_wind_kph, created_at, updated_at)
            VALUES %s
        """
        records = [(s[0], s[1], s[2], s[3], s[4], s[5], s[6], s[7], s[8], s[9], s[10], datetime.utcnow(), datetime.utcnow()) for s in stations]
        execute_values(cur, sql, records)
        conn.commit()
        station_ids = [s[0] for s in stations]
        print(f"   ✅ Added {len(station_ids)} stations")
    except Exception as e:
        conn.rollback()
        print(f"   ❌ Error: {e}")
        station_ids = []
    
    # Sample Expeditions
    print("\n4️⃣  Adding Expeditions...")
    expeditions = [
        (str(uuid.uuid4()), scientist_ids[0] if scientist_ids else None, "Arctic Summer 2024 Climate Survey", "arctic", "2024-06-01", "2024-08-31", 250000, "active"),
        (str(uuid.uuid4()), scientist_ids[2] if len(scientist_ids) > 2 else None, "Greenland Ice Core Drilling 2024", "himalaya", "2024-07-15", "2024-09-15", 450000, "active"),
        (str(uuid.uuid4()), scientist_ids[1] if len(scientist_ids) > 1 else None, "Southern Ocean Oceanographic Campaign", "southern_ocean", "2024-11-01", "2025-02-28", 520000, "planned"),
        (str(uuid.uuid4()), scientist_ids[3] if len(scientist_ids) > 3 else None, "Antarctic Atmospheric Research Mission", "antarctic", "2024-12-01", "2025-03-31", 380000, "planned"),
    ]
    
    try:
        sql = """
            INSERT INTO expeditions 
            (id, lead_scientist_id, name, region, start_date, end_date, budget, status, 
             created_at, updated_at)
            VALUES %s
        """
        records = [(e[0], e[1], e[2], e[3], e[4], e[5], e[6], e[7], datetime.utcnow(), datetime.utcnow()) for e in expeditions]
        execute_values(cur, sql, records)
        conn.commit()
        print(f"   ✅ Added {len(expeditions)} expeditions")
    except Exception as e:
        conn.rollback()
        print(f"   ❌ Error: {e}")
    
    # Sample Events
    print("\n5️⃣  Adding Climate Events...")
    events = [
        (str(uuid.uuid4()), "Record Arctic Sea Ice Minimum", "arctic", "critical", "2024-09-15", "Lowest Arctic sea ice extent recorded in satellite era"),
        (str(uuid.uuid4()), "Antarctic Ozone Hole Peak", "antarctic", "high", "2024-10-02", "Annual ozone hole reaches maximum depletion"),
        (str(uuid.uuid4()), "Greenland Melt Season", "himalaya", "high", "2024-06-15", "Rapid surface melting across Greenland ice sheet"),
        (str(uuid.uuid4()), "Coral Bleaching Event - Southern Ocean", "southern_ocean", "moderate", "2024-02-01", "Temperature anomalies cause stress in polar ecosystems"),
    ]
    
    try:
        sql = """
            INSERT INTO events 
            (id, title, region, severity, date, description, created_at, updated_at)
            VALUES %s
        """
        records = [(e[0], e[1], e[2], e[3], e[4], e[5], datetime.utcnow(), datetime.utcnow()) for e in events]
        execute_values(cur, sql, records)
        conn.commit()
        print(f"   ✅ Added {len(events)} events")
    except Exception as e:
        conn.rollback()
        print(f"   ❌ Error: {e}")
    
    cur.close()
    conn.close()
    
    print("\n" + "="*60)
    print("✅ Database seeded successfully!")
    print("="*60 + "\n")


if __name__ == "__main__":
    seed_database()
