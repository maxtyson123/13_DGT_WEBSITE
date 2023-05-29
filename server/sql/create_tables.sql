-- Plants Primary Table
CREATE TABLE plants (
    id int NOT NULL,
    plants_preferred_name TEXT,
    plants_english_name TEXT,
    plants_maori_name TEXT,
    plants_latin_name TEXT,
    plants_location TEXT,
    plants_small_description TEXT,
    plants_long_description TEXT,
	PRIMARY KEY (id)
);

-- Months For Use
CREATE TABLE months_ready_for_use (
    id int NOT NULL,
    plant_id int,
    months_ready_for_use_event TEXT,
    months_ready_for_use_start_month TEXT,
    months_ready_for_use_end_month TEXT,
	PRIMARY KEY (id),
	FOREIGN KEY (plant_id) REFERENCES plants(id)
);


-- Attachments
CREATE TABLE attachments (
    id int NOT NULL,
    plant_id int,
    attachments_path TEXT,
    attachments_type TEXT,
    attachments_name TEXT,
    attachments_downloadable BOOLEAN,
	PRIMARY KEY (id),
	FOREIGN KEY (plant_id) REFERENCES plants(id)
);

-- Medical Section
CREATE TABLE medical (
    id int NOT NULL,
    plant_id int,
    medical_medical_type TEXT,
    medical_use TEXT,
    medical_image TEXT,
    medical_preparation TEXT,
	PRIMARY KEY (id),
	FOREIGN KEY (plant_id) REFERENCES plants(id)
);


-- Craft Section
CREATE TABLE craft (
    id int NOT NULL,
    plant_id int,
    craft_part_of_plant TEXT,
    craft_use TEXT,
    craft_image TEXT,
    craft_additional_info TEXT
	PRIMARY KEY (id),
	FOREIGN KEY (plant_id) REFERENCES plants(id)
);


-- Sources Section
CREATE TABLE source (
    id int NOT NULL,
    plant_id int,
    source_type TEXT,
    source_data TEXT,
	PRIMARY KEY (id),
	FOREIGN KEY (plant_id) REFERENCES plants(id)
);


-- Custom Sections
CREATE TABLE custom (
    id int NOT NULL,
    plant_id int,
    custom_title TEXT,
    custom_text TEXT,
    PRIMARY KEY (id),
    FOREIGN KEY (plant_id) REFERENCES plants(id)
);


-- Edible Section
CREATE TABLE edible (
    id int NOT NULL,
    plant_id int,
    edible_part_of_plant TEXT,
    edible_image_of_part TEXT,
    edible_nutrition TEXT,
    edible_preparation TEXT,
    edible_preparation_type TEXT,
	PRIMARY KEY (id),
	FOREIGN KEY (plant_id) REFERENCES plants(id)
);
