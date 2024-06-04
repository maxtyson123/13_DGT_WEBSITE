import json
import os
plants = [

]

class _Getch:
    """Gets a single character from standard input.  Does not echo to the screen."""
    def __init__(self):
        try:
            self.impl = _GetchWindows()
        except ImportError:
            self.impl = _GetchUnix()

    def __call__(self):
        char = self.impl()
        if char == '\x03':
            raise KeyboardInterrupt
        elif char == '\x04':
            raise EOFError
        return char

class _GetchUnix:
    def __init__(self):
        import tty
        import sys

    def __call__(self):
        import sys
        import tty
        import termios
        fd = sys.stdin.fileno()
        old_settings = termios.tcgetattr(fd)
        try:
            tty.setraw(sys.stdin.fileno())
            ch = sys.stdin.read(1)
        finally:
            termios.tcsetattr(fd, termios.TCSADRAIN, old_settings)
        return ch


class _GetchWindows:
    def __init__(self):
        import msvcrt

    def __call__(self):
        import msvcrt
        return msvcrt.getch()


getch = _Getch()

def combine():

    # Read the names
    file = open("data/out/names.json", "r", encoding="utf8")
    rawData = json.load(file)

    # Check if the filter json exists
    if not os.path.exists("data/out/namesfilter.json"):
        with open("data/out/namesfilter.json", "w", encoding="utf-8") as out:
            out.write(json.dumps(rawData, indent=4, ensure_ascii=False))

    # Read the filter json
    file = open("data/out/namesfilter.json", "r", encoding="utf8")
    rawData = json.load(file)

    # Words to ignore
    ignore = [
        "Island",
        "Islands",
        "mountain",
        "dwarf",
        "Aston's",
        "Auckland",
        "Australian",
        "Peninsula",
        "Banks",
        "Adams's",
        "Akaroa",
        "Alpine",
        "Antipodes",
        "Armstrong's",
        'Bay',
        'of',
        'Cook',
        'Strait',
        'limestone',
        'Castle',
        'Hill',
        'Chatham',
        "Colenso's",
        'Common',
        "Molloy's",
        '',
        'sun',
        'tree',
        ',',
        'soft',
        "Druce's",
        'tī',
        'snow',
        "Gibbs's",
        'swamp',
        'Māori',
        'Green',
        'New-Zealand',
        "Hooker's",
        'Kermadec',
        'Moss',
        'only)',
        'NZ',
        'native',
        'yellow',
        'mint',
        'Pacific',
        'red',
        'water',
        "Sinclair's",
        'Three', 'Kings',
        'alpine',
        'button',
        'black',
        'Westland',
        'climbing',
        'coastal',
        'common',
        'creeping',
        'trailing',
        'de', "Lange's",
        'grass',
        'hairy',
        'ink-berry',
        'white',
        'lesser',
        'wood',
        'native',
        'prickly',
        'sand',
    ]

    combineWords = [
        'marguerite',
        'umbrella-fern',
        'toro',
        'taupata',
        'sneezeweed',
        'brome',
        'rock-fern',
        'pygmy',
        'puruagrass',
        'willow-herb',
        'puka',
        'rasp-fern',
        'zoysia',
        'poroporo',
        'karapapa',
        'toropapa',
        'nettle',
        'hibiscus',
        'māwhai',
        'mānuka',
        'snowberry',
        'selliera',
        'wineberry',
        'plumegrass',
        'lance-fern',
        'lace-fern',
        'spinach',
        'tainui',
        'kumarahou',
        'korokio',
        'kiokio',
        'king-fern',
        'cedar',
        'karo',
        'pine',
        'wirerush',
        'blueberry',
        'pennywort',
        'violet',
        'nightshade',
        'hypericum',
        'grassland',
        'leaflessrush',
        'gahnia',
        'mokimoki',
        'sundew',
        'parsley-fern',
        'lancewood',
        'bent',
        'fan-fern',
        'dwarf-musk',
        'pepper',
        'kawakawa',
        'cuttygrass',
        'neinei',
        'heruheru',
        'crêpe-fern',
        'piupiu',
        'pōhuehue',
        'muehlenbeckia',
        'lawyer',
        'fuchsia',
        'strap-fern',
        'maidenhair',
        'inaka',
        'duckweed',
        'comb-fern',
        'woodrush',
        'brake',
        'bindweed',
        'filmy-fern',
        'convolvulus',
        'maru',
        'baumea',
        'bristle-fern',
        'bracken',
        'bladderwort',
        'maire',
        'piripiri',
        'bidibid',
        'beech',
        'morning-glory',
        'tangle-fern',
        'holygrass',
        'clubmoss',
        'akeake',
        'tōtara',
        'milfoil',
        'tawhero',
        'rangiora',
        'milk-tree',
        'kaikōmako',
        'cabbage-tree',
        'oxalis',
        'haloragis',
        'vegetable-sheep',
        'astelia',
        'tamingi',
        'strapfern',
        'shield-fern',
        'sow-thistle',
        'pimelea',
        'houhere',
        'cushion',
        'scabweed',
        'rātā',
        'greenhood',
        'horopito',
        'eyebright',
        'windgrass',
        'marsh',
        'lobelia',
        'caltha',
        'jasmine',
        'chickweed',
        'toki',
        'gunnera',
        'dock',
        'tauhinu',
        'dichondra',
        'edelweiss',
        'peppercress',
        'groundsel',
        'tutu',
        'tree-fern',
        'pōhutukawa',
        'nīkau',
        'ngaio',
        'five-finger',
        "sedge",
        "lichen",
        "harebell",
        "daisy",
        "broom",
        "geum",
        "avens",
        "aniseed",
        'fern',
        'kānuka',
        'tussock',
        'fescue',
        'bittercress',
        'wheat-grass',
        'saltgrass',
        'buttercup',
        'bamboo',
        'bamboo-rush',
        'bastard-grass',
        'bastardgrass',
        'celery',
        'ice-plant',
        'mapou',
        'matipo',
        'mingimingi',
        'spleenwort',
        'toetoe',
        'hard-fern',
        'hard-fern,',
        'daisy,',
        'kōwhai',
        'mikoikoi',
        'geranium',
        'ribbonwood',
        'orchid',
        'bristlegrass',
        'foxglove',
        'speargrass',
        'karamū',
        'starwort',
        'mikoikoi',
        'forget-me-not',
        'cabbage-tree,'
        'korokio',
        'kōhūhū',
        'oatgrass',
        'clematis',
        'coprosma',
        'lily',
        'onion',
        'pirita',
        'carrot',
        'Haastia'
        'orchid',
        'fireweed',
        'orache',
        'Inaka',
        'crassula',
        'crystalwort',
        'colobanthus',
        'pondweed',
        'Hutu',
        'māhoe',
        'hinahina',
        'mahoe',
        'woollyhead',
    ]

    # Check if there are any duplicates
    for data in rawData:
        for data2 in rawData:

            # If this is the same data skip
            if data == data2:
                continue

            # Get the components of the name
            splitNames = data["common"].split(" ")
            splitNames2 = data2["common"].split(" ")

            # Replace all commas
            for i in range(len(splitNames)):
                splitNames[i] = splitNames[i].replace(",", "")

            for i in range(len(splitNames2)):
                splitNames2[i] = splitNames2[i].replace(",", "")

            match = False

            # Check if there are any duplicates
            for name in splitNames:
                if name in splitNames2 and name not in ignore:

                    # Check if it has already been combined
                    if name in combineWords:

                        print(f"Already combined '{name}'")

                        # Combine
                        data["scientific"] += ", " + data2["scientific"]

                        if data2 in rawData:
                            rawData.remove(data2)
                        continue

                    match = True
                    break



            # Ask the user if they want to combine the names
            if match and data != data2:

                # Ask the user to selec what part of the name to combine
                os.system('cls')
                print(f"What part is duplicated in '{splitNames}' and '{splitNames2}'?")

                user = input()

                # If input is c the write the data to a file and exit
                if user == "c":
                    with open("data/out/namesfilter.json", "w", encoding="utf-8") as out:
                        out.write(json.dumps(rawData, indent=4, ensure_ascii=False))
                    return

                #Check if '!' is in the input
                if "!" in user:

                    # Remove the '!' from the input
                    user = user.replace("!", "")

                    # Get the index of the name
                    index = int(user) - 1
                    if index < 0:
                        continue


                    continue


                index = int(user) - 1
                if index < 0:
                    continue

                combineWords.append(splitNames[index])

                # Combine the names
                data["scientific"] += ", " + data2["scientific"]
                rawData.remove(data2)


    # Write the data to a file
    with open("data/out/namesfilter.json", "w", encoding="utf-8") as out:
        out.write(json.dumps(rawData, indent=4, ensure_ascii=False))

def main():

    #combine()

    # Read all the names
    file = open("data/out/namesfilter.json", "r", encoding="utf8")
    rawData = json.load(file)

    # Already sorted
    finishedFile = open("data/out/sortnames.json", "r", encoding="utf8")
    finishedData = json.load(finishedFile)

    # Count all the names
    total = 0
    for data in rawData:
        total += len(data["common"].split(", "))

    # Count the finished names
    finished = 0
    start = 0
    for data in finishedData:
        finished += len(data["moari"]) + len(data["english"])
        start += 1


    input(f"Names to sort: {total - finished}, Finished: {finished}, Total: {total}, Percentage: {finished/total*100}% (plants done: {start})")

    current = 0
    for data in rawData:

        # Check if the name is already sorted
        if current < start:
            current += 1
            print(f"Skipping {data['scientific']}")
            continue

        scientific = data["scientific"]
        common = data["common"].split(", ")
        moari = []
        english = []

        # Loop through each common name
        for name in common:
            os.system('cls')
            print(f"Is '{name}' English? (y/n)")
            key = getch()
            if(key == b'y' ):
                english.append(name)

            elif(key == b'c'):
                with open("data/out/sortnames.json", "w", encoding="utf-8") as out:
                    out.write(json.dumps(plants, indent=4, ensure_ascii=False))
                return 

            else:
                moari.append(name)

        plants.append({
            "scientific": scientific,
            "moari": moari,
            "english": english
        })

    # Write the data to a file
    with open("data/out/sortnames.json", "w", encoding="utf-8") as out:
        out.write(json.dumps(plants, indent=4, ensure_ascii=False))




if __name__ == "__main__":
    main()