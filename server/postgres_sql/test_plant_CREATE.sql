-- Insert data into plants table
INSERT INTO plants (preferred_name, english_name, maori_name, latin_name, location, small_description, long_description)
VALUES ('Moari', 'Christmas Tree', 'Pohutukawa', 'Metrosideros excelsa', 'Coastal', 'N/A', '<p>A large spreading tree up to 25 metres high, with a dark grey gnarled trunk.</p><p>The leaves are 2-10 cm long and velvety white beneath, to defend the tree against any excess of salt in the air or sea spray.</p><p>The tree bears spectacular tufted red flowers.</p><p>The Pohutukawa is found along cliffs and in coastal forest. North of Lake Taupo only.</p><p>Pohutukawa is said to mean "splashed by the spray". Its roots are sometimes anchor for the northern rock oyster and its branches are home to seabirds.</p>');

-- Create temporary table to hold new plant ID
CREATE TEMPORARY TABLE new_plant AS (
  SELECT id
  FROM plants
  ORDER BY id DESC
  LIMIT 1
);

-- Use the new plant ID in other queries
INSERT INTO months_ready_for_use (plant_id, event, start_month, end_month)
VALUES ((SELECT id FROM new_plant), 'Test', 'May', 'May'),
       ((SELECT id FROM new_plant), 'Flowers', NULL, 'February');

INSERT INTO edible (plant_id, part_of_plant, image_of_part, nutrition, preparation, preparation_type)
VALUES ((SELECT id FROM new_plant), 'Flower', 'Image 1', 'Very similar to that of honey, but with a higher percentage of water.', '<p>Eat the nectar directly from the flower. This can be quite difficult to do without getting a mouthful of the long red stamens (the male parts of the flower).</p>', 'Raw'),
       ((SELECT id FROM new_plant), 'Whole Plant', 'Image 1', 'N/A', '<p>N/A</p>', 'Raw');

INSERT INTO medical (plant_id, medical_type, use, image, preparation)
VALUES ((SELECT id FROM new_plant), 'External', '<p>ASD</p>', 'Image 1', '<p>ASD</p>');

INSERT INTO craft (plant_id, part_of_plant, use, image, additional_info)
VALUES ((SELECT id FROM new_plant), 'Test Custom Option', '<p>N/A</p>', 'Image 1', '<p>N/A</p>');

INSERT INTO source (plant_id, source_type, data)
VALUES ((SELECT id FROM new_plant), 'Internet', 'Link Possibly??');

INSERT INTO custom (plant_id, title, text)
VALUES ((SELECT id FROM new_plant), 'History', '<p>The Christmas tree name is a reminder of the season when the pohutukawa blooms, and a reminder that before artificial tinsel, its red blooms were used to adorn the Christmas trees of English colonists.</p><p>In the Maori world to mention that a person "has slid down the pohutukawa root" is a poetic way of saying that he has travelled to the world of his ancestors. This is a reference to the pohutukawa tree that once stood on the cliffs at Cape Reinga, the departure point for the Maori other worlds.</p>');