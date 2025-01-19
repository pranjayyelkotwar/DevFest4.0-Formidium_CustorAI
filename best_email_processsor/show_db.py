import psycopg2
from psycopg2 import sql

# Database connection parameters
conn_params = {
    "host": "localhost",
    "port": 5432,
    "dbname": "email_processor",
    "user": "pranjayyelkotwar",
    "password": "your_password"
}

# Connect to the database
conn = psycopg2.connect(**conn_params)
cursor = conn.cursor()

# List all tables
cursor.execute("""
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public';
""")
tables = cursor.fetchall()
print("Tables in the database:")
for table in tables:
    print(table[0])

# View data from a specific table
table_name = "processed_emails"
cursor.execute(sql.SQL("SELECT * FROM {};").format(sql.Identifier(table_name)))
rows = cursor.fetchall()
print(f"\nData in {table_name}:")
for row in rows:
    print(row)

# Close the connection
cursor.close()
conn.close()