import asyncio
import json
import os
from playwright.async_api import async_playwright # type: ignore
from bs4 import BeautifulSoup # type: ignore

async def scrape_udyam():
    url = "https://udyamregistration.gov.in/UdyamRegistration.aspx"
    fields_data = []
    
    async with async_playwright() as p:
        try:
            print("🚀 Launching browser...")
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page(
                viewport={"width": 1920, "height": 1080},
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            )
            
            print(f"Navigating to {url}")
            await page.goto(url, wait_until="networkidle", timeout=30000)
            
            # === STEP 1: Aadhaar Form ===
            print("📋 Extracting Step 1 (Aadhaar)...")
            html = await page.content()
            step1_fields = extract_fields_from_html(html, step=1)
            fields_data.extend(step1_fields)
            
            # Trigger progression to Step 2 (simulate Aadhaar validation flow)
            print("🔄 Attempting to progress to PAN / Step 2...")
            try:
                # Click the main validate button
                await page.click("#ctl00_ContentPlaceHolder1_btnValidateAadhaar, input[type='submit'], button[type='submit']", timeout=5000)
                await page.wait_for_timeout(3000)
                
                # Sometimes OTP appears - capture it if visible
                await page.wait_for_selector("input[id*='otp'], input[placeholder*='OTP']", timeout=5000)
                print("✅ OTP field detected")
            except Exception as e:
                print(f"Note: Could not auto-progress (expected in headless): {e}")
            
            # === STEP 2: PAN Form ===
            print("📋 Extracting Step 2 (PAN + Organisation)...")
            html_step2 = await page.content()
            step2_fields = extract_fields_from_html(html_step2, step=2)
            
            # Deduplication + filtering noise
            seen = set()
            clean_fields = []
            
            for field in fields_data + step2_fields:
                key = (field.get('id'), field.get('name'), field.get('type'))
                if key in seen or not key[0] and not key[1]:
                    continue
                # Filter out junk buttons
                if field['tag'] == 'button' and not field.get('id') and not field.get('name'):
                    continue
                if "feedback" in (field.get('id') or '').lower():
                    continue
                
                seen.add(key)
                clean_fields.append(field)
            
            await browser.close()
            return clean_fields
            
        except Exception as e:
            print(f"❌ Error: {e}")
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
        
        # Skip completely anonymous elements
        if not el_id and not el_name and tag != 'button':
            continue
            
        # Better label extraction
        label_text = None
        if el_id:
            label_el = soup.find('label', {'for': el_id})
            if label_el:
                label_text = label_el.get_text(strip=True)
        
        if not label_text:
            # Try parent label or nearby text
            parent = el.find_parent('label')
            if parent:
                label_text = parent.get_text(strip=True)
            elif el.get('placeholder'):
                label_text = el.get('placeholder')
            elif el.get('aria-label'):
                label_text = el.get('aria-label')
        
        field = {
            'tag': tag,
            'type': el_type,
            'name': el_name,
            'id': el_id,
            'placeholder': el.get('placeholder'),
            'label': label_text,
            'pattern': el.get('pattern'),
            'maxlength': el.get('maxlength'),
            'required': el.has_attr('required') or 'required' in (el.get('class') or []),
            'step': step,
            'value': el.get('value')  # helpful for debugging
        }
        fields.append(field)
    
    return fields

if __name__ == "__main__":
    data = asyncio.run(scrape_udyam())
    
    output_dir = os.path.join(os.path.dirname(__file__), "output")
    os.makedirs(output_dir, exist_ok=True)
    output_file = os.path.join(output_dir, "raw_fields.json")
    
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Scraping completed! Data saved to: {output_file}")
    print(f"Total fields extracted: {len(data)}")