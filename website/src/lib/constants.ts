export const PLANT_PARTS   = ["Stem", "Leaf", "Root", "Heart", "Flower", "Petals", "Fruit", "Bark", "Inner Bark", "Seeds", "Shoot", "Pollen", "Wood", "Gum", "Whole Plant"];
export const MONTHS        = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export const MESSAGES_NOTIFICATIONS = "test3";
export const NOTIFICATIONS = "test";

/**
 * Should the server connect to the database using postgres or mysql?
 * If true, use postgres, if false, use mysql
 */
export const USE_POSTGRES = process.env["DB_TYPE"] === "postgres";