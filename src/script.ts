const closedModalBtn = document.querySelector<HTMLButtonElement>("#close-modal");
const shoppingCart = document.getElementById("shopping-cart") as unknown as HTMLElement | null;
const buttonPay = document.querySelector<HTMLButtonElement>("#payment");
const fade = document.querySelector<HTMLElement>("#fade");
const modal = document.querySelector<HTMLElement>("#modal");
const car = document.querySelector<HTMLElement>(".car");

//--------------
//Verificando se o HTML do DOM já foi carregado
if(document.readyState === "loading"){
  document.addEventListener("DOMContentLoaded", loading) as unknown as HTMLElement;
}
else{
  loading();
}
//--------------

//--------------
// Eventos que vão rodar apenas quando o DOM estiver carregado
function loading(){
  //--------------
  //Pegando o botão de remover o produto
  const removeProductCartBtn = document.querySelectorAll<HTMLButtonElement>(".remove-product-cart");
  for(let i = 0; i < removeProductCartBtn.length; i++){
      removeProductCartBtn[i].addEventListener("click", removeItem);
  }
  //--------------

  //--------------
  //Peganquando os inputs de quantidade
  const quantityInputCart = document.querySelectorAll<HTMLInputElement>(".quantity-cart-product");
  for(let i = 0; i < quantityInputCart.length; i++){
    quantityInputCart[i].addEventListener("change", checkValueInput);
  }
  //--------------
  
  //--------------
  //Pegando o botão de adicionar o produto ao carrinho
  const buttonAddCart = document.querySelectorAll<HTMLButtonElement>(".add-cart-button");
  for(let i = 0; i < buttonAddCart.length; i++){
      buttonAddCart[i].addEventListener("click", addProductCart);
  }
  //--------------

  //--------------
  //Evento click para abrir o modal de pagamento por pix
  buttonPay?.addEventListener("click", ()=>{
    toggleModal();
  }); 
  //--------------

  //--------------
  //Evento de click para abrir o modal do carrinho
  car?.addEventListener("click", () => {
    if (shoppingCart) {
        shoppingCart.style.display;
        shoppingCart.style.display === "none" ? "block" : "none";
    }
  });
  //--------------
  
  //--------------
  //Evendo de click para fechar o modal de pagamento por pix
  [closedModalBtn, fade].forEach((element) => {
    element?.addEventListener("click", () => {
      toggleModal();
    });
  });

} 
 //--------------

 //--------------
//Remove o produto do carrinho quando input for zero
 function checkValueInput(event){
    const targetValue = event.target as HTMLInputElement;
    const elementTarget = targetValue.closest(".product-in-cart") as HTMLElement | null;

    if(targetValue.value === "0" && elementTarget){
      elementTarget.remove();
    }

   updateTotal();
 }
 //--------------

//--------------
//Adicionando o produto no carrinho
function addProductCart(element){
  const buttonOfAddCart = element.target;
  const infoProducts = buttonOfAddCart.parentElement.parentElement;
  const imagesOfProducts = infoProducts.querySelectorAll(".image-product")[0].src;
  const titleProduct = infoProducts.querySelectorAll(".title-product")[0].innerText;
  const priceProduct = infoProducts.querySelectorAll(".product-price")[0].innerText;
  
  const nameOfProducts = document.querySelectorAll<HTMLElement>(".title-product-cart");
  for(let i = 0; i < nameOfProducts.length; i++){

    if(nameOfProducts[i].innerText.trim() === titleProduct.trim()){
      const rowElement = nameOfProducts[0].closest("tr");  

      if(rowElement){
        const inputElement = rowElement.querySelector<HTMLInputElement>(".quantity-cart-product");

        if(inputElement){
            let currentValue = parseInt(inputElement.value) || 0;
            inputElement.value = (currentValue + 1).toString();
            console.log(`Novo valor do inpu: ${inputElement.value}`);
        }
      }
      return;
    }
  }

  let newElementTr = document.createElement("tr");
  newElementTr.classList.add("product-in-cart");

  newElementTr.innerHTML = 
  `
    <td class="pb-4">
        <div class="w-24 max-w-full max-h-full p-1 bg-orange-100 rounded-md">
            <strong class="title-product-cart uppercase tracking-wider text-orange-800 text-center">${titleProduct}</strong>
            <img class="rounded-md" src="${imagesOfProducts}" alt="${titleProduct}">
        </div>
    </td>

    <td>
      <span class="price-product-cart text-gray-700 font-bold">${priceProduct}</span>
    </td>

    <td>
      <input class="quantity-cart-product w-16 outline-none border-none rounded-md text-center text-gray-700 font-bold p-1" type="number" placeholder="" value="1">
    </td>

    <td>
      <button class="remove-product-cart w-5 h-5 flex justify-center items-center p-3 bg-orange-200 border border-orange-700 rounded-full text-white">X</button>
    </td>
  `

  const addInTbody = document.querySelector<HTMLElement>(".table-cart tbody");
  addInTbody?.append(newElementTr);

  updateTotal();
  newElementTr.querySelectorAll<HTMLInputElement>(".quantity-cart-product")[0].addEventListener("change", checkValueInput);
  newElementTr.querySelectorAll<HTMLButtonElement>(".remove-product-cart")[0].addEventListener("click", removeItem);
}
//--------------

//--------------
  //remover o produto do carrinho
function removeItem(event){
  const target = event.target as HTMLElement;

      const elementProduct = target.closest(".product-in-cart");

      if(elementProduct){
        elementProduct.remove();
      }
      updateTotal();
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

    totalValue = `${totalValue.toFixed(2).replace(".", ",")}`;
    
    const updateSpanValue = document.querySelector<HTMLSpanElement>(".total-price span");
    if(updateSpanValue){
      updateSpanValue.innerText = `R$ ${totalValue.toString()}`;
    }
}
//--------------

//--------------
//Função para abrir e fechar o modal de pagamento pix
function toggleModal() {
  modal?.classList.toggle("hide");
  fade?.classList.toggle("hide");
}
