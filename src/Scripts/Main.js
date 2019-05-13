const parser = require("./InputParser");
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
const input = "PΛQ";
///"(AVB)Λ(CVD)VF"//"(AVB)Λ(CVD)VFVGΛH"; //"(AVB)Λ(DVE)ΛCVFVYVØΛWV(HVL)Λ(SVT)VP"; // "qV(pΛr)";
//TODO: parsing issue. Can't parse "(QΛS)VS\n" + "¬(QΛS)VR";
let testCount = 0;

function negation(A) {
  //¬
  return A.includes("¬") ? A.replace("¬", "") : "¬" + A;
}
class Node {
  // p,q,r
  constructor({ name, parent, type, children }) {
    this.name = name; //name of the variable //e.g. p,q,r
    // this._id = _id; //unique id, (0,1,2,3,4..) ONLY SENTENCES HAVE IDs
    this.parent = parent; //TODO: make nested
    this.children = children ? children : this.calculateChildren();
    this.nodeType = type ? type : this.getNodeType();
    // console.log("new node", this.nodeType);
    this.variableValue = this.getValue();
  }
  getValue() {
    if (this.nodeType === nodeTypes.VARIABLE) {
      return !this.name.includes("¬");
    } else if (this.nodeType === nodeTypes.CONNECTIVE) {
      return !this.name.includes("¬");
    }
  }

  parseToStrings(input, containsConjuction = false) {
    let childrenStrings = [];
    let currentChildString = "";
    let isMakingString = false;
    let isConuctionString = false;

    let nameToArray = [];
    //console.log('input',input)

    /*   if (Array.isArray(input) && containsConjuction) {
      //  console.log('IS ARRAY')
      
        input.map((el,index)=>{
            if(input[index]==='Λ' ){
                childrenStrings.push( '('+input[index-1]+')')
                childrenStrings.push( '('+input[index+1]+')')

            }
        else if(!input[index-1]==='Λ' &&!input[index+1]==='Λ'){
            if(el==='Λ'){
                containsConjuction
            }
            childrenStrings.push(el)
        }
        })

  } else {*/
    // console.log('input',input)
    nameToArray = [...input];
    //console.log('nameToArray',nameToArray)

    nameToArray.forEach((c, index) => {
      // if(index===)
      if (!c.includes(")") && !c.includes("(")) {
        if (isMakingString) {
          currentChildString += c;
        } else if (isConuctionString && nameToArray.length > 3) {
          //  console.log('isConuctionString',c)
          currentChildString += c;
        } else if (!(nameToArray[index + 1] || "").includes("Λ")) {
          //if next char is NOT Λ
          //  console.log("43 push", c);
          if (c === "Λ") {
            containsConjuction = true;
          }
          if (!c.includes("¬")) {
            childrenStrings.push(nameToArray[index - 1] === "¬" ? "¬" + c : c);
          }
        } else {
          isConuctionString = true;
          currentChildString += c;
          /*
            nameToArray[index+1] = c+nameToArray[index+1];
            isMakingString = false;
            childrenStrings.push(currentChildString);
            currentChildString = "";*/
        }
      } else if (c.includes("(")) {
        isMakingString = true;
      } else if (c.includes(")")) {
        isMakingString = false;
        //     console.log('61 push',currentChildString)

        childrenStrings.push(currentChildString);
        currentChildString = "";
      }
      if (
        isConuctionString &&
        !(nameToArray[index + 1] || "").includes("Λ") &&
        !c.includes("Λ") &&
        !c.includes("¬")
      ) {
        //   console.log("68 push", currentChildString);
        // currentChildString += c;

        childrenStrings.push(currentChildString);
        currentChildString = "";
        isConuctionString = false;
      }
    });
    //}
    //    console.log("currentChildString", currentChildString);
    //console.log('containsCOnjuction',containsConjuction)
    // return containsConjuction ? this.parseToStrings(childrenStrings,containsConjuction) : childrenStrings;
    return childrenStrings;
  }
  calculateChildren() {
    let childNodes = [];
    let result = [];
    let name = this.name;
    // console.log("name", name);
    if (
      !name.includes(["Λ"]) &&
      !name.includes(["V"]) &&
      (name.length === 1 || (name.length == 2 && name.includes("¬")))
    ) {
      this.nodeType = nodeTypes.VARIABLE;
      //  console.log("in variable");
      return [];
    } else {
      // "(AVB)Λ(DVE)ΛC"

      let childrenStrings = this.parseToStrings(this.name);
      //   console.log('childrenStrings',childrenStrings)
      let branches = [];
      let branch = { connective: null, children: [] };
      childrenStrings.forEach(str => {
        if (str === "V" || str === "Λ") {
          if (branch.connective && branch.connective != str) {
            branches.push(branch);
            branch = { connective: str, children: [] };
            // add and reset
          } else {
            // console.log('in else 146',str)

            // console.log("");
            branch.connective = str;
          }
        } else {
          //console.log('in else 150',str)
          if (!branch.connective) {
            branch.connective = str.includes("Λ") && str.length > 1 ? "Λ" : "V";
          }
          branch.children.push(str);
        }
      });
      if (branch.children.length > 0) {
        branches.push(branch);
      }

      let sortedBranches = {
        connective: branches[0].connective || "V",
        children: []
      };
      // console.log("branches", branches);
      branches.map(b => {
        // console.log('branch',b)

        if (b.connective === "Λ") {
          ///if()
          /*  if(branches.length <=1){

    
          let connectiveString = "";
          b.children.forEach((c, index) => {
            if (index === 0) {
              connectiveString += "(" + c + ")";
            } else {
              connectiveString += "Λ(" + c + ")";
            }
          });
          //   console.log('connectiveString',connectiveString)
          sortedBranches.children.push(connectiveString);
        }else{*/

          sortedBranches.children.push(b);

          //        }
        } else {
          //if V
          sortedBranches.children.push(b);
        }
      });
      testCount++;
      //console.log("sortedBranches", sortedBranches);

      sortedBranches.children.forEach(child => {
        //console.log('sortedBranches child',child)
        if (child.connective) {
          //console.log('connective.child',child)

          child.children.forEach(c => {
            childNodes.push(new Node({ name: c, parent: child }));
          });
        } else {
          console.log("in else");

          childNodes.push(new Node({ name: child.children, parent: this }));
        }
      });

      result.push(
        new Node({
          name: sortedBranches.connective,
          children: childNodes,
          type: nodeTypes.CONNECTIVE
        })
      );
    }
    this.nodeType = nodeTypes.FORMULA;

    return result;
    //return childNodes;
  }

  getNodeType() {
    if (this.nodeType) {
      return this.nodeType;
    }
  }
}
class Sentence {
  //syntaxTree
  constructor(inputString, origin) {
    this.syntaxTree = this.constructSyntaxTree(inputString); //
    this.origin = origin; //Array of other sentences that the sentence is a conswquence of. Empty array if userinput is origin.
  }
  constructSyntaxTree(inputString) {
    return new SyntaxTree(inputString);
  }
  toString() {
    return this.syntaxTree.root.name;
  }
}
class SyntaxTree {
  //syntaxTree
  constructor(inputString) {
    this.root = new Node({
      name: inputString,
      // _id: 0,
      parent: null
    });
  }
}

function checkIfPersistent(parsedSentence) {
  //compare with belife bases
  return true;
}

/**
 * this method adds newSentence and its entailments to a beliefBase
 * @param {*} beliefBase
 * @param {*} newSentence
 */
function addSentence(beliefBase, newSentence) {
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
      //   console.log('c',c)
      let sentenceToPush = [c.name, [newSentenceRoot.name]];
      console.log("sentenceToPush", sentenceToPush);
      console.log("inSyntaxTree", inBeliefBase(sentenceToPush));
      consequences.push(sentenceToPush);
    });
  }
  beliefBase.forEach(s => {
    bbSentenceRoot = s.syntaxTree.root;
    //  console.log('s.syntaxTree.root',s.syntaxTree.root)
    let isDisjunctions =
      bbSentenceRoot &&
      bbSentenceRoot.children[0] &&
      bbSentenceRoot.children[0].name === connectives.DISJUNCTION &&
      newSentenceRoot &&
      newSentenceRoot.children[0] &&
      newSentenceRoot.children[0].name === connectives.DISJUNCTION; // both sentence have a disjunction

    //SR1
    //SR2

    //SR4
    if (
      bbSentenceRoot.nodeType === nodeTypes.VARIABLE &&
      newSentenceRoot.nodeType === nodeTypes.VARIABLE
    ) {
      let newConsequence =
        bbSentenceRoot.name + connectives.CONJUCTION + newSentenceRoot.name;
      consequences.push([
        newConsequence,
        [newSentenceRoot.name, bbSentenceRoot.name]
      ]);
    }
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
          if (negation(bbChild.name) == nsChild.name) {
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
  beliefBase.push(newSentence);
  consequences.forEach(c => {
    console.log("adding consequence", c[0]);
    if (!inBeliefBase(c[0])) {
      updateBeliefBase(c[0], c[1]);
    }
  });
}
function parseSentence(inputString, origin) {
  return new Sentence(inputString, origin);
}
function inBeliefBase(sentence) {
  //checks if a sentence already is in the belifbase
  let result = false;
  beliefBase.forEach(b => {
    console.log("b.toString()", b.toString());
    if (b.toString() === sentence) {
      console.log("IN BELIFEBASE TRUE!");
      result = true;
      return;
    }
  });
  console.log("\nRESULT\n", result);
  return result;
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
  let isPersistent = false;
  //s is the new sentence to add to the belief base
  let parsedSentence = parseSentence(stringS, origin);

  isPersistent = checkIfPersistent(parsedSentence);
  //check if consistent with beliefBase
  if (isPersistent) {
    addSentence(beliefBase, parsedSentence);
    //  console.log('s',parsedSentence)
  }
}
run();
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
