const shell = require("shelljs");
const consola = require("consola");
const path = require('path');

const prefixComputeCanada = "/home/maryaam/projects/rrg-cjhuofw/DigAP/CampusData/rgb_images/under_review"

const f1 = {
  "2020_04": "2020April",
  "2020_05": "2020May",
  "2020_06": "2020June",
  "2020_07": "2020July",
  "2020_08": "2020August",
  "2020_09": "2020September",
  "2020_10": "2020October",
  "2020_11": "2020November",
  "2020_12": "2020December",
  "2021_01": "2021January",
  "2021_02": "2021February",
};

const daysOfMonth = () => {
  var list = [];
  for (var i = 1; i <= 31; i++) {
    var s = i+"";
    while (s.length < 2) s = "0" + s;
    list.push(s);
  }
  return list
};


for (const [key, dir] of Object.entries(f1)) {
  
  consola.info(`Current dir: ${key} - ${dir}`);
  let days = daysOfMonth();
  for (const day of days ) {
    consola.info(day)
    const subDirectory = `${key}_${day}`
    const dirPath = `${prefixComputeCanada}/${dir}/${subDirectory}/json_files`;
    let command = `ssh maryaam@cedar.computecanada.ca "ls ${dirPath}"`
    let out = shell.exec(command, {silent:true})
    if (out.code != 0){
      consola.error("Could not run command: " + command)
      continue;
    }
    const files = out.stdout.split("\n")
    
    if (files.length < 2){
      consola.warn("No files in " + dirPath)
      continue;
    }
    const outPath = path.join(process.cwd(), "jsons" , dir, subDirectory);
    shell.mkdir('-p', outPath);

    let command2 = `scp -r maryaam@cedar.computecanada.ca:${dirPath}/* ${outPath}/`
    let out2 = shell.exec(command2, {silent:false})
    if (out2.code != 0){
      consola.error("Could not run command: " + command2)
    }
  }
}
