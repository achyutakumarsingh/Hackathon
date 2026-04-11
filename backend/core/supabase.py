import os
from supabase import create_client, Client

url: str = os.environ.get("SUPABASE_URL", "https://placeholder.supabase.co")
key: str = os.environ.get("SUPABASE_KEY", "placeholder_key")

supabase: Client = create_client(url, key)
