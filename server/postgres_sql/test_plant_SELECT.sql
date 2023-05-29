SELECT
plants.preferred_name,
plants.english_name,
plants.maori_name,
plants.latin_name,
plants.location,
plants.small_description,
plants.long_description,
months_ready.months_ready_events,
months_ready.months_ready_start_months,
months_ready.months_ready_end_months,
edible.edible_parts,
edible.edible_images,
edible.edible_nutrition,
edible.edible_preparation,
edible.edible_preparation_type,
medical.medical_types,
medical.medical_uses,
medical.medical_images,
medical.medical_preparation,
craft.craft_parts,
craft.craft_uses,
craft.craft_images,
craft.craft_additional_info,
source.source_types,
source.source_data,
custom.custom_titles,
custom.custom_text
FROM public.plants

LEFT JOIN (SELECT
plant_id,
array_agg(event) AS months_ready_events,
array_agg(start_month) AS months_ready_start_months,
array_agg(end_month) AS months_ready_end_months
FROM months_ready_for_use
WHERE plant_id = 10
GROUP BY plant_id
) months_ready ON plants.id = months_ready.plant_id

LEFT JOIN (
SELECT
plant_id,
array_agg(part_of_plant) AS edible_parts,
array_agg(image_of_part) AS edible_images,
array_agg(nutrition) AS edible_nutrition,
array_agg(preparation) AS edible_preparation,
array_agg(preparation_type) AS edible_preparation_type
FROM edible
WHERE plant_id = 10
GROUP BY plant_id
) edible ON plants.id = edible.plant_id

LEFT JOIN (
SELECT
plant_id,
array_agg(medical_type) AS medical_types,
array_agg(use) AS medical_uses,
array_agg(image) AS medical_images,
array_agg(preparation) AS medical_preparation
FROM medical
WHERE plant_id = 10
GROUP BY plant_id
) medical ON plants.id = medical.plant_id

LEFT JOIN (
SELECT
plant_id,
array_agg(part_of_plant) AS craft_parts,
array_agg(use) AS craft_uses,
array_agg(image) AS craft_images,
array_agg(additional_info) AS craft_additional_info
FROM craft
WHERE plant_id = 10
GROUP BY plant_id
) craft ON plants.id = craft.plant_id

LEFT JOIN (
SELECT
plant_id,
array_agg(source_type) AS source_types,
array_agg(data) AS source_data
FROM source
WHERE plant_id = 10
GROUP BY plant_id
) source ON plants.id = source.plant_id

LEFT JOIN (
SELECT
plant_id,
array_agg(title) AS custom_titles,
array_agg(text) AS custom_text
FROM custom
WHERE plant_id = 10
GROUP BY plant_id
) custom ON plants.id = custom.plant_id
WHERE plants.id = 10;