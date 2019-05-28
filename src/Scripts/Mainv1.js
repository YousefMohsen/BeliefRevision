//const InputParser = require('./InputParser');
const connectives = {
  CONJUCTION: "Λ",
  DISJUNCTION: "V",
  NEGATION: "¬",
  IMPLICATION: "->",
  BICONDITION: "<->"
};
const parser = require("./InputParser");
let id = 0;
let beliefBase = [
  {
    _id: 0,
    origin: null,
    parsed: ["¬p", "Λ", "¬q"],
    raw: "p Λ q"
  }

  /**
   {
    _id:1,
    origin: 0,
    parsed: ["q"],
    raw: "q"
  },
     {
    _id:2,
    origin: 0,
    parsed: ["p"],
    raw: "p"
  }
   */
];

const input = '';

/*
function addBelief(belief) {
  //expansion
  //check if belief is in conflict with belief base
  //
}*/
function conjuctionCN(belief) {}

class Belief {
  constructor(sentence) {
    this.name = sentence.name;
    (this._id = sentence._id),
      (this.origin = sentence.origin),
      (this.parsed = sentence.parsed),
      (this.raw = sentence.raw),
      (this.value =
        sentence.raw.length <= 2 ? parser.getValue(sentence.raw) : 0);
    console.log("new belif ", this);
  }
}

function newBelif(belief, origin) {
  id++;
  return new Belief({
    _id: id,
    origin: origin,
    parsed: [belief],
    raw: belief
  });
}
function Cn(beliefBase) {
  //["p","Λ","q"]
  //return a list of logical entailments
  let conseqences = [];
  beliefBase.map(belief => {
    if (belief.parsed.length === 1) {
    }
    if (belief.parsed.length === 3) {
      let p = parser.parseBeliefNegation(belief.parsed[0]);
      let q = parser.parseBeliefNegation(belief.parsed[2]);

      let connective = belief.parsed[1];

      console.log("parsed p", p);
      console.log("parsed q", q);
      console.log("parsed connective", connective);

      switch (connective) {
        case connectives.CONJUCTION:
          console.log(" case connectives.CONJUCTION, 57", belief);
          if (p === q) {
            conseqences.push(newBelif(p, belief._id));
            conseqences.push(newBelif(q, belief._id));
          }

          break;

        default:
          break;
      }
    }
  });
  conseqences = conseqences || []; //checck if undefiend

  return [...beliefBase, ...conseqences];
}
console.log("before cn", beliefBase);
let result = Cn(beliefBase);

result.map(re => {
  console.log("\nre", re);
});

//console.log("Cn(bb) result", result);
//contraction
//revision

//parser.parse();

/**
 * class Variable {
    constructor(){
        name='',
        parsedValue=''
    }
}
 */
