//Realizamos la petición
const gotChars = async () => {
  try {
    const respuesta = await fetch(`https://thronesapi.com/api/v2/Characters`);
    const data = await respuesta.json();
    return data;
  } catch (error) {
    console.error("Error fetching characters:", error);
    throw error;
  }
};

function selectData() {
  const select = document.querySelector("select");
  const img = document.querySelector(".character-image");

  gotChars()
    .then((data) => {
      if (data.length > 0) {
        data.forEach((element) => {
          const option = document.createElement("option");
          //Guardamos el id de cada una de las opciones en los valores
          //para luego acceder a ellos directamente.
          option.value = element.id;
          option.textContent = element.fullName;
          select.append(option);
        });
        //Añadimos a la primera imagen la posición 0 o no se verá
        img.src = data[0].imageUrl;

        //Mediante change, comprobamos que el id del valor del option seleccionado
        //coincida con la posición en el array que nos interesa
        select.addEventListener("change", (event) => {
          const selectedCharacter = data[event.target.value];
          img.src = selectedCharacter.imageUrl;
        });
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

selectData();
