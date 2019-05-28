const tools = require("./Tools/Tools");

class RevisionHelper {
  /**
removes senttencee from a belifeset
*/
  addBeelief() {}
  contract(sentence, beliefeSet) {
    //First remove sentence from belifeSet
    var index = tools.getIndexByName(sentence, beliefeSet);
    if (index > -1) {
      console.log("removing ", sentence.toString());
      beliefeSet.splice(index, 1);
      //map belifeSet and remove and cn of sentence
      beliefeSet.forEach(b => {
        let i = b.origin ? b.origin.indexOf(sentence.toString()) : -1;
        if (i > -1) {
          // tools.printSentencee(b, "FOUND origin"+b.origin[i]);
          let sentenceIndex = tools.getIndexByName(b.toString(), beliefeSet); // index in database of a sentence s that is implied by sentence
          if (sentenceIndex > -1) {
            this.contract(b.toString(), beliefeSet);
          }
        }
      });
    }
  }

  expand(sentence, beliefeSet) {
    beliefeSet.push(sentence);
  }

  /**
   * Return true if result of resolution is an empty clause. Else returns false.
   * @param Sentence sOne
   * @param Sentence sTwo
   */
  resolution(sOne, sTwo) {
    let sOneName = sOne.toString();
    let sTwoName = sTwo.toString();
    if (tools.negation(sOneName) === sTwoName) {
      return true;
    }
    return false;
  }

  partiallyMeetRevision(sentence, belifeSet) {
    let maxSubSets = this.maxSubsets(sentence, belifeSet);
    belifeSet = maxSubSets[0] || belifeSet;
    // return maxSubSets[0]
  }
  maxSubsets(sentence, belifeSet) {
    let result = [];
    belifeSet.map(belief => {
      if (this.resolution(belief, sentence)) {
        //empty clause
        //(belief);
        this.contract(belief.toString(), belifeSet);
        belief.origin &&
          belief.origin.forEach(o => {
            console.log("o", o);
            let newSubset = [...belifeSet];
            //tools.printBelifeBase(belifeSet, "RESULTS:before contract")
            this.contract(o, newSubset);
            this.expand(sentence, newSubset);
            result.push(newSubset);
          });
        // belief.origin && belief.origin.map(o => conflictsOrigin.push(o));
      }
    });
    /*
    // tools.printBelifeBase(conflicts, "conflicts");
    // tools.printBelifeBase(conflictsOrigin, "conflictsOrigin");
    let set = [];
    conflicts.forEach(c => {
      // remove c and all what it implies and what it implies
      // remo
      set = [...belifeSet];
      tools.printBelifeBase(set, "set");
*/
    /*  belief.origin && belief.origin.map(o => {
            conflictsOrigin.push(o)
        });
    });*/
    result.map(r => tools.printBelifeBase(r, "RESULTS"));
    return result;
  }
  /**
   *  Checks if sentence is consistent with beliefbase
   *  by performing resolution on all clausees.
   * Returns true if the new belief is consistent with the beliefset.
   * @param {must be parsd in a Sentence object} sentence
   * @param {*} belifeSet
   */
  checkConsistency(sentence, belifeSet) {
    try {
      for (let i = 0; i < belifeSet.length; i++) {
        const ielement = belifeSet[i];
        let isEemptyClause = this.resolution(sentence, ielement);
        if (isEemptyClause) {
          throw "empty clause";
        }
      }
      return true;
    } catch (error) {
      // console.log("er", error);
      return false;
    }
  }
  inBeliefBase(sentence, beliefBase) {
    let parsedSentence =
      typeof sentence === "string" ? tools.parseSentence(sentence) : sentence;

    let formatedInputSentence = "";
    if (parsedSentence.syntaxTree.root.nodeType === nodeTypes.FORMULA) {
      let sentenceChildren =
        parsedSentence.syntaxTree.root.children.length > 0
          ? parsedSentence.syntaxTree.root.children[0].children.map(c => c.name)
          : [];

      formatedInputSentence = sentenceChildren.sort().toString();
    } else {
      formatedInputSentence = parsedSentence.syntaxTree.root.name;
    }

    let result = false;
    beliefBase.some(b => {
      if (b.toSortedString() === formatedInputSentence) {
        result = true;
        return;
      }
    });

    return result;
  }
}

module.exports = new RevisionHelper();
