


const shell = require("shelljs");
const consola = require("consola");
const path = require("path");
const cliProgress = require("cli-progress");
const fs = require("fs");
const dayjs = require("dayjs");

const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017?writeConcern=majority";
const client = new MongoClient(uri);

const jsonfile = "sample-results.json"


async function upsertFile(name) {
  try {
    // try to read file
    await fs.promises.readFile(name)
  } catch (error) {
    // create empty file, because it wasn't found
    await fs.promises.writeFile(name, '')
  }
}

upsertFile(jsonfile)
fs.writeFileSync(jsonfile, "[]");


async function run() {
  try {
    
    // Connect the client to the server
    await client.connect();
    console.log("-------");
    const db = client.db("maryam_thesis");
    const photos = db.collection("photos");
    // Establish and verify connection
    const agg = photos.aggregate(
      [
        {
          $match: {
            planted_at: { $gte: new Date("2020-02-01T00:00:00Z") },
            age: { $gte: 20, $lte: 30 },
          },
        },
        {
          $group: {
            _id: { label: "$label" },
            plant_ids: { $addToSet: "$plant_id" },
          },
        },
      ],
      { allowDiskUse: true }
    );

    for await (let doc of agg) {
      let label = doc._id.label;
      
      doc.plant_ids.forEach(async (plantId) => {

        [10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90].forEach(async (age)=>{
          
          let samples = photos.aggregate([
            {
              $match: {
                planted_at: { $gte: new Date("2020-02-01T00:00:00Z") },
                age: { $gte: age - 2, $lte: age + 2 },
                label: { $eq: label },
                plant_id: { $eq: plantId },
              },
            },
            { $sample: { size: 2 } },
          ]);
          
          
          for await (let doc of samples) {
            // fetch the image
            let filename = doc.filename.replace(/ /g,"_")
            let path = doc.path
            let dirPath = "/raid/maryam/__data/photos/cedar/originals" + path ;
            let fileAddress = `${dirPath}singles/${filename}`
            
            if (filename){
              doc["fullpath"] = fileAddress
              const data = fs.readFileSync(jsonfile);
              const json = JSON.parse(data);
              json.push(doc);
              fs.writeFileSync(jsonfile, JSON.stringify(json));
              

              let command2 = `scp maryam@digits.acs.uwinnipeg.ca:${fileAddress} samples/${filename}`;
              shell.exec(command2, { silent: false });

              consola.info(`saved ${filename}`);
            }
            
            
          }
        })

        consola.info("end")
      });

    }
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
