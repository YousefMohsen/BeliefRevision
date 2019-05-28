const Node = require('./Node');
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
    toSortedString() {
      return this.syntaxTree.root.children.length === 1
        ? this.syntaxTree.root.children[0].children
            .map(c => c.name)
            .sort()
            .toString()
        : this.toString();
    }
  }
  module.exports = Sentence;