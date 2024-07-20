const randomize = () => Math.floor(Math.random() * 650) + 1;

console.log(randomize);
const gottaCatchEmAll = async () => {
  try {
    const resp = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${randomize()}`
    );
    const pokedata = await resp.json();
    return pokedata;
  } catch (error) {
    console.log(error);
  }
};

function pokemon() {
  const image = document.querySelector(".random-image");
  const h1 = document.querySelector("h1");
  const typesCont = document.querySelector(".type");
  gottaCatchEmAll().then((pokedata) => {
    image.src = pokedata.sprites.other["official-artwork"].front_default;
    h1.innerHTML = pokedata.name;

    const type = () => {
      const types = pokedata.types;
      types.forEach((type) => {
        const p = document.createElement("p");
        p.innerHTML = type.type.name;
        typesCont.append(p);
      });
    };
    type();
  });
}

pokemon();
