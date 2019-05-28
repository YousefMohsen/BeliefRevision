const Sentence = require("../entities/Sentence");
class Tools {
  printBelifeBase(beliefBase, st) {
    console.log("\n");
    st && console.log(st);
    console.log(
      "-Printing belife set" + " (" + beliefBase.length + " elements):"
    );
    beliefBase.map(b => {
      console.log(b.toString());
    });
  }
  printSentencee(sentence,st) {
    console.log("\n");
    st && console.log(st);
    console.log("Printing seentence:", sentence.syntaxTree.root.name);
  }
  negation(A) {
    //¬
    if (A.length <= 2) {
      return A.includes("¬") ? A.replace("¬", "") : "¬" + A;
    }
    return A;
  }

  parseSentence(inputString, origin) {
    return new Sentence(inputString, origin);
  }

  getIndexByName(stringName, beliefBase) {
    for (let index = 0; index < beliefBase.length; index++) {
      const element = beliefBase[index];
      if (stringName === element.toString()) {
        return index;
      }
    }
    return -1;
  }
}
module.exports = new Tools();
