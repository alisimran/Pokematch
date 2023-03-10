const pokeAPIBaseUrl = "https://pokeapi.co/api/v2/pokemon/"
const game = document.getElementById("game");
const match = document.getElementById("match");
let isPaused = false;
let firstPick;
let matches;  

const colors = {
	fire: '#FDDFDF',
	grass: '#DEFDE0',
	electric: '#FCF7DE',
	water: '#DEF3FD',
	ground: '#f4e7da',
	rock: '#d5d5d4',
	fairy: '#fceaff',
	poison: '#98d7a5',
	bug: '#f8d5a3',
	dragon: '#97b3e6',
	psychic: '#eaeda1',
	flying: '#F5F5F5',
	fighting: '#E6E0D4',
	normal: '#F5F5F5'
};


const loadPokemon = async () => {
    const randomIds = new Set();
    while(randomIds.size < 8){
        const randomNumber = Math.ceil(Math.random() * 150);
        randomIds.add(randomNumber);
    }
    // const randomIdsArr = [...randomIds];
    // console.log(randomIdsArr);
    const pokePromises = [...randomIds].map(id => fetch(pokeAPIBaseUrl + id))
    const responses = await Promise.all(pokePromises);

    // for(let i = 0; i < randomIdsArr.length ; i++){
        // const res = await ;
    return await Promise.all(responses.map(res => res.json()));
    
    // const pokemon = await res.json();
    
    
}

const displayPokemon = (pokemon) => {
    
    pokemon.sort(_ => Math.random() - 0.5);
    const pokemonHTML = pokemon.map(pokemon => {
        const type = pokemon.types[0]?.type?.name || 'normal';
        const color = colors[type];
        return `
            <div class="card"  style="background-color: ${color}" onclick="clickCard(event)"
            data-pokename="${pokemon.name}">
                <div class="front"></div>
                <div class="back rotated" style="background-color: ${color}">
                
                    <img src="${pokemon.sprites.front_default}" alt=${pokemon.name}/>
                    <h3>${pokemon.name}</h3>
                </div>
            </div>
        `
    }).join('');
    game.innerHTML = pokemonHTML;
}

const clickCard = (event) => {
    const pokemonCard = event.currentTarget;
    const [front, back] = getFrontAndBackFromCard(pokemonCard);
    if(front.classList.contains("rotated") || isPaused) return;
    isPaused = true;
    rotateElements([front, back]);
    if(!firstPick){
        firstPick = pokemonCard;
        isPaused = false;
    }
    else{
        const secondPokemonName = pokemonCard.dataset.pokename;
        const firstPokemonName = firstPick.dataset.pokename;
        if(firstPokemonName != secondPokemonName){
            const [firstFront, firstBack] = getFrontAndBackFromCard(firstPick);
            setTimeout(() => {
                rotateElements([front, back, firstFront, firstBack]);
                firstPick = null;
                isPaused = false;
            }, 500)
           
        }
        else{
            matches++;
            if(matches === 8){
                console.log("winner");
                
            }
            firstPick = null;
            isPaused = false;
            match.innerText = `Matches: ${matches}`;
        }
    }
    
}

const rotateElements = (elements) => {
    if(typeof elements !== 'object' || !elements.length ) return;
    elements.forEach(element => element.classList.toggle('rotated'));
}

const getFrontAndBackFromCard = (card) =>{
    const front = card.querySelector(".front");
    const back = card.querySelector(".back");
    return [front, back];
}

const resetGame = () => {
    
    game.innerHTML = '';
    isPaused = false;
    matches = 0;
    firstPick = null;
    setTimeout(async () => {
        const pokemon = await loadPokemon();
        displayPokemon([...pokemon, ...pokemon]);
        match.innerText = `Matches: ${matches}`;
    }, 100)
}

resetGame();
