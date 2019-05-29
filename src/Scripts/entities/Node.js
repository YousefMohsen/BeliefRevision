const Constants = require("../Tools/Constants");
const nodeTypes = Constants.nodeTypes;
class Node {
  // p,q,r
  constructor({ name, parent, type, children }) {
    this.name = name; //name of the variable //e.g. p,q,r
    // this._id = _id; //unique id, (0,1,2,3,4..) ONLY SENTENCES HAVE IDs
    this.parent = parent; //TODO: make nested
    this.children = children ? children : this.calculateChildren();

    try {
      //  this.children = children ? children : this.calculateChildren();
    } catch (error) {
      console.log("error:", error);

      // helper.printBelifeBase(beliefBase);
    }
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

module.exports = Node;
