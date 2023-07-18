-- Plants Primary Table
CREATE TABLE plants (
    id SERIAL PRIMARY KEY,
    preferred_name TEXT,
    english_name TEXT,
    maori_name TEXT,
    latin_name TEXT,
    location_found TEXT,
    small_description TEXT,
    long_description TEXT,
    author TEXT,
    last_modified DATE,
    display_image TEXT,
);

-- Months For Use
CREATE TABLE months_ready_for_use (
    id SERIAL PRIMARY KEY,
    plant_id INTEGER REFERENCES plants(id),
    event TEXT,
    start_month TEXT,
    end_month TEXT
);

ALTER TABLE months_ready_for_use
ADD CONSTRAINT fk_mru_plants
FOREIGN KEY (plant_id)
REFERENCES plants(id);

-- Attachments
CREATE TABLE attachments (
    id SERIAL PRIMARY KEY,
    plant_id INTEGER REFERENCES plants(id),
    path TEXT,
    type TEXT,
    meta JSON,
    downloadable BOOLEAN,

);

ALTER TABLE attachments
ADD CONSTRAINT fk_attachments_plants
FOREIGN KEY (plant_id)
REFERENCES plants(id);


-- Medical Section
CREATE TABLE medical (
    id SERIAL PRIMARY KEY,
    plant_id INTEGER REFERENCES plants(id),
    medical_type TEXT,
    use TEXT,
    image TEXT,
    preparation TEXT
);

ALTER TABLE medical
ADD CONSTRAINT fk_medical_plants
FOREIGN KEY (plant_id)
REFERENCES plants(id);

-- Craft Section
CREATE TABLE craft (
    id SERIAL PRIMARY KEY,
    plant_id INTEGER REFERENCES plants(id),
    part_of_plant TEXT,
    use TEXT,
    image TEXT,
    additional_info TEXT
);

ALTER TABLE craft
ADD CONSTRAINT fk_craft_plants
FOREIGN KEY (plant_id)
REFERENCES plants(id);

-- Sources Section
CREATE TABLE source (
    id SERIAL PRIMARY KEY,
    plant_id INTEGER REFERENCES plants(id),
    source_type TEXT,
    data TEXT
);

ALTER TABLE source
ADD CONSTRAINT fk_source_plants
FOREIGN KEY (plant_id)
REFERENCES plants(id);

-- Custom Sections
CREATE TABLE custom (
    id SERIAL PRIMARY KEY,
    plant_id INTEGER REFERENCES plants(id),
    title TEXT,
    text TEXT
);

ALTER TABLE custom
ADD CONSTRAINT fk_custom_plants
FOREIGN KEY (plant_id)
REFERENCES plants(id);


-- Edible Section
CREATE TABLE edible (
    id SERIAL PRIMARY KEY,
    plant_id INTEGER REFERENCES plants(id),
    part_of_plant TEXT,
    image_of_part TEXT,
    nutrition TEXT,
    preparation TEXT,
    preparation_type TEXT
);

ALTER TABLE edible
ADD CONSTRAINT fk_edible_plants
FOREIGN KEY (plant_id)
REFERENCES plants(id);

-- User Auth
CREATE TABLE auth (
    id SERIAL PRIMARY KEY,
    entry TEXT,
    type TEXT,
    nickname TEXT,
    permissions TEXT,
);