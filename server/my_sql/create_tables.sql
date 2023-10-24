-- Plants Primary Table
CREATE TABLE plants (
    id INT NOT NULL AUTO_INCREMENT,
    preferred_name TEXT UNICODE,
    english_name  TEXT UNICODE,
    maori_name  TEXT UNICODE,
    latin_name  TEXT UNICODE,
    location_found  TEXT UNICODE,
    small_description  TEXT UNICODE,
    long_description  TEXT UNICODE,
    author  TEXT UNICODE,
    last_modified DATE,
    display_image  TEXT UNICODE,
    plant_type  TEXT UNICODE,
	PRIMARY KEY (id)
);

-- Months For Use
CREATE TABLE months_ready_for_use (
    id INT NOT NULL AUTO_INCREMENT,
    plant_id INT,
    months_event  TEXT UNICODE,
    months_start_month  TEXT UNICODE,
    months_end_month  TEXT UNICODE,
	PRIMARY KEY (id),
	FOREIGN KEY (plant_id) REFERENCES plants(id)
);


-- Attachments
CREATE TABLE attachments (
    id INT NOT NULL AUTO_INCREMENT,
    plant_id INT,
    attachments_path  TEXT UNICODE,
    attachments_type  TEXT UNICODE,
    attachments_meta JSON,
    attachments_downloadable BOOLEAN,
	PRIMARY KEY (id),
	FOREIGN KEY (plant_id) REFERENCES plants(id)
);

-- Medical Section
CREATE TABLE medical (
    id INT NOT NULL AUTO_INCREMENT,
    plant_id INT,
    medical_type  TEXT UNICODE,
    medical_use_identifier  TEXT UNICODE,
    medical_use  TEXT UNICODE,
    medical_image  TEXT UNICODE,
    medical_preparation  TEXT UNICODE,
	PRIMARY KEY (id),
	FOREIGN KEY (plant_id) REFERENCES plants(id)
);


-- Craft Section
CREATE TABLE craft (
    id INT NOT NULL AUTO_INCREMENT,
    plant_id INT,
    craft_part_of_plant  TEXT UNICODE,
    craft_use_identifier  TEXT UNICODE,
    craft_use  TEXT UNICODE,
    craft_image  TEXT UNICODE,
    craft_additional_info  TEXT UNICODE,
	PRIMARY KEY (id),
	FOREIGN KEY (plant_id) REFERENCES plants(id)
);


-- Sources Section
CREATE TABLE source (
    id INT NOT NULL AUTO_INCREMENT,
    plant_id INT,
    source_type  TEXT UNICODE,
    source_data  TEXT UNICODE,
	PRIMARY KEY (id),
	FOREIGN KEY (plant_id) REFERENCES plants(id)
);


-- Custom Sections
CREATE TABLE custom (
    id INT NOT NULL AUTO_INCREMENT,
    plant_id INT,
    custom_title  TEXT UNICODE,
    custom_text  TEXT UNICODE,
    PRIMARY KEY (id),
    FOREIGN KEY (plant_id) REFERENCES plants(id)
);


-- Edible Section
CREATE TABLE edible (
    id INT NOT NULL AUTO_INCREMENT,
    plant_id INT,
    edible_part_of_plant  TEXT UNICODE,
    edible_use_identifier  TEXT UNICODE,
    edible_image  TEXT UNICODE,
    edible_nutrition  TEXT UNICODE,
    edible_preparation  TEXT UNICODE,
    edible_preparation_type  TEXT UNICODE,
	PRIMARY KEY (id),
	FOREIGN KEY (plant_id) REFERENCES plants(id)
);

-- User Auth
CREATE TABLE auth (
    id SERIAL PRIMARY KEY,
    auth_entry  TEXT UNICODE,
    auth_type  TEXT UNICODE,
    auth_nickname  TEXT UNICODE,
    auth_permissions  TEXT UNICODE
);