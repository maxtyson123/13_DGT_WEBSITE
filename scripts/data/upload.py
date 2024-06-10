# Read the data from the JSON file
import json
import os
import requests

DATA = "out/sortnames.json"
API = "http://localhost:3000/api/plants/testplant"

def main():
    data = json.load(open(DATA, "r", encoding="utf-8"))

    sql = ""

    for i in data:
        english_name = "scientific"
        maori_name = ""
        latin_name = i["scientific"]
        preferred_name = "Latin"

        if len(i["english"]) > 0:
            english_name = ','.join(i["english"]).title()
            preferred_name = "English"

        if len(i["moari"]) > 0:
            maori_name = ','.join(i["moari"]).title()
            preferred_name = "Maori"

        # Make a request to the API posting the data
        sql += f"INSERT INTO plants ( preferred_name, english_name, maori_name, latin_name, location_found, small_description, long_description, author, last_modified, display_image, plant_type, published) VALUES ( '{preferred_name}', '{english_name}', '{maori_name}', '{latin_name}', 'Forest', 'Not Published - Change This', 'Not Published - Change This', '2', FROM_UNIXTIME(1717988479818 / 1000.0), 'Deafult', 'Plant', 1) ;DROP TABLE IF EXISTS new_plant; CREATE TEMPORARY TABLE new_plant AS ( SELECT id FROM plants ORDER BY id DESC LIMIT 1 ); SELECT id FROM new_plant;



main()
