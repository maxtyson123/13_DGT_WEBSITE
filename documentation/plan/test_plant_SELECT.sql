SELECT
  plants.preferred_name,
  plants.english_name,
  plants.maori_name,
  plants.latin_name,
  plants.location,
  plants.small_description,
  plants.long_description,
  array_agg(months_ready.event) AS months_ready_events,
  array_agg(months_ready.start_month) AS months_ready_start_months,
  array_agg(months_ready.end_month) AS months_ready_end_months,
  array_agg(edible.part_of_plant) AS edible_parts,
  array_agg(edible.image_of_part) AS edible_images,
  array_agg(edible.nutrition) AS edible_nutrition,
  array_agg(edible.preparation) AS edible_preparation,
  array_agg(edible.preparation_type) AS edible_preparation_type,
  array_agg(medical.medical_type) AS medical_types,
  array_agg(medical.use) AS medical_uses,
  array_agg(medical.image) AS medical_images,
  array_agg(medical.preparation) AS medical_preparation,
  array_agg(craft.part_of_plant) AS craft_parts,
  array_agg(craft.use) AS craft_uses,
  array_agg(craft.image) AS craft_images,
  array_agg(craft.additional_info) AS craft_additional_info,
  array_agg(source.source_type) AS source_types,
  array_agg(source.data) AS source_data,
  array_agg(custom.title) AS custom_titles,
  array_agg(custom.text) AS custom_text
FROM public.plants
LEFT JOIN months_ready_for_use AS months_ready ON plants.id = months_ready.plant_id
LEFT JOIN edible ON plants.id = edible.plant_id
LEFT JOIN medical ON plants.id = medical.plant_id
LEFT JOIN craft ON plants.id = craft.plant_id
LEFT JOIN source ON plants.id = source.plant_id
LEFT JOIN custom ON plants.id = custom.plant_id
WHERE plants.id = 10
GROUP BY plants.id;
