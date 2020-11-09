const foodType = document.getElementById('foodType');
const chain = document.getElementById('chain');
const postcode = document.getElementById('postcode');
const city = document.getElementById('city');
const container = document.getElementById('container');

let select = document.getElementsByTagName("select");
let arr = [...select];

arr.forEach(element => {
    element.addEventListener('change', () => {
        let filter = {
            chain: chain.value,
            postcode: postcode.value,
            city: city.value,
            //container: container.value,
            foodType: foodType.value,
        }
        //console.log(filter)
        
        const result = partnerInfo.filter(partner => {
            if (partner.chain == filter.chain && partner.address.postcode == filter.postcode && partner.address.city == filter.city && /*partner.container == filter.container &&*/  partner.foodType == filter.foodType){
                return partner
            }

        });
        console.log(result);
        //document.getElementById(partner._id).style.display = "none";
         /* <div class="collection">
        <% partnerInfo.forEach((partner) => { %>
        <a href="/partner/<%= partner._id %>" class="collection-item" id="<%= partner._id %>"><%= partner.name %></a>
        <% }); %>
    </div>*/
    });
});

console.log(partnerInfo)



//