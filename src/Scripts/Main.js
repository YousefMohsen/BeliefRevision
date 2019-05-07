const parser = require("./InputParser");

const connectives = {
  CONJUCTION: "Λ",
  DISJUNCTION: "V",
  NEGATION: "¬",
  IMPLICATION: "->",
  BICONDITION: "<->"
};
nodeTypes = {
  FORMULA: "FORMULA",
  CONNECTIVE: "CONNECTIVE", // V,¬
  VARIABLE: "VARIABLE" //p,q,r
};
const input = "(AVB)Λ(CVD)VFVGΛH"; //"(AVB)Λ(DVE)ΛCVFVYVØΛWV(HVL)Λ(SVT)VP"; // "qV(pΛr)";
let testCount = 0;
class Node {
  // p,q,r
  constructor({ name, parent, type, children }) {
    this.name = name; //name of the variable //e.g. p,q,r
    // this._id = _id; //unique id, (0,1,2,3,4..) ONLY SENTENCES HAVE IDs
    this.parent = { ...parent }; //TODO: make nested
    this.children = children ? children : this.calculateChildren();
    this.nodeType = type ? type : this.getNodeType();
    // console.log("new node", this.nodeType);
  }

  parseToStrings(input, containsConjuction = false) {
    let childrenStrings = [];
    let currentChildString = "";
    let isMakingString = false;
    let isConuctionString = false;

    let nameToArray = [];
    console.log("input", input);

    if (Array.isArray(input) && containsConjuction) {
      console.log("IS ARRAY");
      /*
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
*/
    } else {
      console.log("input", input);
      nameToArray = [...input];

      nameToArray.forEach((c, index) => {
        // if(index===)
        if (!c.includes(")") && !c.includes("(")) {
          if (isMakingString) {
            currentChildString += c;
          } else if (isConuctionString && nameToArray.length > 3) {
            currentChildString += c;
          } else if (!(nameToArray[index + 1] || "").includes("Λ")) {
            //if next char is NOT Λ
            //  console.log("43 push", c);
            if (c === "Λ") {
              containsConjuction = true;
            }
            childrenStrings.push(c);
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
          !c.includes("Λ")
        ) {
          console.log("68 push", currentChildString);
          // currentChildString += c;

          childrenStrings.push("(" + currentChildString + ")");
          currentChildString = "";
          isConuctionString = false;
        }
      });
    }
    //    console.log("currentChildString", currentChildString);
    console.log("containsCOnjuction", containsConjuction);
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
      console.log("childrenStrings", childrenStrings);
      let branches = [];
      let branch = { connective: null, children: [] };
      childrenStrings.forEach(str => {
        if (str === "V" || str === "Λ") {
          if (branch.connective && branch.connective != str) {
            branches.push(branch);
            branch = { connective: str, children: [] };
            // add and reset
          } else {
            // console.log("");
            branch.connective = str;
          }
        } else {
          branch.children.push(str);
        }
      });
      if (branch.children.length > 0) {
        branches.push(branch);
      }

      let sortedBranches = { connective: "V", children: [] };
      console.log("branches", branches);
      branches.map(b => {
        if (b.connective === "Λ") {
          sortedBranches.children.push(b);
        } else {
          //if V
          sortedBranches.children = sortedBranches.children.concat(b.children);
        }
      });
      testCount++;
      //console.log("sortedBranches", sortedBranches);

      sortedBranches.children.forEach(child => {
        //console.log('child',child)

        if (child.connective) {
          child.children.forEach(c => {
            //   let name = child.connective ==='' ? "("+c+")": c;
            //  console.log('name',name)
            let node = new Node({ name: c, parent: child });
            childNodes.push(node);
          });
        } else {
          //console.log("child", child);
          childNodes.push(new Node({ name: child, parent: this }));
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
    this.origin = origin; //_id if sentence is a consequence from another sentence or null if origin user
  }
  constructSyntaxTree(inputString) {
    return new SyntaxTree(inputString);
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

function parseSentence(inputString, origin) {
  return new Sentence(inputString, origin);
}

let parsedSentence = parseSentence(input, null);

var fs = require("fs");
function writeToJSON(data) {
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

writeToJSON(parsedSentence);
//console.log('parsedSentence',parsedSentence)
