/*const tools = require("./Tools/Tools");
const Constants = require("./Tools/Constants");*/
import Tools from "./Tools/Tools";
import Constants from "./Tools/Constants";

const nodeTypes = Constants.nodeTypes;
const connectives = Constants.connectives;
export default class RevisionHelper {
  /**
removes senttencee from a belifeset
*/

  addEntailments(newSentence, beliefSet) {
    //Cn-function
    //first we check if sentence already is in belifebase
    if (this.inBeliefBase(newSentence, beliefSet)) {
      console.log("in belief base true");
      return;
    }
    let newSentenceRoot = newSentence.syntaxTree;
    let bbSentenceRoot;
    let consequences = []; //string;

    //add consequences
    //SR3
    if (
      newSentenceRoot.children[0] &&
      newSentenceRoot.children[0].name === connectives.CONJUCTION
    ) {
      newSentenceRoot.children[0].children.map(c => {
        let sentenceToPush = [c.name, [newSentenceRoot.name]];

        consequences.push(sentenceToPush);
      });
    }

    beliefSet.forEach(s => {
      bbSentenceRoot = s.syntaxTree;
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

          var index = children.indexOf(Tools.negation(newSentenceRoot.name));
          if (index > -1) {
            //if new sentence is a child of the bb disjunction children(SR1 is possible)
            children.splice(index, 1); //remove compared element from children(since it already exist)
            children.forEach(newConsequence => {
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
        bbSentenceRoot.children[0].children.map((bbChild, i) => {
          //if(negation of child in other sentence children, add other child of this and other child of that intot new sentence)
          newSentenceRoot.children[0].children.map((nsChild, k) => {
            if (Tools.negation(bbChild.name) == nsChild.name) {
              let newConsequence =
                bbSentenceRoot.children[0].children[i === 0 ? 1 : 0].name +
                connectives.DISJUNCTION +
                newSentenceRoot.children[0].children[i === 0 ? 1 : 0].name;
              consequences.push([newConsequence, [bbChild.name, nsChild.name]]);

              // TODO: change origin strings to arrays
            }
          });
        });
      }
    });
    this.expand(newSentence, beliefSet);

    consequences.forEach(c => {
      if (!this.inBeliefBase(c[0], beliefSet)) {
        this.updateBeliefBase(c[0], c[1], beliefSet);
      }
    });
  }

  contract(sentence, beliefeSet) {
    //First remove sentence from belifeSet
    var index = Tools.getIndexByName(sentence, beliefeSet);
    if (index > -1) {
      beliefeSet.splice(index, 1);
      //map belifeSet and remove and cn of sentence
      beliefeSet.forEach(b => {
        let i = b.origin ? b.origin.indexOf(sentence.toString()) : -1;
        if (i > -1) {
          let sentenceIndex = Tools.getIndexByName(b.toString(), beliefeSet); // index in database of a sentence s that is implied by sentence
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
    if (Tools.negation(sOneName) === sTwoName) {
      return true;
    }
    return false;
  }

  partiallyMeetContraction(sentence, belifeSet) {
    let maxSubSets = this.maxSubsets(sentence, belifeSet);
    belifeSet = maxSubSets[0] ? maxSubSets[0] : belifeSet;
    return maxSubSets[0] ? maxSubSets[0] : belifeSet;
  }
  maxSubsets(sentence, belifeSet) {
    let result = [];
    belifeSet.map(belief => {
      if (this.resolution(belief, sentence)) {
        //empty clause
        //(belief)
        this.contract(belief.toString(), belifeSet);
        belief.origin &&
          belief.origin.forEach(o => {
            let newSubset = [...belifeSet];
            this.contract(o, newSubset);
            this.expand(sentence, newSubset);
            result.push(newSubset);
          });
      }
    });
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
      return false;
    }
  }
  /**
   * Returns true if seentencee already is in the belief base. Otherwise false.
   * @param {*} sentence
   * @param {*} beliefBase
   */
  inBeliefBase(sentence, beliefBase) {
    let result = false;
    let parsedSentence =
      typeof sentence === "string" ? Tools.parseSentence(sentence) : sentence;
    let formatedInputSentence = "";
    if (parsedSentence.syntaxTree.nodeType === nodeTypes.FORMULA) {
      let sentenceChildren =
        parsedSentence.syntaxTree.children.length > 0
          ? parsedSentence.syntaxTree.children[0].children.map(c => c.name)
          : [];

      formatedInputSentence = sentenceChildren.sort().toString();
    } else {
      formatedInputSentence = parsedSentence.syntaxTree.name;
    }

    beliefBase.some(b => {
      if (b.toSortedString() === formatedInputSentence) {
        result = true;
        return;
      }
    });

    return result;
  }

  updateBeliefBase(stringSentence, origin, beliefBase) {
    // parse sttring into a syntactic treee( Sentence object)
    let parsedSentence = Tools.parseSentence(stringSentence, origin);

    //check if the sentence is consistent with the belief base
    let isConsistent = this.checkConsistency(parsedSentence, beliefBase);

    // if sentence is consistent add entailments
    // and the sentence itself to the belief base
    if (isConsistent) {
      this.addEntailments(parsedSentence, beliefBase);
    }
    // else if the sentence is NOT consistent with the beliefbase,
    // perform a partially meeet contraction
    else {
      beliefBase = this.partiallyMeetContraction(parsedSentence, beliefBase);
    }
    return beliefBase;
  }
}

//module.exports = new RevisionHelper();
