const collection = "dataset";

db.getCollection(collection).createIndex(
  {
    label_h: 1,
  },
  {
    unique: false,
    sparse: true,
    expireAfterSeconds: 3600,
  }
);
db.getCollection(collection).createIndex(
  {
    group: 1,
  },
  {
    unique: false,
    sparse: true,
    expireAfterSeconds: 3600,
  }
);

db.getCollection(collection)
  .aggregate([
    {
      $group: {
        _id: { label_h: "$label_h" },
        label_h: { $last: "$label_h" },
        group: { $last: "$group" },
        count: { $sum: 1 },
      },
    },
    { $sort: { group: 1 } },
  ])
  .forEach((item) => {
    print(
      `{ "label_h": "${item.label_h}", "group": "${item.group}", "count":${item.count} },`
    );
  });
