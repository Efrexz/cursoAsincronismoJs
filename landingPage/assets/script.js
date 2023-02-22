const API = 'https://youtube-v31.p.rapidapi.com/search?channelId=UC84whx2xxsiA1gXHXXqKGOA&part=snippet%2Cid&order=date&maxResults=9';
const $content = document.getElementById("content");
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '5e6672e8e6msh39b1b6563c5d1ddp1b6de7jsn5d7c60c7d25a',
		'X-RapidAPI-Host': 'youtube-v31.p.rapidapi.com'
	}
};

async function fetchData (urlApi) {
    const DATA = await fetch(urlApi,options);
    const JSON = await DATA.json();
    return JSON;
}

(async () => {
    try{
        const VIDEOS = await fetchData(API);
        let view = `
        ${VIDEOS.items.map(video => `
        <div class="group relative">
            <div
                class="w-full bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:aspect-none">
                <img src="${video.snippet.thumbnails.high.url}" alt="${video.snippet.description}" class="w-full">
            </div>
            <div class="mt-4 flex justify-between">
                <h3 class="text-sm text-gray-700">
                    <span aria-hidden="true" class="absolute inset-0"></span>
                    ${video.snippet.title}
                </h3>
            </div>
        </div>
        `).slice(0,4).join("")}
        `;
        $content.innerHTML = view;
    }catch(err){
        console.log(err);
    }
})()