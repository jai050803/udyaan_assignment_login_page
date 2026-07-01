import asyncio
import json
import os
import sys
from scraper import scrape_udyam
from parser import parse_fields

def main():
    try:
        print("Starting scraping process...")
        raw_fields = asyncio.run(scrape_udyam())
        
        print("Parsing scraped fields...")
        schema = parse_fields(raw_fields)
        
        output_dir = os.path.join(os.path.dirname(__file__), "output")
        os.makedirs(output_dir, exist_ok=True)
        output_file = os.path.join(output_dir, "form-schema.json")
        
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(schema, f, indent=2)
            
        print("Scraping complete. Schema written to output/form-schema.json")
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
