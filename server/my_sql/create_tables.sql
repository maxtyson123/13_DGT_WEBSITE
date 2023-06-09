-- Plants Primary Table
CREATE TABLE plants (
    id INT NOT NULL AUTO_INCREMENT,
    preferred_name TEXT,
    english_name TEXT,
    maori_name TEXT,
    latin_name TEXT,
    location_found TEXT,
    small_description TEXT,
    long_description TEXT,
    author TEXT,
    last_modified DATE,
	PRIMARY KEY (id)
);

-- Months For Use
CREATE TABLE months_ready_for_use (
    id INT NOT NULL AUTO_INCREMENT,
    plant_id INT,
    months_event TEXT,
    months_start_month TEXT,
    months_end_month TEXT,
	PRIMARY KEY (id),
	FOREIGN KEY (plant_id) REFERENCES plants(id)
);


-- Attachments
CREATE TABLE attachments (
    id INT NOT NULL AUTO_INCREMENT,
    plant_id INT,
    attachments_path TEXT,
    attachments_type TEXT,
    attachments_meta JSON,
    attachments_downloadable BOOLEAN,
	PRIMARY KEY (id),
	FOREIGN KEY (plant_id) REFERENCES plants(id)
);

-- Medical Section
CREATE TABLE medical (
    id INT NOT NULL AUTO_INCREMENT,
    plant_id INT,
    medical_type TEXT,
    medical_use TEXT,
    medical_image TEXT,
    medical_preparation TEXT,
	PRIMARY KEY (id),
	FOREIGN KEY (plant_id) REFERENCES plants(id)
);


-- Craft Section
CREATE TABLE craft (
    id INT NOT NULL AUTO_INCREMENT,
    plant_id INT,
    craft_part_of_plant TEXT,
    craft_use TEXT,
    craft_image TEXT,
    craft_additional_info TEXT,
	PRIMARY KEY (id),
	FOREIGN KEY (plant_id) REFERENCES plants(id)
);


-- Sources Section
CREATE TABLE source (
    id INT NOT NULL AUTO_INCREMENT,
    plant_id INT,
    source_type TEXT,
    source_data TEXT,
	PRIMARY KEY (id),
	FOREIGN KEY (plant_id) REFERENCES plants(id)
);


-- Custom Sections
CREATE TABLE custom (
    id INT NOT NULL AUTO_INCREMENT,
    plant_id INT,
    custom_title TEXT,
    custom_text TEXT,
    PRIMARY KEY (id),
    FOREIGN KEY (plant_id) REFERENCES plants(id)
);


-- Edible Section
CREATE TABLE edible (
    id INT NOT NULL AUTO_INCREMENT,
    plant_id INT,
    edible_part_of_plant TEXT,
    edible_image TEXT,
    edible_nutrition TEXT,
    edible_preparation TEXT,
    edible_preparation_type TEXT,
	PRIMARY KEY (id),
	FOREIGN KEY (plant_id) REFERENCES plants(id)
);

-- User Auth
CREATE TABLE auth (
    id SERIAL PRIMARY KEY,
    auth_entry TEXT,
    auth_type TEXT
);