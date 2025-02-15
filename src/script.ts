const closedModalBtn = document.querySelector<HTMLButtonElement>("#close-modal");
const shoppingCart = document.getElementById("shopping-cart") as unknown as HTMLElement | null;
const buttonPay = document.querySelector<HTMLButtonElement>("#payment");
const fade = document.querySelector<HTMLElement>("#fade");
const modal = document.querySelector<HTMLElement>("#modal");
const car = document.querySelector<HTMLElement>(".car");

//--------------

//remover o produto do carrinho
const removeProductCartBtn = document.querySelectorAll<HTMLButtonElement>(".remove-product-cart");
for(let i = 0; i < removeProductCartBtn.length; i++){
  removeProductCartBtn[i].addEventListener("click", function(element) {
    const target = element.target as HTMLElement;

    const elementProduct = target.closest(".product-in-cart");

    if(elementProduct){
      elementProduct.remove();
    }
    updateTotal();
  });
}

//--------------
//Atualizando o valor dos produtos dentro do carrinho
function updateTotal(){

    let totalValue: string | number = 0;
    
    const updateValueCart = document.querySelectorAll<HTMLElement>(".product-in-cart");
    for (let i = 0; i< updateValueCart.length; i++){
      const priceProductCart = updateValueCart[i].querySelectorAll<HTMLSpanElement>(".price-product-cart")[0].innerText.replace("R$", "").replace(",", ".");
      const inputQuantityCart = updateValueCart[i].querySelectorAll<HTMLInputElement>(".quantity-cart-product")[0].value;
      
      totalValue +=  (+priceProductCart * +inputQuantityCart);
    }

    totalValue = totalValue.toFixed(2).replace(".", ",");
    
    const updateSpanValue = document.querySelector<HTMLSpanElement>(".total-price span");
    if(updateSpanValue){
      updateSpanValue.innerText = `R$ ${totalValue.toString()}`;
    }
}

//--------------



//--------------


//--------------    

buttonPay?.addEventListener("click", ()=>{
  toggleModal();
}); 

car?.addEventListener("click", () => {
  if (shoppingCart) {
      shoppingCart.style.display =
      shoppingCart.style.display === "none" ? "block" : "none";
  }
});

[closedModalBtn, fade].forEach((element) => {
  element?.addEventListener("click", () => {
    toggleModal();
  });
});

function toggleModal() {
  modal?.classList.toggle("hide");
  fade?.classList.toggle("hide");
}
