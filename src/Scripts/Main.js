const parser = require("./InputParser");
const revisionHelper = require("./Revision");
const tools = require("./Tools/Tools");
//const Node = require('./Node');

let beliefBase = []; //new Set();

const connectives = {
  CONJUCTION: "Λ",
  DISJUNCTION: "V",
  NEGATION: "¬",
  IMPLICATION: "->",
  BICONDITION: "<->"
};
nodeTypes = {
  FORMULA: "FORMULA",
  CONNECTIVE: "CONNECTIVE", // V,Λ
  VARIABLE: "VARIABLE" //p,q,¬r
};
const input = "¬PVQ\nP";

//"P\nR\n¬PVR\nZ\n¬ZVR\n¬PVZVR\n¬R"; //"(AVB)Λ(CVD)VF";
///"(AVB)Λ(CVD)VF"//"(AVB)Λ(CVD)VFVGΛH"; //"(AVB)Λ(DVE)ΛCVFVYVØΛWV(HVL)Λ(SVT)VP"; // "qV(pΛr)";
//TODO: parsing issue. Can't parse "(QΛS)VS\n" + "¬(QΛS)VR";

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
//revisionHelper.contract('P',beliefBase)
//tools.printBelifeBase(beliefBase,'after');

//console.log("¬P",revisionHelper.checkConsistency(tools.parseSentence("¬P", null), beliefBase));
//console.log("P",revisionHelper.checkConsistency(toolskv.parseSentence("P", null), beliefBase));

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
//console.log('parsedSentence',parsedSentence)

/*TODO: 
We know that A -> B is equal to !A V B, which is equal to !B->!A
// so if we also have A , we can derive B. Or if we have !B we can derive !A

*/

//module.exports = Node;//TODO:move to sepeerate file
