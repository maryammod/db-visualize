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
  
  const labelSet = new Set()
  const plantIdSet = new Set()

  await client.connect();
  const db = client.db("maryam_thesis");
  const photos = db.collection("photos");

  const all = photos.find();

  while (await all.hasNext()) {
    let doc = await all.next();
    if ( doc.label != doc.label_2)
      labelSet.add(`${doc.label_2}__${doc.label}`)
    
    if ( doc.plant_id != doc.plant_id_2)
      plantIdSet.add(`${doc.plant_id_2}__${doc.plant_id}`)
  }

  // console.log("New Plant_id,Old Plant_id")
  // let plantIds = Array.from(plantIdSet).sort();
  // plantIds.forEach(item=>{
  //   let map = item.split("__");
  //   console.log(`"${map[0]}","${map[1]}"`)
  // })

  console.log("New Label,Old Label")
  let labels = Array.from(labelSet).sort();
  labels.forEach(item=>{
    let map = item.split("__");
    console.log(`"${map[0]}","${map[1]}"`)
  })

  // console.log({labelSet})
  // console.log({plantIdSet})
};

run();
