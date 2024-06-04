import json
import os
import csv
import subprocess
import time

FILE_PATH = "data/"
SCIENTIFIC_NAME = 0
COMMON_NAME = 4
# Get the names
def get_names():

    #  Get the files
    files = os.listdir(FILE_PATH)
    names = []
    ignore = ["hebe"]

    # Read the csv files and store the names in a list
    for file in files:

        # Check if the file is a csv file
        if file.endswith(".csv"):

            # Read the csv file
            with open(FILE_PATH + file, "r",  encoding="utf8") as out:
                csv_reader = csv.reader(out, delimiter=',')
                for row in csv_reader:

                    common = row[COMMON_NAME]
                    science = row[SCIENTIFIC_NAME]
                    manual = False

                    # Check if common name is not empty
                    if common == "":
                        continue

                    # Check if common is ignored
                    bad = False
                    for pattern in ignore:
                        if pattern in common:
                            bad = True

                    if(bad):
                        continue

                    # If it is not already in the array
                    if not [science, common, manual] in names:
                        names.append([science, common, manual])


    # Combine the scientific names if the common names are the same
    for name in names:
            for name2 in names:
                if name[1] == name2[1] and name[0] != name2[0]:

                    # Combine the names     
                    name[0] += ", " + name2[0]

                    # Check if the name is manual or there are more than 4 scientific names
                    if name2[2] or len(name[0].split(", ")) > 4:
                        name[2] = True

                    names.remove(name2)



    # Sort the names alphabetically by common name
    names.sort(key=lambda x: x[1])

    # Store all the names with multiple scientific names in a json file
    with open("data/out/multi_names.json", "w", encoding="utf-8") as out:

        out_names = []

        for name in names:
            if name[2]:

                # Make the json output
                out_names.append({
                    "scientific": name[0],
                    "common": name[1]
                })

                # Remove
                names.remove(name)

        out.write(json.dumps(out_names, indent=4))


    # Check if there is no data
    for name in names:
        if len(name[0].split(", ")) > 1:
            continue

        # Request the url if the name is not already in the folder
        if not os.path.exists(f"data/searchs/{name[0].replace(' ', '_')}.html"):
            url = '"https://www.nzpcn.org.nz/flora/species/?native=1&scientific_name='
            url += name[0].replace(" ", "+")
            url += '"'
            command = f"curl -silent -o data/searchs/{name[0].replace(' ', '_')}.html {url}"
            os.system(command)


        print(f"\rDone: {names.index(name)}/{len(names)}, Percent: {round((names.index(name) / len(names)) * 100, 2)}%", end="")

        # Check if the file contains the string "/site/templates/images/no-photo.png"
        with open(f"data/searchs/{name[0].replace(' ', '_')}.html", "r", encoding="utf-8") as f:
            data = f.read()
            if "/site/templates/images/no-photo.png" in data:
                print(f"\rERROR: No image found for {name[0]}")
                names.remove(name)


    # Return the names
    return names


# Run Main
if __name__ == "__main__":

    # Get the names
    names = get_names()

    # Print the names
    out_names = []
    for name in names:
            out_names.append({
                "scientific": name[0],
                "common": name[1]
            })
            print(f"Scientific Name: {name[0]} || Common Name: {name[1]}")

    # Save to json file

    with open("data/out/names.json", "w", encoding="utf-8") as f:
        f.write(json.dumps(out_names, indent=4))

