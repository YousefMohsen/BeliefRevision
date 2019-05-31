const connectives = {
  CONJUCTION: "Λ",
  DISJUNCTION: "V",
  NEGATION: "¬",
  IMPLICATION: "->",
  BICONDITION: "<->"
};
const nodeTypes = {
  FORMULA: "FORMULA",
  CONNECTIVE: "CONNECTIVE", // V,Λ
  VARIABLE: "VARIABLE" //p,q,¬r
};
const Constants = {
  connectives,
  nodeTypes
};
//module.exports = Constants;
export default Constants;