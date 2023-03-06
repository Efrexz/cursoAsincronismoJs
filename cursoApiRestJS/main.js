////aca le damos una configuracion base que tengra siempre que la llamemos//
const API = axios.create({
    baseURL: "https://api.thedogapi.com/v1",
    headers: {"X-API-KEY": "live_R1un6VCaXopo0FIH4CI62rNyaUJiuRxKpgIXMmLfyXD9UHTTpzdPjz1oj1KtVkNd"}
});

//////////////////////////////URLS////////////////////////////////////
const KEY = "api_key=live_R1un6VCaXopo0FIH4CI62rNyaUJiuRxKpgIXMmLfyXD9UHTTpzdPjz1oj1KtVkNd";
const API_RANDOM = `https://api.thedogapi.com/v1/images/search?limit=3&${KEY}`;
const API_FAVORITES = "https://api.thedogapi.com/v1/favourites";
const API_UPLOAD = "https://api.thedogapi.com/v1/images/upload";

//llamamos a todo lo que modificaremso en el html
//////////////////////DOM///////////////////////////////////
const $IMAGEN1 = document.getElementById("imagenAleatoria1");
const $IMAGEN2 = document.getElementById("imagenAleatoria2");
const $IMAGEN3 = document.getElementById("imagenAleatoria3");
const $BTNADD1 = document.getElementById("btnAdd1");
const $BTNADD2 = document.getElementById("btnAdd2");
const $BTNADD3 = document.getElementById("btnAdd3");
const $BTNGENERADOR = document.getElementById("generador");
const $containerFavs = document.getElementById("containerFavorites");

//declaro estas variables a nivel global para poder obtener el id al momento de llamar a la funcion generarPerritos. que luego usare para poder enviarle a la funcion agregar a favoritos
let imageID1;
let imageID2;
let imageID3;

//generamos aleatoriamente imagenes de perritos con el metodo GET (que es por defecto)
async function generarPerritosAleatorios () {
    try{
        const DATARANDOM = await fetch(API_RANDOM);
        const DATAJSONRANDOM = await DATARANDOM.json();
        //conseguimos el url de cada imagen para agregarselas al html ya predefinido
        $IMAGEN1.src = DATAJSONRANDOM[0].url;
        $IMAGEN2.src = DATAJSONRANDOM[1].url;
        $IMAGEN3.src = DATAJSONRANDOM[2].url;

        //conseguimos el id de las imagenes para guardarlas en variables globales que luego usaremos en otra funcion que nos servira para agregarlas a la lista de favoritos
        imageID1 = DATAJSONRANDOM[0].id;
        imageID2 = DATAJSONRANDOM[1].id;
        imageID3 = DATAJSONRANDOM[2].id;

        console.log("random");
        console.log(DATAJSONRANDOM)
    }catch(err){
        console.log(`ocurrio un error ${err.message}`)
    }
};

async function generarPerritosFavoritos () {
    try{
        const DATAFAV = await fetch(`${API_FAVORITES}?${KEY}`);
        const DATAJSONFAV = await DATAFAV.json();
        console.log("favoritos");
        console.log(DATAJSONFAV);

        $containerFavs.innerText = "";

        //por cada perrito favorito que tengamos en la lista lo recorreremos para manipular el DOM y agregar las imagenes dinamicamente
        for(let favorito of DATAJSONFAV){
            let article = document.createElement("article");
            let btnEliminar = document.createElement("button");
            let imgFav = document.createElement("img");

            imgFav.src = favorito.image.url;
            btnEliminar.textContent = "Eliminar de Favoritos";
            btnEliminar.addEventListener("click", () => borrarFavoritos(favorito.id));
            article.append(imgFav,btnEliminar);
            $containerFavs.appendChild(article);
        }

    }catch(err){
        console.log(`ocurrio un error ${err.message}`)
    }
};


async function agregarFavoritos(id){
    //////////////////CON AXIOS (MUCHO MAS REDUCIDO EL CODIGO)////////////
    try{
        const RES = await API.post("/favourites",{
            image_id: id
        });
        console.log(RES);
        generarPerritosFavoritos ()
    }catch(err){
        console.log(err);
    }


    /////////////////////////////Con fetch/////////////////////////////
    // try{
    //     const RES = await fetch(`${API_FAVORITES}?${KEY}`,{
    //         method: "POST",
    //         mode: "cors",
    //         headers: {
    //             "Content-Type": "application/json",//aca le indicamos que la info que le enviaremos es un json
    //         },//aca tenemos que enviar como string ya que no sabemos si el backend en el que etsa escrito nuestra API. entienda esta sintaxis de objetos en js. puede estar escrito en GO,PHP,PHYTON,RUBY cualquier otra lenguaje de backend. si enviamos un texto todos nos entenderemos
    //         body: JSON.stringify({
    //             image_id: id
    //         })
    //     });
    //     generarPerritosFavoritos();
    // }catch(err){
    //     console.log(err);
    // }
}


async function borrarFavoritos(id){
    try{
        const RES = await fetch(`${API_FAVORITES}/${id}?${KEY}`,{
            method: "DELETE"
        });
        generarPerritosFavoritos ();
    }catch(err){
        console.log(err.message);
    }
}

//toda la explicacion revisa tu notion
async function subirImagen(){
    const $FORM = document.getElementById("formulario");
    let formData = new FormData($FORM);
    console.log(formData);

    const RES = await fetch(API_UPLOAD, {
        method: "POST",
        headers: {
            // "Content-Type": "multipart/form-data",
            "X-API-KEY": "live_R1un6VCaXopo0FIH4CI62rNyaUJiuRxKpgIXMmLfyXD9UHTTpzdPjz1oj1KtVkNd"
        },
        body: formData,
    });
//convertimos a json para encontrar su id y enviarlo a la funcion agregarFavoritos
    const DATA = await RES.json();
    console.log(DATA);
    console.log(DATA.id);

    agregarFavoritos(DATA.id);
}

$BTNADD1.addEventListener("click", () =>{
    agregarFavoritos(imageID1)
});
$BTNADD2.addEventListener("click", () =>{
    agregarFavoritos(imageID2)
});
$BTNADD3.addEventListener("click", () =>{
    agregarFavoritos(imageID3)
});



$BTNGENERADOR.addEventListener("click", generarPerritosAleatorios);
generarPerritosAleatorios();
generarPerritosFavoritos ();


