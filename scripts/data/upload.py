# Read the data from the JSON file
import json
import os
import requests
import pyperclip


english_already = [
"Sow Thistle",
"White Tea Tree",
"Red Tea Tree",
"Plantain",
"NZ Pepper Tree",
"Hen & Chicken Fern",
"Hebe",
"Blue Pinkgill",
"Pepper tree",
"Wineberry",
"Gumdiggers soap, Poverty weed",
"The New Zealand Laurel",
"Supplejack",
"Mangrove",
"Christmas Tree",
"Bullrush",
"Flax & Mountain Flax",
]





moari_already = [
"P4h0",
"K0nuka",
"M0nuka / Kahik0toa",
"Kopakopa",
"Kawakawa",
"Pikopiko",
"Koromiko",
"Werewere-K3kako",
"Horopito",
"Makomako",
"K4marahou",
"Karaka",
"Kareao",
"Manawa",
"Pohutukawa",
"Raup3",
"Harakeke",

]


DATA = "out/sortnames.json"
macronDictionary  = ["ā", "ē", "ī", "ō", "ū", "Ā", "Ē", "Ī", "Ō", "Ū"]
numberDictionary  = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]

def removeApostrophes(word):
    return word.replace("'", "")

def macronConvert(word):

    for macron in macronDictionary:
        word = word.replace(macron, numberDictionary[macronDictionary.index(macron)])

    return word



def main():
    data = json.load(open(DATA, "r", encoding="utf-8"))

    sql = ""
    skipped =0

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

        # Remove any macrons
        english_name = macronConvert(english_name)
        maori_name = macronConvert(maori_name)
        latin_name = macronConvert(latin_name)

        # Remove any apostrophes
        english_name = removeApostrophes(english_name)
        maori_name = removeApostrophes(maori_name)
        latin_name = removeApostrophes(latin_name)

        # Check if the plant is already in the database
        if english_name in english_already or maori_name in moari_already:
            skipped += 1
            continue

        # Make a request to the API posting the data
        sql += f"INSERT INTO plants ( preferred_name, english_name, maori_name, latin_name, location_found, small_description, long_description, author, last_modified, display_image, plant_type, published) VALUES ( '{preferred_name}', '{english_name}', '{maori_name}', '{latin_name}', 'Forest', 'Not Published - Change This', 'Not Published - Change This', '2', FROM_UNIXTIME(1717988479818 / 1000.0), 'Deafult', 'Plant', 0) ;"

    # Copy to clipboard
    pyperclip.copy(sql)
    print(f"Skipped {skipped} plants")

main()
