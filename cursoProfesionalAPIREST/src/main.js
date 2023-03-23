//DATA

const API = axios.create({
    baseURL: "https://api.themoviedb.org/3",
    headers: {
        "Content-Type": "application/json;charset=utf-8"
    },
    params: {
        "api_key": API_KEY,
        "language": navigator.language || "es-ES"
    }
});


function likedMoviesList(movieInfo){//esta funcion sirve para devolvernos las peliculas que tenemos en localStorage
    let item = localStorage.getItem("fav-movies");//buscamos si tenemos algo guardado en nuestro local storage
    let movies;
    if(item){
        movies = item;
    }else{
        movies = {}
        movies[movieInfo.id] = movieInfo
        localStorage.setItem("fav-movies",JSON.stringify(movies));
    }
    return movies;
}

function likeMovie (movieInfo){//funcion que llamamos al darle click al boton de me gusta
        let likedMovies = JSON.parse(likedMoviesList(movieInfo));//llamamos a la funcion likedMoviesList que nos devolvera un string ya que localstorage no acepta objetos ni arrays y lo volvemos un objeto para poder modificarlo
        console.log(likedMovies);
        if(likedMovies[movieInfo.id]){//si en este objeto ya existe el id. lo eliminamos
            likedMovies[movieInfo.id] = undefined;
        }else{//si no creamos este nuevo id en nuestro objeto y le asignamos la info de la pelicula
            likedMovies[movieInfo.id] = movieInfo;
        }

        localStorage.setItem("fav-movies", JSON.stringify(likedMovies));//luego que modifiquemos el objeto lo volvemos a enviar volviendolo un string
    }





//Utils
//observador para cargar solo cuando veamos las imagenes. primero guardamos la url en un atributo img-url y cuando observemos la imagen esa url se la enviamos a atributo src para cargar la imagen
const lazyLoader = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if(entry.isIntersecting){
            const urlImage = entry.target.getAttribute("img-url");
            entry.target.setAttribute("src", urlImage);
        }
    })
});
//agregamos el observador al footer. dependiendo en que hash estemos ejecutamos una paginacion pidiendo las peliculas correspondientes a donde estemos
const infinityScrollObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if(entry.isIntersecting && location.hash == "#trends"){
            getPageMoviesListByTrends ();
        }
        if(entry.isIntersecting && location.hash.startsWith("#search=")){
            getPageMoviesListBySearch ()
        }
        if(entry.isIntersecting && location.hash.startsWith("#category=")){
            getPageMoviesByCategory()
        }
    })
},{
    rootMargin : "400px" // le enviamos un margen para que lo llame 400px antes de llegar al footer
});

let page = 1;//el numero de paginas que llamaramos en la funciones de paginacion
let searchInput;//creamos una variable donde guardaremos el input que enviemos al ejecutar la funcion de llamar peliculas por busqueda, en valor inicial lo enviamos en navigation.js y luego lo usaremos para llamar a paginacion por busquedas
let categoryMoviesId;//creamos una variable para guardar el id de la categorias de peliculas que busquemos en la funcion de getMoviesByCategory que enviamos desde el archivo navigation.js


function createCategories(categories,container){
    container.innerHTML = "";

    categories.forEach(category => {
        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');

        const categoryTitle = document.createElement('h3');
        categoryTitle.classList.add('category-title');
        categoryTitle.setAttribute('id', 'id' + category.id);
        const categoryTitleText = document.createTextNode(category.name);
        categoryContainer.onclick = () => {location.hash = `category=${category.id}-${category.name}`;
    };

        categoryTitle.appendChild(categoryTitleText);
        categoryContainer.appendChild(categoryTitle);
        container.appendChild(categoryContainer);
    });

}

function generateMovieList(container, moviesList, {clean = true, infinityScroll = false} = {}){
    if(clean){
        container.innerHTML = "";
    }

    moviesList.forEach(movie => {
        const $moviesContainer = document.createElement("div");
        $moviesContainer.classList.add("movie-container");

        const $IMG = document.createElement("img");
        $IMG.classList.add("movie-img");
        $IMG.setAttribute("alt", movie.title);
        $IMG.setAttribute("img-url", `https://image.tmdb.org/t/p/w300${movie.poster_path}`);
        $IMG.addEventListener("click",() => location.hash = `movie=${movie.id}`)

        $IMG.addEventListener("error", () => {
            $IMG.setAttribute(
                'src',
                'https://static.platzi.com/static/images/error/img404.png',
            );
        })
        lazyLoader.observe($IMG);

        const $MOVIEBTN = document.createElement("button");
        $MOVIEBTN.classList.add("movie-btn");
        const likedMovies = JSON.parse(localStorage.getItem("fav-movies"));//buscamos las peliculas guardadas en favoritas y las convertimos en objeto para buscar por el id
            if(likedMovies[movie.id]){
                $MOVIEBTN.classList.add("movie-btn--liked");
            }
        $MOVIEBTN.addEventListener("click", () =>{
            $MOVIEBTN.classList.toggle("movie-btn--liked");
            likeMovie(movie);
            getLikedMoviesList();
        })


        $moviesContainer.appendChild($IMG);
        $moviesContainer.appendChild($MOVIEBTN);
        container.appendChild($moviesContainer);
    })
    if(infinityScroll){//si le enviamos el parametro de que tiene que generar scrollinfinito
        infinityScrollObserver.observe($footer);// cada vez que veamos el footer se ejecutara
    }else{
        infinityScrollObserver.unobserve($footer);// en caso que no querramos generar el scroll lo dejamos de observar por si anteriormente dejamos observando el footer no se llame en este caso
    }
}

//// Llamados a la API
async function getTrendingMoviesPreview (){
    try{
        const res = await API.get("/trending/movie/day");
        const movies = res.data.results;
        console.log(res,movies);
        window.scrollTo(0, 0);

        generateMovieList($trendingMoviesPreviewList,movies,{infinityScroll:false});
    }catch(err){
        console.log(err);
    }
};

//funcion para llamar a las categorias
async function getCategoriesPreview() {
    try{
        const res = await API.get("/genre/movie/list");
        console.log(res);
        const categories = res.data.genres;

        createCategories(categories,$categoriesPreviewList);
    }catch(err){
        console.log(err);
    }
}

//funcion para llamar a las peliculas por categoria
async function getMoviesByCategory(id){
    try{
        if(categoryMoviesId){//si la variable categoryMoviesId ya tiene un valor de otra categoria que buscamos anteriormente la limpiamos
            categoryMoviesId = undefined;
        }
        categoryMoviesId = id;//luego le agregamos el nuevo id de categoria que enviamos por parametro desde el archivo navigation.js para enviarlo luego como query string parameters en la peticion api
        page = 1;//reiniciamos el numero de pagina por si ya la aumentamos en otra funcion de paginacion
        const res = await API.get(`/discover/movie`,{
            params:{
                with_genres: categoryMoviesId,
            }
        });
        const movies = res.data.results;
        console.log(res);

        generateMovieList($genericSection, movies,{infinityScroll:true});
    }catch(err){
        console.log(err);
    }
};
//funcion para llamar a las peliculas por busquedas
async function getSearchMovies(searchValue){
    try{
        if(searchInput){//si la variable searchInput ya tiene un valor de otra busqueda anterior la limpiamos
            searchInput = undefined;
        }
        searchInput = searchValue;//luego le agregamos el nuevo valor de busqueda que enviamos por parametro desde el archivo navigation.js para enviarlo luego como query string parameters en la peticion api
        page = 1;//reiniciamos el numero de pagina por si ya la aumentamos en otra funcion de paginacion
        const res = await API.get(`/search/movie`,{
            params:{
                query: searchInput
            }
        });
        const movies = res.data.results;
        console.log(res);

        generateMovieList($genericSection, movies,{infinityScroll:true});
    }catch(err){
        console.log(err);
    }
}
//funcion para llamar a las peliculas en tendencia pero en lista generica
async function getTrendingMoviesList (){
    try{
        page = 1;//reiniciamos el numero de pagina por si ya la aumentamos en otra funcion de paginacion
        const res = await API.get("/trending/movie/day");
        const movies = res.data.results;
        console.log(res,movies);
        window.scrollTo(0, 0);

        generateMovieList($genericSection, movies,{infinityScroll : true});

    }catch(err){
        console.log(err);
    }
};
//funcion para llamar los detallles de una peli
async function getDetailsMovieById (id){
    try{
        const res = await API.get(`/movie/${id}`);
        const movie = res.data;
        console.log(movie);

        let movieImgUrl = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
        $movieDetailTitle.innerText = movie.title;
        $movieDetailDescription.innerText = movie.overview;
        $movieDetailScore.innerText = movie.vote_average.toFixed(1);//limitamos la cantidad de decimaless
        $headerSection.style.background =
        `linear-gradient(
            180deg,
            rgba(0, 0, 0, 0.35) 19.27%,
            rgba(0, 0, 0, 0) 29.17%
            ),
            url(${movieImgUrl})`;//modificamos el css para poder agregar el fondo

        createCategories(movie.genres,$movieDetailCategoriesList);//generamos las categorias relacionadas
        getRelatedMoviesById (id)

        window.scrollTo(0, 0);

    }catch(err){
        console.log(err);
    }
};
//funcion para llamar a las peliculas relacionadas con un pelicula en especifico
async function getRelatedMoviesById (id){
    try{
        const res = await API.get(`/movie/${id}/recommendations`);
        const movies = res.data.results;
        console.log(movies);

        generateMovieList($relatedMoviesContainer, movies,{infinityScroll:false});
        $relatedMoviesContainer.scrollTo(0, 0);//esto lo usamos para que el scrooll horizontal vuelva al inicio

    }catch(err){
        console.log(err);
    }
};

function getLikedMoviesList(){
    const movies = JSON.parse(localStorage.getItem("fav-movies"));//conseguimos el objeto de peliculas favoritas en string y lo volvemos un objeto
    const moviesInArray = Object.values(movies);//lo volvemos un array con sus values
    generateMovieList($favMoviesList,moviesInArray,{clean : true})//llamamos a la funcion que genera las peliculas
}



//Llamados de mas peliculas por paginacion

//funcion para llamar a las paginas siguientes en tendencias
async function getPageMoviesListByTrends (){
    try{
        page++;
        const res = await API.get("/trending/movie/day",{
        params: {
            page,
        }});
        const movies = res.data.results;
        console.log(res,movies);

        generateMovieList($genericSection, movies,{clean: false, infinityScroll : true});
    }catch(err){
        console.log(err);
    }
};

//funcion para llamar a las paginas siguientes por busquedas
async function getPageMoviesListBySearch (){
    try{
        page++
        const res = await API.get(`/search/movie`,{
            params:{
                query: searchInput,
                page,
            }
        });
        const movies = res.data.results;
        console.log(res);

        generateMovieList($genericSection, movies,{clean: false,infinityScroll:true});
    }catch(err){
        console.log(err);
    }
};

//funcion para llamar a las paginas siguientes por categorias
async function getPageMoviesByCategory(){
    try{
        page++
        const res = await API.get(`/discover/movie`,{
            params:{
                page,
                with_genres: categoryMoviesId,//aca le enviamos el parametro que ya guardamos en la variable categoryMoviesId al ejecutar getMoviesByCategory()
            }
        });
        const movies = res.data.results;
        console.log(res);

        generateMovieList($genericSection, movies,{clean: false,infinityScroll:true});
    }catch(err){
        console.log(err);
    }
};