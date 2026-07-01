import json
import uuid
import os
from datetime import datetime, timezone

def parse_fields(raw_fields):
    steps = {
        "1": [],
        "2": []
    }
    
    for field in raw_fields:
        step_val = str(field.get("step", 1))
        
        f_id = field.get("id") or str(uuid.uuid4())
        f_name = field.get("name") or f_id
        
        f_type = field.get("type") or "text"
        if field.get("tag") == "select":
            f_type = "select"
        elif field.get("tag") == "textarea":
            f_type = "textarea"
        elif field.get("tag") == "button":
            f_type = "button"
            
        max_length = field.get("maxlength")
        if max_length and max_length.isdigit():
            max_length = int(max_length)
        else:
            max_length = None
            
        parsed_field = {
            "id": f_id,
            "name": f_name,
            "label": field.get("label") or f_name,
            "type": f_type,
            "placeholder": field.get("placeholder") or "",
            "validation": {
                "required": bool(field.get("required")),
                "pattern": field.get("pattern") or "",
                "minLength": None,
                "maxLength": max_length
            },
            "step": int(step_val)
        }
        
        if step_val in steps:
            steps[step_val].append(parsed_field)
            
    result = {
        "steps": steps,
        "scrapedAt": datetime.now(timezone.utc).isoformat()
    }
    return result

if __name__ == "__main__":
    base_dir = os.path.dirname(__file__)
    input_path = os.path.join(base_dir, "output", "raw_fields.json")
    output_path = os.path.join(base_dir, "output", "parsed_schema.json")
    
    if os.path.exists(input_path):
        with open(input_path, "r", encoding="utf-8") as f:
            raw_data = json.load(f)
            
        schema = parse_fields(raw_data)
        
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(schema, f, indent=2)
            
        print(f"Parsing completed. Schema saved to {output_path}")
    else:
        print(f"Error: {input_path} not found. Run scraper.py first.")
