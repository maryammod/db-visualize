const shell = require("shelljs");
const consola = require("consola");
const path = require("path");
const cliProgress = require("cli-progress");
const fs = require("fs");
const dayjs = require("dayjs");

const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017?writeConcern=majority";
const client = new MongoClient(uri);

const jsonfile = "sample-results.json";

async function upsertFile(name) {
  try {
    // try to read file
    await fs.promises.readFile(name);
  } catch (error) {
    // create empty file, because it wasn't found
    await fs.promises.writeFile(name, "");
  }
}

upsertFile(jsonfile);
fs.writeFileSync(jsonfile, "[]");

async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    console.log("-------");
    const db = client.db("maryam_thesis");
    const photos = db.collection("photos");

    let data = [];

    // Establish and verify connection
    const agg = photos.aggregate(
      [
        {
          $match: {
            taken_at: { $gte: new Date("2020-04-01T00:00:00Z") },
          },
        },
        {
          $group: {
            _id: { label: "$label_2" },
            plant_ids: { $addToSet: "$plant_id_2" },
          },
        },
      ],
      { allowDiskUse: true }
    );

    while (await agg.hasNext()) {
      let doc = await agg.next();

      let label = doc._id.label;

      for (const plantId of doc.plant_ids) {
        [
          10,
          15,
          20,
          25,
          30,
          35,
          40,
          45,
          50,
          55,
          60,
          65,
          70,
          75,
          80,
          85,
          90,
        ].forEach((age) => {
          data.push({
            label: label,
            plant_id: plantId,
            age: age,
          });
        });
      }
    }

    for (const item of data) {
      consola.info(`${item.label}  | ${item.plant_id}  | ${item.age} to ${item.age +4 }`);
      let samples = photos.aggregate([
        {
          $match: {
            taken_at: { $gte: new Date("2020-04-01T00:00:00Z") },
            age: { $gte: item.age, $lte: item.age + 4 },
            label_2: { $eq: item.label },
            plant_id_2: { $eq: item.plant_id },
          },
        },
        { $sample: { size: 2 } },
      ]);

      while (await samples.hasNext()) {
        let sample = await samples.next();
        // fetch the image
        let filename = sample.filename.replace(/ /g, "_");
        let path = sample.path;
        let dirPath = "/raid/maryam/__data/photos/cedar/originals" + path;
        let fileAddress = `${dirPath}singles/${filename}`;

        if (filename) {
          sample["fullpath"] = fileAddress;
          const data = fs.readFileSync(jsonfile);
          const json = JSON.parse(data);
          json.push(sample);
          fs.writeFileSync(jsonfile, JSON.stringify(json));

          let command2 = `scp maryam@digits.acs.uwinnipeg.ca:${fileAddress} samples/${filename}`;
          shell.exec(command2, { silent: false });

          consola.info(`        : saved ${filename}`);
        }
      }
    }
    console.log(data);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
