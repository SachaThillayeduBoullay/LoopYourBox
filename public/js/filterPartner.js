const foodType = document.getElementById('foodType');
const chain = document.getElementById('chain');
const postcode = document.getElementById('postcode');
const city = document.getElementById('city');
const container = document.getElementById('container');

const partnerList = document.getElementById('partnerList');

let select = document.getElementsByTagName("select");
let arr = [...select];

arr.forEach(element => {
    element.addEventListener('change', () => {
        let filter = {
            chain: chain.value,
            postcode: postcode.value,
            city: city.value,
            container: container.value,
            foodType: foodType.value,
        }
        //console.log(filter)

        const resultContainer = containerInfo.filter(container => {
            if (container.material == filter.container) {
                return container;
            }
        });
        


        const result = partnerInfo.filter(partner => {
            if (
                (partner.chain == filter.chain  || filter.chain == "all" ) && 
                (partner.address.postcode == filter.postcode || filter.postcode == "all" ) && 
                (partner.address.city == filter.city || filter.city == "all" ) && 
                (partner._id == filter.container ) &&  
                (partner.foodType == filter.foodType || filter.foodType == "all" )
                ){
                return partner
            }
        });
        //console.log(result);

        while (partnerList.firstChild) {
            partnerList.removeChild(partnerList.lastChild);
        }
        
        for (i=0;i<result.length;i++) {
            let a = document.createElement("a");
            a.setAttribute("class", "collection-item");
            a.setAttribute("id", result[i]._id);
            a.setAttribute("href", `/partner/${result[i]._id}`);
            a.innerHTML = `${result[i].name} `;

            partnerList.appendChild(a);
        }
    });
});