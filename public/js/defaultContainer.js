const name = document.getElementById('name');
const material = document.getElementById('material');
const credit = document.getElementById('credit');
const image = document.getElementById('image');
const imageLabel = document.getElementById('imageLabel');

let select = document.getElementById('defaultContainer');
select.addEventListener('change', () => {
    let defaultInfo = container.filter(element => {
        if(element.name == select.value) {
            return element
        }
    });
    if (select.value != "noDefault") {
    name.value = defaultInfo[0].name;
    material.value = defaultInfo[0].material;
    credit.value = defaultInfo[0].credit;
    //image.value = JSON.stringify(defaultInfo[0].image);

    
        image.setAttribute("type", "hidden");
        imageLabel.style.display = "none";
    } else if (select.value == "noDefault") {
        image.setAttribute("type", "file");
        imageLabel.style.display = "inline";
    }


    console.log(defaultInfo)
}); 