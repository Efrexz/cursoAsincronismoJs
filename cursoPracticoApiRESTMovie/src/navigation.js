$searchFormBtn.addEventListener("click", () => {location.hash = `search=${$searchFormInput.value}`;});
$trendingBtn.addEventListener("click", () => location.hash = "trends");
    //window.history que tiene varios metodos y entre ellos ‘back()’ que nos permite ir a la URL anterior que visito el usuario.
$arrowBtn.addEventListener("click", () => history.back());

window.addEventListener("DOMContentLoaded", navigator, false);
//cada vez que cambie el hash se llama
window.addEventListener("hashchange", navigator, false);

function navigator(){
    if(location.hash.startsWith("#trends")){
        trendsPage()
    }else if(location.hash.startsWith("#search=")){
        searchPage()
    }else if(location.hash.startsWith("#movie=")){
        movieDetailsPage()
    }else if(location.hash.startsWith("#category=")){
        categoriesPage()
    }else{
        homePage();
    }
}

function trendsPage(){

    $headerSection.classList.remove("header-container--long");
    $headerTitle.classList.add("inactive");
    $searchForm.classList.add("inactive");
    $arrowBtn.classList.remove("inactive");
    $headerCategoryTitle.classList.remove("inactive");
    $headerSection.style.background = "";

    $trendingPreviewSection.classList.add("inactive");
    $categoriesPreviewSection.classList.add("inactive");
    $genericSection.classList.remove("inactive");
    $movieDetailSection.classList.add("inactive");

    $headerCategoryTitle.innerText = "Tendencias"
    getTrendingMoviesList ();
};

function searchPage(){
    console.log("search");

    $headerSection.classList.remove("header-container--long");
    $headerTitle.classList.add("inactive");
    $searchForm.classList.remove("inactive");
    $arrowBtn.classList.remove("inactive");
    $arrowBtn.classList.remove("header-arrow--white");
    $headerCategoryTitle.classList.remove("inactive");
    $headerSection.style.background = "";

    $trendingPreviewSection.classList.add("inactive");
    $categoriesPreviewSection.classList.add("inactive");
    $genericSection.classList.remove("inactive");
    $movieDetailSection.classList.add("inactive");

    //otra forma que se me ocurrio pero no servia para volver atras con la url
    // let searchValue = $searchFormInput.value;
    const [_,searchValue]= location.hash.split("=");

    //decordeURI para evitar caracteres locos al momento de colocar espacios
    $headerCategoryTitle.innerText = decodeURI(searchValue);
    getSearchMovies(searchValue);
    $searchFormInput.value = "";
};

function movieDetailsPage(){
    console.log("movie");

    $headerSection.classList.add("header-container--long");
    $headerTitle.classList.add("inactive");
    $searchForm.classList.add("inactive");
    $arrowBtn.classList.remove("inactive");
    $arrowBtn.classList.add("header-arrow--white");
    $headerCategoryTitle.classList.add("inactive");


    $trendingPreviewSection.classList.add("inactive");
    $categoriesPreviewSection.classList.add("inactive");
    $genericSection.classList.add("inactive");
    $movieDetailSection.classList.remove("inactive");

    const [_,movieId]= location.hash.split("=");

    getDetailsMovieById(movieId);
};

function categoriesPage(){

    $headerSection.classList.remove("header-container--long");
    $headerTitle.classList.add("inactive");
    $searchForm.classList.add("inactive");
    $arrowBtn.classList.remove("inactive");
    $arrowBtn.classList.remove("header-arrow--white");
    $headerCategoryTitle.classList.remove("inactive");
    $headerSection.style.background = "";

    $trendingPreviewSection.classList.add("inactive");
    $categoriesPreviewSection.classList.add("inactive");
    $genericSection.classList.remove("inactive");
    $movieDetailSection.classList.add("inactive");

    ///(#category=12-Aventura) hash
    //aca buscar el hash actual en el que estamos. luego destructuramos la informacion ya que nos devuelve un array de dos posiciones(la primera posicion la guardamos en _, ya que no nos interesa y la otra info en urlInfo)
    const [_,categoryInfo]= location.hash.split("=");//[#category(no nos interesa), id-namecategory]

    console.log(categoryInfo);

    //aca hacemos lo mismo ya que igual nos devuelve un array de dos elementos
    const [categoryId,categoryName] = categoryInfo.split("-");//[id, namecategory]

    console.log(categoryId);
    console.log(categoryName);

    //le cambiamos el titulo cada vez que seleccionemso una categoria
    $headerCategoryTitle.innerText = categoryName;

    //con window.scrollTo desplazamos el scroll en posicion (x(horizantal), y(vertical)) cuando seleccionamos una categoria
    window.scrollTo(0, 0);

    getMoviesByCategory(categoryId,categoryName);
};

function homePage(){
    $headerSection.classList.remove("header-container--long");
    $headerTitle.classList.remove("inactive");
    $searchForm.classList.remove("inactive");
    $arrowBtn.classList.add("inactive");
    $arrowBtn.classList.remove("header-arrow--white");
    $headerCategoryTitle.classList.add("inactive");
    //aca limpiamos nuestro background ya que cuando entramos a otras secciones de agrega una imagen de fondo y por eso debemos colocarla de nuevo en blanco
    $headerSection.style.background = "";

    $trendingPreviewSection.classList.remove("inactive");
    $categoriesPreviewSection.classList.remove("inactive");
    $genericSection.classList.add("inactive");
    $movieDetailSection.classList.add("inactive");

    getTrendingMoviesPreview();
    getCategoriesPreview();
};

