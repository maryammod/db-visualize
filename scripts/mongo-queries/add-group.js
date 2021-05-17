const mappings = [
  { label_h: "Bean", group: "G1", min_age: "11", max_age: "43" },
  { label_h: "Field Pea", group: "G1", min_age: "11", max_age: "39" },
  {
    label_h: "Wild Buckwheat",
    group: "G1",
    min_age: "12",
    max_age: "91",
  },
  { label_h: "Smartweed", group: "G2", min_age: "14", max_age: "67" },
  {
    label_h: "Canada Thistle",
    group: "G2",
    min_age: "24",
    max_age: "91",
  },
  { label_h: "Dandelion", group: "G2", min_age: "24", max_age: "89" },
  { label_h: "Soybean", group: "G2", min_age: "14", max_age: "66" },
  { label_h: "Canola", group: "G2", min_age: "14", max_age: "65" },
  { label_h: "Wheat", group: "G3", min_age: "10", max_age: "60" },
  {
    label_h: "Yellow Foxtail",
    group: "G3",
    min_age: "12",
    max_age: "89",
  },
  { label_h: "Oat", group: "G3", min_age: "18", max_age: "44" },
  { label_h: "Wild Oat", group: "G3", min_age: "10", max_age: "48" },
  {
    label_h: "Barnyard Grass",
    group: "G3",
    min_age: "18",
    max_age: "43",
  },
];

db.getCollection("photos").createIndex(
  {
    label_h: 1,
  },
  {
    unique: false,
    sparse: true,
    expireAfterSeconds: 3600,
  }
);

print("Before:\n");
mappings.forEach((mapping) => {
  let min = parseInt(mapping.min_age);
  let max = parseInt(mapping.max_age);
  db.getCollection("photos")
    .aggregate([
      {
        $match: {
          label_h: { $eq: mapping.label_h },
          age: { $gte: min, $lte: max },
        },
      },
      {
        $group: {
          _id: null,
          label_h: { $last: "$label_h" },
          count: { $sum: 1 },
        },
      },
    ])
    .forEach((res) => {
      print(`${res.label_h}: ${res.count}`);
    });
});

print("Adding Groups:\n");
mappings.forEach((mapping) => {
  let min = parseInt(mapping.min_age);
  let max = parseInt(mapping.max_age);
  let label = mapping.label_h;
  let group = mapping.group;

  print(`lebel_h: ${label} | min: ${min} | max: ${max} -> ${group}`);
  db.getCollection("photos").updateMany(
    {
      label_h: { $eq: label },
      age: { $gte: min, $lte: max },
    },
    { $set: { group: group } }
  );
});

print("Report:\n");
["G1", "G2", "G3"].forEach((group) => {
  db.getCollection("photos")
    .aggregate([
      {
        $match: {
          group: { $eq: group },
        },
      },
      {
        $group: {
          _id: null,
          group: { $last: "$group" },
          count: { $sum: 1 },
        },
      },
    ])
    .forEach((res) => {
      print(`{ "group":"${group}", "count":${res.count} }`);
    });
});
