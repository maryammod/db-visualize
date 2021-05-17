const mappings = [
  { label: "Pink Bean", label_h: "Bean" },
  { label: "Black Bean Eclipse", label_h: "Bean" },
  { label: "Kidney Bean", label_h: "Bean" },
  { label: "Navy Bean", label_h: "Bean" },
  { label: "Black Bean", label_h: "Bean" },
  { label: "Kidney Bean", label_h: "Bean" },
  { label: "Pinto Bean", label_h: "Bean" },
  { label: "Cranberry Bean", label_h: "Bean" },
  { label: "FieldPea", label_h: "Field Pea" },
  { label: "WildBuckwheat", label_h: "Wild Buckwheat" },
  { label: "Smartweed", label_h: "Smartweed" },
  { label: "CanadaThistle", label_h: "Canada Thistle" },
  { label: "Dandelion", label_h: "Dandelion" },
  { label: "Soybean", label_h: "Soybean" },
  { label: "Canola", label_h: "Canola" },
  { label: "Wheat", label_h: "Wheat" },
  { label: "YellowFoxtail", label_h: "Yellow Foxtail" },
  { label: "Oat", label_h: "Oat" },
  { label: "WildOat", label_h: "Wild Oat" },
  { label: "BarnyardGrass", label_h: "Barnyard Grass" },
];

db.getCollection("photos").createIndex(
  {
    label: 1,
  },
  {
    unique: false,
    sparse: true,
    expireAfterSeconds: 3600,
  }
);

mappings.forEach((mapping) => {
  let label = mapping.label;
  let label_h = mapping.label_h;

  print(`lebel_h: ${label}  -> ${label_h}`);
  db.getCollection("photos").updateMany(
    {
      label: { $eq: label },
    },
    {
      $set: {
        label_h: label_h,
      },
    }
  );
});
