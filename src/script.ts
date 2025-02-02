const items = document.querySelectorAll<HTMLElement>(".items");
const closedModalBtn = document.querySelector<HTMLButtonElement>("#close-modal");
const shoppingCart = document.getElementById("shopping-cart") as unknown as HTMLElement | null;
const fade = document.querySelector<HTMLElement>("#fade");
const modal = document.querySelector<HTMLElement>("#modal");
const buttonPay = document.querySelector<HTMLBRElement>("#payment");


items.forEach((product) => {
  const btnLess = product.querySelector<HTMLButtonElement>(".btn-less");
  const btnMore = product.querySelector<HTMLButtonElement>(".btn-more");
  const quatity = product.querySelector<HTMLSpanElement>(".quantity");
  const price = product.querySelector<HTMLSpanElement>(".price");
  const addCart = product.querySelector<HTMLButtonElement>(".add-cart");
  

  if (!btnLess || !btnMore || !quatity || !price) return;

  let count: number = parseInt(quatity.textContent || "1", 10);
  let convertPrice: number = parseFloat(price.textContent?.replace("R$", "").trim() || "0");

  const updatePrice = () => {
    const priceNew = (convertPrice * count).toFixed(2);
    price.textContent = `R$ ${priceNew}`;
  };

  btnLess.addEventListener("click", () => {
    if (count > 1) {
      count--;
      quatity.textContent = count.toString();
      updatePrice();
    }
  });

  btnMore.addEventListener("click", () => {
    count++;
    quatity.textContent = count.toString();
    updatePrice();
  });

  addCart?.addEventListener("click", ()=>{
    if (shoppingCart) {
      shoppingCart.style.display = shoppingCart.style.display === "none" ? "block" : "none";
    }
  });

});

buttonPay?.addEventListener("click", ()=>{
  toggleModal();
});

[closedModalBtn, fade].forEach((element)=>{
  element?.addEventListener("click", ()=>{
    toggleModal();
  });
});

function toggleModal(){
  modal?.classList.toggle("hide");
  fade?.classList.toggle("hide");
}