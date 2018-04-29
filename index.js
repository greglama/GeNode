/**
 * Object to handle a genetic algorithm
 * @param {object} _population 
 * @param {object} _reference 
 * @param {number} _mutationRate 
 */

const Genetic = (_population, _reference, _mutationRate) => {

    let reference  = _reference;
    let population = _population;
    let mutationRate = _mutationRate;

    const size = population.length;
    let generation = 0;

    let bestFit = null;

    //getter setter ----------------------------
    const getPopulation = () => population;

    const getReference = () => reference;
    const setReference = (value) => reference = value;

    const getSizeOfPopulation = () => size;
    const getGeneration = () => generation;

    const getMutationRate = () => mutationRate;
    const setMutationRate = (value) => {
        value = Math.abs(value)
        if(value > 1) mutationRate = 1;
        else mutationRate = value;
    }

    const getBestFit = () =>{
        if(bestFit === null) throw new Error("You have to cycle at least once to get the best Fit");
        else return bestFit;
    }

    //Methods -------------------------------------

    //return a map-array with cummulative probabilities for each individual
    const getProbaArray = () =>{

        let sum = 0;
        const fitnesses = population.map(individual =>{ 
            const fit = individual.fitness(reference);
            sum += fit;
            return fit;
        });

        let map = new Array();

        for(let i = 0; i < size; i++)
        {
            map.push([population[i], fitnesses[i]/sum]);
        }

        map.sort((a,b) => a[1] - b[1]);

        for(let i = 1; i < size; i++)
        {
            map[i][1] += map[i-1][1];
        }

        return map;
    }
    //randomly pick up an individual in function of its fitness
    const randomPickUpFrom = (probaPop) => {
        const random = Math.random();

        //find a better way to do this with dichotomy
        for(let i = 1; i < size; i++)
        {
            if(probaPop[i][1] > random)
            {
                return probaPop[i-1][0];
            }
        }
    }
    //generate the n+1th generation from the nth generation
    const getNewPop = (probaPop) => {

        const pop = new Array(size);
        for(let i = 0; i < size; i++)
        {
            
            const individual_A = randomPickUpFrom(probaPop);
            const individual_B = randomPickUpFrom(probaPop);
            const newIndividual = individual_A.crossOver(individual_B, mutationRate);

            pop[i] = newIndividual;
        }

        return pop;
    }

    //do a genetic cycle
    const cycle = () => {

        const probaPop = getProbaArray();
        const newPopulation = getNewPop(probaPop);

        population = newPopulation;
        bestFit = getProbaArray()[size-1][0]
        
        generation ++;
    }

    return {
        getPopulation:getPopulation,
        getSizeOfPopulation:getSizeOfPopulation,
        getGeneration:getGeneration,
        getReference:getReference,
        setReference:setReference,
        getMutationRate:getMutationRate,
        setMutationRate:setMutationRate,
        getBestFit:getBestFit,
        cycle:cycle
    }
}

module.exports = Genetic;