/*

*/

//Creamos un número aleatorio entre 1 y 650, lo guardamos
//en una constante llamada randomize que reutilizaremos en todo
//el código
const randomize = Math.floor(Math.random() * 650) + 1;

//Función que hace una petición a la API de pokémon para recibir
//los datos generales de un pokémon en específico.
const getPokedata = async () => {
  try {
    const pokemonDataRaw = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${randomize}`
    );
    const pokeData = await pokemonDataRaw.json();
    const species = await fetch(pokeData.species.url);
    const speciesData = await species.json();
    const habitat = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${pokeData.name}/`
    );
    const habitatData = await habitat.json();
    console.log(pokeData);
    return { pokeData, speciesData, habitatData };
  } catch (error) {
    console.log(error);
  }
};

const showPokemon = () => {
  const h1 = document.querySelector(".pokemon-name");
  const typesCont = document.querySelector("#types");
  getPokedata().then(({ pokeData, speciesData, habitatData }) => {
    h1.innerHTML = pokeData.name;
    pokeImg(pokeData);
    pokeDescription(speciesData);
    pokeWeight(pokeData);
    pokeHeight(pokeData);
    pokeHabitat(habitatData);
    pokemonEggGroup(speciesData);
    const type = () => {
      const types = pokeData.types;
      types.forEach((type) => {
        const p = document.createElement("p");
        p.innerHTML = type.type.name;
        typesCont.append(p);
      });
    };
    type();
  });
};

const pokeText = (pokeData) => {};

//Función que recibe los datos del pokémon y muestra la imagen del Pokémon
//en la columna central.
const pokeImg = (pokeData) => {
  const pokemonImg = pokeData.sprites.other["official-artwork"].front_default;
  const image = document.querySelector(".random-image");
  image.src = pokemonImg;
};

const pokeDescription = (speciesData) => {
  const flavorTexts = [];
  for (let texts of speciesData.flavor_text_entries) {
    if (texts.language.name === "es") {
      flavorTexts.push(texts.flavor_text);
    }
  }
  //Ahora con el tamaño del array, añadimos la entrada de la Pokedex de
  //manera aleatoria y la mostramos por DOM.
  const random = Math.floor(Math.random() * flavorTexts.length);
  const p = document.querySelector(".flavor-text");
  p.innerHTML = flavorTexts[random];
};

const pokeWeight = (pokeData) => {
  const weight = pokeData.weight;
  const weightKg = weight / 10;
  const p = document.querySelector(".weight > p");
  p.innerHTML = weightKg + " kg";
};

const pokeHeight = (pokeData) => {
  const height = pokeData.height;
  const heightM = height / 10;
  const p = document.querySelector(".height > p");
  p.innerHTML = heightM + " m";
};

const pokeHabitat = (habitatData) => {
  const p = document.querySelector(".habitat > p");
  const habitat = habitatData.habitat;
  const habitatUrl = async () => {
    if (habitat && habitat.url) {
      const resp = await fetch(habitat.url);
      const habitatData = await resp.json();
      return habitatData;
    } else {
      return null;
    }
  };
  habitatUrl().then((habitatData) => {
    if (habitatData) {
      for (let nameP of habitatData.names) {
        if (nameP.language.name === "es") {
          p.innerHTML = nameP.name;
        }
      }
    } else {
      p.innerHTML = "desconocido";
    }
  });
};

const pokemonEggGroup = async (speciesData) => {
  const p = document.querySelector(".egg-group > p");
  const eggGroup = speciesData.egg_groups;
  const eggGroups = async () => {
    for (let egg of eggGroup) {
      const resp = await fetch(egg.url);
      const eggData = await resp.json();
      for (let nameP of eggData.names) {
        if (nameP.language.name === "es") {
          const span = document.createElement("span");
          span.innerHTML = nameP.name;
          p.appendChild(span);
        }
      }
    }
  };
  await eggGroups();
};

showPokemon();
