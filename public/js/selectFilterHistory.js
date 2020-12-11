let url_string = window.location.href;
let url = new URL(url_string);
let day = url.searchParams.get("day");
let month = url.searchParams.get("month");
let year = url.searchParams.get("year");
let action = url.searchParams.get("action");
let partner = url.searchParams.get("partner");

const daySelect = document.getElementById("day");
const monthSelect = document.getElementById("month");
const yearSelect = document.getElementById("year");
const actionSelect = document.getElementById("action");
const partnerSelect = document.getElementById("partner");


daySelect.value = day;
monthSelect.value = month;
yearSelect.value = year;
actionSelect.value = action;
partnerSelect.value = partner;