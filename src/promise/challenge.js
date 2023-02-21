// Importar la librería fetch de Node.js
import fetch from 'node-fetch';

// Definir la URL base de la API
const API='https://api.escuelajs.co/api/v1';

// Definir una función que recibe una URL de la API y devuelve el resultado de la petición
function fetchData(urlApi){
    return fetch(urlApi);
};

// Hacer una petición a la API para obtener una lista de productos
fetchData(`${API}/products`)
    .then(response=>response.json()) // Convertir la respuesta en formato JSON
    .then(products=>{
        console.log(products); // Mostrar en consola la lista de productos obtenida
        // Hacer una petición a la API para obtener el primer producto de la lista
        return fetchData(`${API}/products/${products[0].id}`)
    })
    .then(response=>response.json()) // Convertir la respuesta en formato JSON
    .then(product=>{
        console.log(product.title); // Mostrar en consola el título del producto obtenido
        // Hacer una petición a la API para obtener la categoría del producto obtenido anteriormente
        return fetchData(`${API}/categories/${product.category.id}`)
    })
    .then(response=>response.json()) // Convertir la respuesta en formato JSON
    .then(category=>{
        console.log(category.name); // Mostrar en consola el nombre de la categoría obtenida
    })
    .catch(err=>console.log(err)) // Manejar cualquier error que se produzca
    .finally(()=>console.log('Finally')); // Ejecutar un código después de que se resuelva o rechace la promesa (en este caso, solo muestra un mensaje en la consola)


