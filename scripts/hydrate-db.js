const shell = require("shelljs");
const consola = require("consola");
const path = require("path");
const cliProgress = require("cli-progress");
const fs = require("fs");
const dayjs = require("dayjs");

var mongoose = require("mongoose");


var photoSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  plant_id: String,
  label: String,
  scientific_name: String,
  filename: String,
  path: String,
  age: Number,
  taken_at: Date,
  planted_at: Date,
  created: { 
    type: Date,
    default: Date.now
  }
});

const photoModel = mongoose.model('photo', photoSchema);


//

const getAllFiles = function(dirPath, arrayOfFiles) {
  files = fs.readdirSync(dirPath)

  arrayOfFiles = arrayOfFiles || []

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file))
    }
  })

  return arrayOfFiles
}


const run = async () => {
  
  await mongoose.connect(
    "mongodb://localhost:27017/maryam_thesis"
  );


  const dir = path.join("..", "json_files");
  
  const files = getAllFiles(dir);
  console.log("")
  consola.info(`Found ${files.length} JSON files`)
  
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

    const photoTaken = dayjs(content.date);
     
    for (const plant of content.bounding_boxes) {
      const planted = dayjs(plant.date_planted);
      const age = photoTaken.diff(planted, "day");
      const path = file.replace("../json_files","").split("json_files")[0]
      let data = {
        plant_id: plant.plant_id,
        label: plant.label,
        scientific_name: plant.scientific_name,
        filename: plant.subimage_file_name.replace(/ /g,"_"),
        path,
        age,
        taken_at: photoTaken.format(),
        planted_at: planted.format(),
      };
      const photo = new photoModel({
        _id: new mongoose.Types.ObjectId(),
        ...data
      })
      await photo.save()
    }
  }

  bar1.stop();
  consola.info("Errored on:" + errors.length);
  consola.log(errors);
  process.exit()
};

run()