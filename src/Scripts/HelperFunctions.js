class Helper {
  printBelifeBase(beliefBase) {
    console.log(
      "\nPrinting belife set" + " (" + beliefBase.length + " elements):"
    );
    beliefBase.map(b => {
      console.log(b.toString());
    });
  }
  printSentencee(sentence) {
    console.log("Printing seentence:", sentence.syntaxTree.root.name);
  }
}
module.exports = new Helper();
