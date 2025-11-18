import fs from "fs";

const folder = "./"; // your local music directory
const files = fs.readdirSync(folder);

// Keep only .ogg files
const tracks = files.filter(f => f.endsWith(".ogg"));

fs.writeFileSync(
  "./tracks.json",
  JSON.stringify(tracks, null, 2)
);

console.log("Generated tracks.json with", tracks.length, "tracks.");
