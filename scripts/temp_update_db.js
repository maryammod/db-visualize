const shell = require("shelljs");
const consola = require("consola");
const path = require("path");
const cliProgress = require("cli-progress");
const fs = require("fs");
const dayjs = require("dayjs");

const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017?writeConcern=majority";
const client = new MongoClient(uri);

//

const getAllFiles = function (dirPath, arrayOfFiles) {
  files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });

  return arrayOfFiles;
};

const run = async () => {
  await client.connect();
  const db = client.db("maryam_thesis");
  const photos = db.collection("photos");

  const dir = path.join("..", "json_files");

  const files = getAllFiles(dir);
  console.log("");
  consola.info(`Found ${files.length} JSON files`);

  const bar1 = new cliProgress.SingleBar(
    {},
    cliProgress.Presets.shades_classic
  );
  bar1.start(files.length, 0);

  let errors = [];

  for (const file of files) {
    bar1.increment();

    if (!file.endsWith(".json")) continue;

    let rawdata = fs.readFileSync(file);
    let content = "";
    try {
      content = JSON.parse(rawdata);
    } catch (e) {
      // consola.error("Json Error: " + file)
      errors.push(file);
      continue;
    }

    for (const plant of content.bounding_boxes) {
      const filename = plant.subimage_file_name.replace(/ /g, "_");
      await photos.findOneAndUpdate(
        { filename: filename },
        { $set: { label: plant.label, plant_id: plant.plant_id } }
      );
    }
  }

  bar1.stop();
  consola.info("Errored on:" + errors.length);
  consola.log(errors);
  process.exit();
};

run();
