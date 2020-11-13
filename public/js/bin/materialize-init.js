

M.AutoInit();

document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems, options);
});


    
document.addEventListener("DOMContentLoaded", function () {
  var elems = document.querySelectorAll(".carousel");
  var instances = M.Carousel.init(elems, {
    dist: 0,
    padding: 20,
    fullWidth: false,
    indicators: true,
    duration: 100,
  });

  var instance = M.Carousel.getInstance(elem);
  instance.next(1);
});

