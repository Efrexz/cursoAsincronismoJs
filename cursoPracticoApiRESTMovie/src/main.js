const API = axios.create({
    baseURL: "https://api.themoviedb.org/3",
    headers: {
        "Content-Type": "application/json;charset=utf-8"
    },
    params: {
        "api_key": API_KEY,
    }
})


//Utils

function createCategories(categories,container){
    container.innerText = "";

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

function generateMovieList(container, moviesList){
    container.innerText = "";

    moviesList.forEach(movie => {
        const $moviesContainer = document.createElement("div");
        $moviesContainer.classList.add("movie-container");
        $moviesContainer.addEventListener("click",() => location.hash = `movie=${movie.id}`)

        const $IMG = document.createElement("img");
        $IMG.classList.add("movie-img");
        $IMG.setAttribute("alt", movie.title);
        $IMG.setAttribute("src", `https://image.tmdb.org/t/p/w300${movie.poster_path}`);

        $moviesContainer.appendChild($IMG);
        container.appendChild($moviesContainer);
    });
}

//// Llamados a la API
async function getTrendingMoviesPreview (){
    try{
        const res = await API.get("/trending/movie/day");
        const movies = res.data.results;
        console.log(res,movies);
        window.scrollTo(0, 0);

        generateMovieList($trendingMoviesPreviewList, movies);
    }catch(err){
        console.log(err);
    }
};


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
        const res = await API.get(`/discover/movie`,{
            params:{
                with_genres: id,
            }
        });
        const movies = res.data.results;
        console.log(res);

        generateMovieList($genericSection, movies);
    }catch(err){
        console.log(err);
    }
};

async function getSearchMovies(searchValue){
    try{
        const res = await API.get(`/search/movie`,{
            params:{
                query: searchValue
            }
        });
        const movies = res.data.results;
        console.log(res);

        generateMovieList($genericSection, movies);
    }catch(err){
        console.log(err);
    }
}

async function getTrendingMoviesList (){
    try{
        const res = await API.get("/trending/movie/day");
        const movies = res.data.results;
        console.log(res,movies);
        window.scrollTo(0, 0);

        generateMovieList($genericSection, movies);
    }catch(err){
        console.log(err);
    }
};

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

async function getRelatedMoviesById (id){
    try{
        const res = await API.get(`/movie/${id}/recommendations`);
        const movies = res.data.results;
        console.log(movies);

        generateMovieList($relatedMoviesContainer, movies);
        $relatedMoviesContainer.scrollTo(0, 0);//esto lo usamos para que el scrooll horizontal vuelva al inicio

    }catch(err){
        console.log(err);
    }
};