const Genetic = require("genode");

function generateRandomString(length) {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ ';
    let result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

const Sentence = (dna) => {

    const fitness = (ref) => {
        let simili = 0;

        for(let i = 0; i < ref.length; i++)
        {
            if(dna[i] === ref[i]) simili ++;
        }

        return (simili/ref.length) + 0.01;
    }

    const crossOver = (individual, mutation) =>{

        const dna2 = individual.dna;

        let newDna = "";

        for(let indx = 0; indx < dna.length; indx++)
        {
            if(Math.random() <= mutation) // si mutation random string de length 1
            {
                newDna += generateRandomString(1);
            }
            
            else
            {
                if(Math.random() <= 0.5){
                    newDna += dna[indx];
                }
                else{
                    newDna += dna2[indx];
                }
            }
        }

        return Sentence(newDna);
    }

    return {
        dna:dna,
        fitness:fitness,
        crossOver:crossOver
    }
}

const ref = "to be or not to be";

let population = new Array(200);
population.fill(0);
population = population.map(indiv => Sentence(generateRandomString(ref.length)));

const evol = Genetic(population, ref, 0.01);

for(let i = 0; i< 100; i++)
{
    evol.cycle();
    console.log(`generation: ${evol.getGeneration()}\tbest fit: ${evol.getBestFit().dna}`);
}
