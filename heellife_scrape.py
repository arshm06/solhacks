from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import time
import pandas as pd
from collections import defaultdict

# Chrome setup
options = Options()
# options.add_argument("--headless")
driver = webdriver.Chrome(options=options)

perks = ["Credit", "FreeFood", "FreeStuff", "Merchandise"]
event_dict = defaultdict(lambda: {"Title": "N/A", "Date": "N/A", "Location": "N/A", "Perks": set()})

# Scrape each perk page once
for perk in perks:
    url = f"https://heellife.unc.edu/events?perks={perk}"
    print(f"\n🔍 Scraping events for: {perk}")
    
    driver.get(url)
    time.sleep(2)

    for _ in range(5):
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(1)

    cards = driver.find_elements(By.XPATH, "//a[starts-with(@href, '/event/')]")
    event_links = set(card.get_attribute("href") for card in cards if card.get_attribute("href"))

    for link in event_links:
        if link not in event_dict or event_dict[link]["Title"] == "N/A":
            driver.get(link)
            time.sleep(1.5)

            try:
                title = driver.find_element(By.TAG_NAME, "h1").text
            except:
                title = "N/A"

            try:
                date = driver.find_element(By.XPATH, "//strong[text()='Date and Time']/following-sibling::div").text.replace('\n', ' ')
            except:
                date = "N/A"

            try:
                location = driver.find_element(By.XPATH, "//strong[text()='Location']/following-sibling::div").text
            except:
                location = "N/A"

            event_dict[link].update({
                "Title": title,
                "Date": date,
                "Location": location
            })

        # Add current perk
        event_dict[link]["Perks"].add(perk)

driver.quit()

# Flatten to DataFrame
event_data = []
for url, data in event_dict.items():
    event_data.append({
        "Title": data["Title"],
        "Date": data["Date"],
        "Location": data["Location"],
        "Perks": ", ".join(sorted(data["Perks"])),
        "URL": url
    })

df = pd.DataFrame(event_data)
df.to_csv("heel_life_events_cleaned.csv", index=False)
print("\n🎉 Done! Events saved with combined perks to heel_life_events_cleaned.csv")
