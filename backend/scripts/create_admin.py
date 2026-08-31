#!/usr/bin/env python3
"""
Create an admin user account in the database.
"""

import uuid
from datetime import datetime
import psycopg2
import hashlib
import os

DB_HOST = "localhost"
DB_PORT = 5432
DB_NAME = "polar_nexus"
DB_USER = "postgres"
DB_PASSWORD = "vishva@15"


def hash_password(password: str) -> str:
    """Hash password using SHA256."""
    salt = os.urandom(16)
    password_hash = hashlib.pbkdf2_hmac('sha256', password.encode(), salt, 100000)
    return salt.hex() + password_hash.hex()


def create_admin_user():
    """Create admin user."""
    print("\n" + "="*60)
    print("👤 Creating Admin User")
    print("="*60 + "\n")
    
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
        )
        cur = conn.cursor()
        
        # Admin credentials
        admin_id = str(uuid.uuid4())
        admin_email = "admin@polarnexus.app"
        admin_password = "admin@PolarNexus2024"
        admin_full_name = "Polar Nexus Admin"
        
        # Create password hash (using simple SHA256 for demo, but in production use bcrypt)
        # For now, store plain password for development
        password_hash = hashlib.sha256(admin_password.encode()).hexdigest()
        
        # Insert user
        try:
            cur.execute("""
                INSERT INTO users 
                (id, email, password_hash, role, created_at, updated_at)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (admin_id, admin_email, password_hash, "admin", datetime.utcnow(), datetime.utcnow()))
            
            conn.commit()
            print(f"✅ Admin user created!")
            print(f"\n📧 Email: {admin_email}")
            print(f"🔑 Password: {admin_password}")
            print(f"👤 Role: admin")
            print(f"\n💾 Save these credentials - you'll need them to log in.")
            
        except psycopg2.IntegrityError:
            conn.rollback()
            print("⚠️  Admin user already exists")
        
        cur.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")
    
    print("\n" + "="*60 + "\n")


if __name__ == "__main__":
    create_admin_user()
