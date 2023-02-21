    const promise = new Promise(function (resolve, reject) {
        resolve('hey!')
    });

    const cows = 9;

    const countCows = new Promise(function (resolve, reject) {
        if (cows > 10) {
        resolve(`We have ${cows} cows on the farm`);
        } else {
        reject("There is no cows on the farm");
        }
    });

    countCows.then((result) => {
        console.log(result);
    }).catch((error) => {
        console.log(error);
    }).finally(() => console.log('Finally'));



//playground 
    /*
En este desafío tienes la función delay la cual se espera que un tiempo específico retorne un mensaje

La función deberá recibir dos parámetros:

time: el tiempo de espera
message: el mensaje que debe imprimir después del tiempo de espera
La función delay debe retornar una promesa para poderlo usarlo de forma asíncrona.*/

        function delay(time, message) {
            return new Promise((resolve, reject) => {
            window.setTimeout(() => {
                resolve(message);
            }, time);
            });
        }