var currentSlider = 0;
var sliderScreen = document.querySelector("#slider");
var totalSlides = document.querySelectorAll("#slider-tems").length;
var sliderBtn = document.querySelector("#slider-controls");
var sliderWidth = document.querySelector("#slider-width");
if (sliderWidth) {
    sliderWidth.style.width = "calc(100vw * ".concat(totalSlides, ")");
}
if (sliderScreen && sliderBtn) {
    sliderBtn.style.top = "50%";
    sliderBtn.style.left = "50%";
    sliderBtn.style.transform = "translate(-50%, 50%)";
    sliderScreen.style.position = "relative";
}
function goBack() {
    currentSlider--;
    if (currentSlider < 0) {
        currentSlider = totalSlides - 1;
    }
    updateMargin();
}
function goNext() {
    currentSlider++;
    if (currentSlider > totalSlides - 1) {
        currentSlider = 0;
    }
    updateMargin();
}
function updateMargin() {
    var newMargin = currentSlider * document.body.clientWidth;
    sliderWidth.style.marginLeft = "-".concat(newMargin, "px");
}
setInterval(goNext, 2000);
