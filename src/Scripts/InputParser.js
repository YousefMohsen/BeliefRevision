class InputParser {


    parse(input){
console.log('input: ',input)
    }

    implication(A, B) {//->

        //return !A || B;
        if (A) {
            return B;
        } else {
            /* if A is false, the implication is true */
            return true;
        }
    }
    negation(A) {//¬
        return !A;
    }
    conjuction(A, B) {
        return A && B
    }//Λ
    disjunction(A, B) {
        return A || B;
    } //V

    bicondition(A, B) {
        return !!A === !!B;
    }
    truthTableTest() {
        const truthTable = [{ A: true, B: true }, { A: true, B: false }, { A: false, B: true }, { A: false, B: false }]

        truthTable.map((values) => {
            console.log('negation(A): ', this.negation(values.A))
        })

        truthTable.map((values) => {
            console.log('conjuction(A,b): ', this.conjuction(values.A, values.B))
        })

        truthTable.map((values) => {
            console.log('disjunction(A,b): ', this.disjunction(values.A, values.B))
        })

        truthTable.map((values) => {
            console.log('Implecation(A,b): ', this.implication(values.A, values.B))
        })

        truthTable.map((values) => {
            console.log('bicondition(A,b): ', this.bicondition(values.A, values.B))
        })


    }
    parseBeliefNegation(belief){
return belief.includes("¬") ? this.negation(belief.replace("¬", "")) :belief;
//return belief.includes("¬") ? false:true;
    }

    getValue(belief){

return belief.includes("¬") ? false:true;

    }
  /*  parseConnective(c){
        switch(c){
            case this.connectives.CONJUCTION :
            return this.conjuction
            case this.connectives.DISJUNCTION:
            return this.disjunction  
            default:
            return ()=>c;
        }
    }*/
}
InputParser.connectives = {
    CONJUCTION: "Λ",
    DISJUNCTION: "V",
    NEGATION: "¬",
    IMPLICATION: "->",
    BICONDITION: "<->"
  };
module.exports = new InputParser();


//truthTable();
