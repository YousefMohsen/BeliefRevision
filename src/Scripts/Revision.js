const tools = require("./Tools/Tools");
const Constants = require('./Tools/Constants');
const nodeTypes = Constants.nodeTypes;
const connectives =  Constants.connectives;
class RevisionHelper {
  /**
removes senttencee from a belifeset
*/

  addEntailments(newSentence,beliefSet) {//Cn-function
    //first we check if sentence already is in belifebase
    if (this.inBeliefBase(newSentence, beliefSet)) {
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
    
      beliefSet.forEach(s => {
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
        console.log('in for each',bbSentenceRoot)

        //SR1
        if (bbDisjunctions || bbDisjunctions) {
          //possible SR1
    console.log('in SR1');
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
              console.log('\nin if\n')
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

     console.log('consequences',consequences)
      this.expand(newSentence,beliefSet);
     
      consequences.forEach(c => {
          
        console.log("adding consequence", c[0]);
        if (!this.inBeliefBase(c[0], beliefSet)) {
          // console.log("not on belife base", c[0], c[1]);
          this.updateBeliefBase(c[0], c[1], beliefSet);
        }
      });

  }

  
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
    console.log('expand beliefeSet',beliefeSet)
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
    console.log('maxSubSets',maxSubSets)
    console.log('\MAXSUBSET.lemngyth!',maxSubSets.length)    // return maxSubSets[0]
//TODO: 

     return maxSubSets[0] ? maxSubSets[0] : belifeSet;
  }
  maxSubsets(sentence, belifeSet) {
      console.log('I\nN maxSubsets')
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
    //result.map(r => tools.printBelifeBase(r, "RESULTS"));
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
  /**
   * Returns true if seentencee already is in the belief base. Otherwise false.
   * @param {*} sentence 
   * @param {*} beliefBase 
   */
  inBeliefBase(sentence, beliefBase) {
    let result = false;
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

    beliefBase.some(b => {
      if (b.toSortedString() === formatedInputSentence) {
        result = true;
        return;
      }
    });

    return result;
  }

   updateBeliefBase(stringSentence, origin,beliefBase) {
    //s is the new sentence to add to the belief base
    let parsedSentence = tools.parseSentence(stringSentence, origin);
  
    let isConsistent = this.checkConsistency(
      parsedSentence,
      beliefBase
    );
    //check if consistent with beliefBase
    if (isConsistent) {
      this.addEntailments(parsedSentence, beliefBase);
      //TODO: use revisionHelper.expand
      //  console.log('s',parsedSentence)
    } else {
      //revision
      console.log('consisteent!!',stringSentence)
  
      beliefBase = this.partiallyMeetRevision(parsedSentence, beliefBase);
    }
  }
}

module.exports = new RevisionHelper();
