import asyncio
import json
import os
from playwright.async_api import async_playwright
from bs4 import BeautifulSoup

async def scrape_udyam():
    url = "https://udyamregistration.gov.in/UdyamRegistration.aspx"
    fields_data = []
    
    async with async_playwright() as p:
        try:
            print(f"Launching headless browser...")
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()
            
            print(f"Navigating to {url}")
            await page.goto(url, wait_until="networkidle")
            
            # Step 1
            print("Extracting Step 1 fields...")
            html = await page.content()
            step1_fields = extract_fields_from_html(html, step=1)
            fields_data.extend(step1_fields)
            
            # Try to trigger Step 2 elements
            print("Attempting to reach Step 2...")
            try:
                # Usually there's a button to validate Aadhaar
                await page.click("button[id*='btnValidate'], input[id*='btnValidate'], input[type='submit'], button[type='submit']", timeout=3000)
                await page.wait_for_timeout(2000)
            except Exception:
                # Ignore if button click fails or times out
                pass
            
            print("Extracting Step 2 fields...")
            html_step2 = await page.content()
            step2_fields = extract_fields_from_html(html_step2, step=2)
            
            # Deduplicate
            step1_ids = {f.get('id') for f in step1_fields if f.get('id')}
            step1_names = {f.get('name') for f in step1_fields if f.get('name')}
            
            for f in step2_fields:
                fid = f.get('id')
                fname = f.get('name')
                if (fid and fid in step1_ids) or (fname and fname in step1_names):
                    continue
                fields_data.append(f)
                
            await browser.close()
            return fields_data
            
        except Exception as e:
            print(f"Error during scraping: {e}")
            return []

def extract_fields_from_html(html_content, step):
    soup = BeautifulSoup(html_content, "lxml")
    fields = []
    elements = soup.find_all(['input', 'select', 'textarea', 'button'])
    
    for el in elements:
        tag = el.name
        el_type = el.get('type')
        if tag == 'input' and el_type == 'hidden':
            continue
            
        el_id = el.get('id')
        el_name = el.get('name')
        if not el_id and not el_name and tag != 'button':
            continue
            
        label_text = None
        if el.get('aria-label'):
            label_text = el.get('aria-label')
        elif el_id:
            label_el = soup.find('label', {'for': el_id})
            if label_el:
                label_text = label_el.get_text(strip=True)
                
        if not label_text and el.parent and el.parent.name == 'label':
            label_text = el.parent.get_text(strip=True)
            
        fields.append({
            'tag': tag,
            'type': el_type,
            'name': el_name,
            'id': el_id,
            'placeholder': el.get('placeholder'),
            'label': label_text,
            'pattern': el.get('pattern'),
            'maxlength': el.get('maxlength'),
            'required': el.has_attr('required'),
            'step': step
        })
    return fields

if __name__ == "__main__":
    data = asyncio.run(scrape_udyam())
    output_dir = os.path.join(os.path.dirname(__file__), "output")
    os.makedirs(output_dir, exist_ok=True)
    output_file = os.path.join(output_dir, "raw_fields.json")
    
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
    print(f"Scraping completed. Raw data saved to {output_file}")
