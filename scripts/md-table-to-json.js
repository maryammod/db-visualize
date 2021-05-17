const x = `
| Plant type         | type |
| ------------------ | ---- |
| Pink Bean          | crop |
| Black Bean Eclipse | crop |
| Kidney Bean        | crop |
| Navy Bean          | crop |
| Black Bean         | crop |
| Kidney Bean        | crop |
| Pinto Bean         | crop |
| Cranberry Bean     | crop |
| Field Pea          | crop |
| Wild Buckwheat     | weed |
| Smartweed          | weed |
| Canada Thistle     | weed |
| Dandelion          | weed |
| Soybean            | crop |
| Canola             | crop |
| Wheat              | crop |
| Yellow Foxtail     | weed |
| Oat                | crop |
| Wild Oat           | weed |
| BarnyardGrass      | weed |
`;

const tb = require("mdtable2json").getTables(x);

console.log(tb[0].json);
