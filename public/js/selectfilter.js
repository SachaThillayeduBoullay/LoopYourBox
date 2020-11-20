let url_string = window.location.href;
let url = new URL(url_string);
let foodType = url.searchParams.get("foodType");
let chain = url.searchParams.get("chain");
let postcode = url.searchParams.get("postcode");
let city = url.searchParams.get("city");
let material = url.searchParams.get("material");

const foodTypeSelect = document.getElementById("foodType");
const chainSelect = document.getElementById("chain");
const postcodeSelect = document.getElementById("postcode");
const citySelect = document.getElementById("city");
const materialSelect = document.getElementById("material");


foodTypeSelect.value = foodType;
chainSelect.value = chain;
postcodeSelect.value = postcode;
citySelect.value = city;
materialSelect.value = material;