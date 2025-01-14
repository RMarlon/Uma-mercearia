let currentSlider = 0;

const sliderScreen = document.querySelector("#slider") as HTMLElement;
const totalSlides = document.querySelectorAll("#slider-tems").length;
const sliderBtn = document.querySelector( "#slider-controls") as HTMLButtonElement;
const sliderWidth = document.querySelector("#slider-width") as HTMLElement;

if (sliderWidth) {
  sliderWidth.style.width = `calc(100vw * ${totalSlides})`;
}

if (sliderScreen && sliderBtn) {

   sliderBtn.style.top = "50%";
   sliderBtn.style.left = "50%";
   sliderBtn.style.transform = "translate(-50%, 50%)";

   sliderScreen.style.position = "relative";
}

function goBack(): void {
  currentSlider--;
  if (currentSlider < 0) {
    currentSlider = totalSlides - 1;
  }

  updateMargin();
}

function goNext(): void {
  currentSlider++;
  if (currentSlider > totalSlides - 1) {
    currentSlider = 0;
  }

  updateMargin();
}

function updateMargin(): void {
  const newMargin = currentSlider * document.body.clientWidth;
  sliderWidth.style.marginLeft = `-${newMargin}px`;
}

setInterval(goNext, 2000);