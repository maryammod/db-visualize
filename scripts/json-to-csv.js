const fs = require("fs");
const readline = require("readline");

async function processLineByLine(file, cb) {
  const fileStream = fs.createReadStream(file);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

  for await (const line of rl) {
    cb(line);
  }
}

const writeStream = fs.createWriteStream("../data/dataset.csv", { flags: "w" });

writeStream.once("open", function (fd) {
  writeStream.write(`filename,path,age,label,group` + "\r\n");

  processLineByLine("../data/dataset.json", function (line) {
    const row = JSON.parse(line);
    writeStream.write(
      `"${row.filename}","${row.path}","${row.age}","${row.label_h}","${row.group}"` +
        "\r\n"
    );
  });
});
