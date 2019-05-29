const revisionHelper = require("./RevisionEngine");
const tools = require("./Tools/Tools");
/**
 * TO run this file type "node Main.js"
 */
let beliefBase = [];
const input = "¬PVQ\nP\n¬Q";

function run() {
  input
    .trim()
    .split("\n")
    .map(s => {
      revisionHelper.updateBeliefBase(s, [], beliefBase);
    });
}
run();
tools.printBelifeBase(beliefBase);
var fs = require("fs");
function writeToJSON(data) {
  //console.log("data", data);
  fs.writeFile(
    "./mainOutput.json",

    JSON.stringify(data),
    { flag: "w" },
    function(err) {
      if (err) {
        console.log(err);
      }
      console.log("File Saved!");
    }
  );
}
let jsonfy = [...beliefBase];
writeToJSON(jsonfy);
