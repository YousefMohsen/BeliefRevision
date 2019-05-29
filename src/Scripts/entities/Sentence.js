const Node = require("./Node");
class Sentence {
  //syntaxTree
  constructor(inputString, origin) {
    this.syntaxTree = this.constructSyntaxTree(inputString); //
    this.origin = origin; //Array of other sentences that the sentence is a conswquence of. Empty array if userinput is origin.
  }
  constructSyntaxTree(inputString) {
    return new Node({
      name: inputString,
      parent: null,
      epestimicOrder: 0
    });
  }
  toString() {
    return this.syntaxTree.name;
  }
  toSortedString() {
    return this.syntaxTree.children.length === 1
      ? this.syntaxTree.children[0].children
          .map(c => c.name)
          .sort()
          .toString()
      : this.toString();
  }
}
module.exports = Sentence;
