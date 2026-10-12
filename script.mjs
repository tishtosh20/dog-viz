import fs from "fs"; //import file system module from node js
import { parse } from "csv-parse/sync"; //use parse function from csv-parse/sync module to convert csv into js objects

// Read the CSV file
const csv = fs.readFileSync("./NYC_Dog_Licensing_Dataset.csv", "utf8"); //utf8 reads file as a string

// Convert CSV into JavaScript objects
const dogs = parse(csv, {
  columns: true, //column: true uses the first row in csv as keys for the objects
  skip_empty_lines: true, //preventing errors from empty lines in the csv file
});

// Count how many times each name appears
let nameCounts = {};

for (let i of dogs) {
  let name = i.AnimalName?.trim().toUpperCase(); //triming whitespace and converting to uppercase to avoid duplicates due to case sensitivity

  if (name && name !== "UNKNOWN" && name !== "NAME NOT PROVIDED") {
    //only count actual nanmes not missing values or unknown names
    if (nameCounts[name]) {
      nameCounts[name]++; //if its an existing name, add to the count
    } else {
      nameCounts[name] = 1; //otherwise, create a new entry
    }
  }
}

// Convert the counts into an array
let nameData = Object.entries(nameCounts).map(([name, count]) => ({
  name: name,
  count: count,
})); //mapping through nameCounts to create an array for the json.


nameData.sort((a, b) => b.count - a.count);

// Select the top 20 names
let top20 = nameData.slice(0, 20);

// Randomize the order of the top 20 names (fischer-yates shuffle) source: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
for (let i = top20.length - 1; i > 0; i--) {
  let j = Math.floor(Math.random() * (i + 1));

  [top20[i], top20[j]] = [top20[j], top20[i]];
}

// Create data.json
fs.writeFileSync("./data.json", JSON.stringify(top20, null, 2));

// Print the results
console.log(top20);
console.log("data.json created successfully!");
