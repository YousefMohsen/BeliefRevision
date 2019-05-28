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
const input = "¬PVG\nP\nS\n¬G"; //"(AVB)Λ(CVD)VF";
///"(AVB)Λ(CVD)VF"//"(AVB)Λ(CVD)VFVGΛH"; //"(AVB)Λ(DVE)ΛCVFVYVØΛWV(HVL)Λ(SVT)VP"; // "qV(pΛr)";
//TODO: parsing issue. Can't parse "(QΛS)VS\n" + "¬(QΛS)VR";
let testCount = 0;

function checkIfPersistent(parsedSentence) {
  //compare with belife bases
  return true;
}

/** TODO: move tto Revision class or seperate belife base class.
 * this method adds newSentence and its entailments to a beliefBase
 * @param {*} bb
 * @param {*} newSentence
 */
function addSentence(newSentence, bb) {
  if (revisionHelper.inBeliefBase(newSentence, bb)) {
    console.log("in belief base true");
    return;
  }
  let newSentenceRoot = newSentence.syntaxTree.root;
  let bbSentenceRoot;
  let consequences = []; //string;
  //add consequences
  //SR3
  if (
    newSentenceRoot.children[0] &&
    newSentenceRoot.children[0].name === connectives.CONJUCTION
  ) {
    newSentenceRoot.children[0].children.map(c => {
      //   console.log('c',c) [newsentenceString, [origins]];
      let sentenceToPush = [c.name, [newSentenceRoot.name]];
      //console.log("sentenceToPush", sentenceToPush);
      // console.log("inSyntaxTree", inBeliefBase(sentenceToPush));
      consequences.push(sentenceToPush);
    });
  }
  //console.log('newSentence',newSentence)

  bb.forEach(s => {
    bbSentenceRoot = s.syntaxTree.root;
    //  console.log('s.syntaxTree.root',s.syntaxTree.root)
    let bbDisjunctions =
      bbSentenceRoot &&
      bbSentenceRoot.children[0] &&
      bbSentenceRoot.children[0].name === connectives.DISJUNCTION;

    let nsDisjunctions =
      newSentenceRoot &&
      newSentenceRoot.children[0] &&
      newSentenceRoot.children[0].name === connectives.DISJUNCTION;

    let isDisjunctions = bbDisjunctions && nsDisjunctions; // both sentence have a disjunction

    //SR1
    if (bbDisjunctions || bbDisjunctions) {
      //possible SR1

      if (
        nsDisjunctions &&
        bbSentenceRoot &&
        bbSentenceRoot.nodeType === nodeTypes.VARIABLE
      ) {
        //if new sentence is a disunction and n'th beliefbase sentence is a variable
      } else if (
        bbDisjunctions &&
        newSentenceRoot &&
        newSentenceRoot.nodeType === nodeTypes.VARIABLE
      ) {
        //if beliefbase sentence is a disunction and new sentence is a variable
        let children = bbSentenceRoot.children[0].children.map(
          node => node.name
        );

        var index = children.indexOf(tools.negation(newSentenceRoot.name));
        if (index > -1) {
          //if new sentence is a child of the bb disjunction children(SR1 is possible)
          children.splice(index, 1); //remove compared element from children(since it already exist)
          children.forEach(newConsequence => {
            /* console.log("newSentence to PUSH", [
              newConsequence,
              [newSentenceRoot.name, bbSentenceRoot.name]
            ]);*/

            consequences.push([
              newConsequence,
              [newSentenceRoot.name, bbSentenceRoot.name]
            ]);
          });
        }
      }
    }

    //SR2

    //SR4. Can confuse people
    /* if ( 
      bbSentenceRoot.nodeType === nodeTypes.VARIABLE &&
      newSentenceRoot.nodeType === nodeTypes.VARIABLE
    ) {
      let newConsequence =
        bbSentenceRoot.name + connectives.CONJUCTION + newSentenceRoot.name;
      consequences.push([
        newConsequence,
        [newSentenceRoot.name, bbSentenceRoot.name]
      ]);
    }*/
    //SR5
    if (
      isDisjunctions &&
      bbSentenceRoot.children[0].children.length === 2 &&
      newSentenceRoot.children[0].children.length === 2
    ) {
      console.log("is disjunction");

      bbSentenceRoot.children[0].children.map((bbChild, i) => {
        //if(negation of child in other sentence children, add other child of this and other child of that intot new sentence)
        newSentenceRoot.children[0].children.map((nsChild, k) => {
          if (tools.negation(bbChild.name) == nsChild.name) {
            let newConsequence =
              bbSentenceRoot.children[0].children[i === 0 ? 1 : 0].name +
              connectives.DISJUNCTION +
              newSentenceRoot.children[0].children[i === 0 ? 1 : 0].name;
            consequences.push([newConsequence, [bbChild.name, nsChild.name]]);

            //  updateBeliefBase(newConsequence, [bbChild.name,nsChild.name ])// TODO: change origin strings to arrays
          }
        });

        //  console.log('bbchild',bbChild.name);
      });
    }
    //  console.log('newSentence',newSentenceRoot)
  });
  bb.push(newSentence);
  consequences.forEach(c => {
    //console.log("adding consequence", c[0]);
    if (!revisionHelper.inBeliefBase(c[0], bb)) {
      // console.log("not on belife base", c[0], c[1]);
      updateBeliefBase(c[0], c[1]);
    }
  });
}

function run() {
  input
    .trim()
    .split("\n")
    .map(s => {
      updateBeliefBase(s, []);
    });
}
function updateBeliefBase(stringS, origin) {
  //s is the new sentence to add to the belief base
  let parsedSentence = tools.parseSentence(stringS, origin);

  let isConsistent = revisionHelper.checkConsistency(
    parsedSentence,
    beliefBase
  );
  //check if consistent with beliefBase
  if (isConsistent) {
    addSentence(parsedSentence, beliefBase);
    //TODO: use revisionHelper.expand
    //  console.log('s',parsedSentence)
  } else {
    //revision
    revisionHelper.partiallyMeetRevision(parsedSentence, beliefBase);
  }
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
