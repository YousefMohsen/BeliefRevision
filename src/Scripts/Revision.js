const helper = require("./HelperFunctions");

class RevisionHelper {
  /**
removes senttencee from a belifeset
*/

  contract(sentence, beliefeSet) {
    //not tested
    var index = beliefeSet.indexof(sentence);
    children.splice(index, 1);
    return beliefeSet;
  }
  expand(sentence, beliefeSet) {
    beliefeSet.push(sentence);
  }
  revise(sOne, sTwo) {
    let resultingClause = [];
    let sOneChildren =
      sOne.syntaxTree.root.children.length > 0
        ? sOne.syntaxTree.root.children[0].children.map(c => c.name)
        : [sOne.syntaxTree.root.name];

    let sTwoChildren =
      sTwo.syntaxTree.root.children.length > 0
        ? sTwo.syntaxTree.root.children[0].children.map(c => c.name)
        : [sTwo.syntaxTree.root.name];

    /*  sOneChildren.concat()
        let mergedList = [...new Set(test2.concat(test1)) ];*/
    for (let i = 0; i < sOneChildren.length; i++) {
      const sOneChild = sOneChildren[i];
      for (let j = 0; j < sTwoChildren.length; j++) {
        const sTwoChild = sTwoChildren[j];
        if (sOneChild !== sTwoChild) {
          resultingClause.push();
        }
      }
    }
  }

  maxSubsets(sentence, belifeSet) {}
  /**
   *  checks if sentence is consistent with belifbase
   *  by performing resolution on all clausees
   * @param {must be parsd in a Sentence object} sentence
   * @param {*} belifeSet
   */
  checkConsistency(sentence, belifeSet) {
    // do revision betwee

    let possibleBelifeBase = [...belifeSet, sentence];
    //helper.printBelifeBase(possibleBelifeBase)

    //console.log('sentece in check, ',sentence)
    for (let i = 0; i < possibleBelifeBase.length; i++) {
      const ielement = possibleBelifeBase[i];
      helper.printSentencee(ielement, "i");
      for (let j = i; j < possibleBelifeBase.length; j++) {
        helper.printSentencee(ielement, "j");

        const jelement = possibleBelifeBase[j];
        this.revise(jelement, ielement);
      }
    }
  }
}

module.exports = new RevisionHelper();
