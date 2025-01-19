/*
El proyecto se basa en diferentes
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
    return { pokeData, speciesData, habitatData };
  } catch (error) {
    console.log(error);
  }
};

/*
 * CONSTRUCTOR - TODO
 *
 *
 */
const pokemonConstructor = () => {
  getPokedata().then(({ pokeData, speciesData, habitatData }) => {
    pokeTitle(pokeData);
    pokeSprite(pokeData);
    pokeDesc(speciesData);
    pokeWeight(pokeData);
    pokeHeight(pokeData);
    pokeHabitat(habitatData);
    pokemonEggGroup(speciesData);
    pokeShiny(pokeData);
  });
};

const pokeTitle = (pokeData) => {
  const h1 = document.querySelector(".title__pokemon");
  const h2 = document.querySelector(".title__id");
  h1.innerHTML = pokeData.name;
  h2.innerHTML = "#" + pokeData.id;
};

//Función que recibe los datos del pokémon y muestra la imagen del Pokémon
//en la columna central.
const pokeSprite = (pokeData) => {
  const pokemonImg = pokeData.sprites.other["official-artwork"].front_default;
  const image = document.querySelector(".wrapper__left-img--random");
  image.src = pokemonImg;
};

/*
 * TODO
 *
 */
const pokeDesc = (speciesData) => {
  const flavorTexts = [];
  for (let texts of speciesData.flavor_text_entries) {
    if (texts.language.name === "es") {
      flavorTexts.push(texts.flavor_text);
    }
  }
  //Ahora con el tamaño del array, añadimos la entrada de la Pokedex de
  //manera aleatoria y la mostramos por DOM.
  const random = Math.floor(Math.random() * flavorTexts.length);
  const p = document.querySelector(".wrapper__right-grid-flovoredText");
  p.innerHTML = flavorTexts[random];
};

/*
 * TODO
 *
 */
const pokeWeight = (pokeData) => {
  const weight = pokeData.weight;
  const weightKg = weight / 10;
  const p = document.querySelector(".wrapper__right-grid-weight  .box__text");
  p.innerHTML = weightKg + " kg";
};

/*
 * TODO
 *
 */
const pokeHeight = (pokeData) => {
  const height = pokeData.height;
  const heightM = height / 10;
  const p = document.querySelector(".wrapper__right-grid-height  .box__text");
  p.innerHTML = heightM + " m";
};

/*
 *TODO
 *
 */
const pokeHabitat = (habitatData) => {
  const p = document.querySelector(".wrapper__right-grid-habitat  .box__text");
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
      p.innerHTML = "Desconocido";
    }
  });
};

/*
 * TODO
 *
 */
/* --- Dato Friki --- */
// En el mundo Pokémon, algunas de las criaturas pueden tener más de un grupo de huevos,
// por ello aprovechando que la API devuelve un obijeto, si tiene más de una entrada,
// añadimos un espacio entre medias para que no quede junto.
const pokemonEggGroup = async (speciesData) => {
  const container = document.querySelector(
    ".wrapper__right-grid-egg  .box--row"
  );
  const eggGroup = speciesData.egg_groups;
  const eggGroups = async () => {
    for (let egg of eggGroup) {
      const resp = await fetch(egg.url);
      const eggData = await resp.json();
      for (let nameP of eggData.names) {
        if (nameP.language.name === "es") {
          const p = document.createElement("p");
          p.classList.add("box__text");
          p.innerHTML = nameP.name;
          container.appendChild(p);
        }
      }
    }
  };
  await eggGroups();
};

const pokeShiny = (pokeData) => {
  const frontSprite = () => {
    const img = document.querySelector(
      ".wrapper__right-grid-shiny .random-image"
    );
    const shiny = pokeData.sprites.front_shiny;
    img.src = shiny;
  };
  const backSprite = () => {
    const img = document.querySelector(
      ".wrapper__right-grid-shiny .random-image.back"
    );
    const shiny = pokeData.sprites.back_shiny;
    img.src = shiny;
  };
  frontSprite();
  backSprite();
};

pokemonConstructor();
