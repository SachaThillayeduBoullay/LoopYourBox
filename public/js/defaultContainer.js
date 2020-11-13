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
        
        image.setAttribute("type", "text");
        imageLabel.style.display = "none";
        image.style.display = "none";
        image.value = defaultInfo[0].image;

    } else if (select.value == "noDefault") {
        image.setAttribute("type", "file");
        imageLabel.style.display = "inline";
        image.style.display = "inline";
    }


    console.log(defaultInfo)
});

