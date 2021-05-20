const collection = "dataset";
print("label,plant_id,count");
db.getCollection(collection)
  .aggregate([
    {
      $group: {
        _id: { label: "$label_2" },
        label: { $first: "$label_2" },
        plant_ids: { $addToSet: "$plant_id_2" },
      },
    },
  ])
  .forEach((item) => {
    item.plant_ids.forEach((thisPlant) => {
      print(item.label, thisPlant);
      db.getCollection(collection)
        .aggregate([
          {
            $match: { plant_id: thisPlant },
          },
          {
            $group: {
              _id: null,
              plant_id: { $last: "$plant_id" },
              count: { $sum: 1 },
            },
          },
        ])
        .forEach((res) => {
          print(`${item.label},${thisPlant},${res.count}`);
        });
    });
  });
