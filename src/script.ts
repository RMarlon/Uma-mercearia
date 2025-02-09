const items = document.querySelectorAll<HTMLElement>(".items");

const closedModalBtn = document.querySelector<HTMLButtonElement>("#close-modal");
const shoppingCart = document.getElementById("shopping-cart") as unknown as HTMLElement | null;
const buttonPay = document.querySelector<HTMLButtonElement>("#payment");
const fade = document.querySelector<HTMLElement>("#fade");
const modal = document.querySelector<HTMLElement>("#modal");
const car = document.querySelector<HTMLElement>(".car");


const quntityCart = document.querySelectorAll<HTMLInputElement>(".quantity-cart-product");
for(let i = 0; i < quntityCart?.length; i++){
    quntityCart[i].addEventListener("change", updateInfoCart);
}

//--------------

function updateInfoCart():void{
  //Atualiza o valor no carrinho de comprar ao remover o produto
  const productInCart = document.querySelectorAll<HTMLElement>(".product-in-cart");
  let totalProduct: string | number = 0;
  
  for(let i = 0; i < productInCart.length; i++){
    const priceProductCart = (productInCart[i].querySelectorAll(".price-product-cart")[0] as HTMLSpanElement).innerText.replace("R$", "").replace(",", ".");
    const quantityProductCart = (productInCart[i].querySelectorAll(".quantity-cart-product")[0] as HTMLInputElement).value;
    
    totalProduct +=  (+priceProductCart * +quantityProductCart);
  }
  totalProduct = totalProduct.toFixed(2);
  totalProduct = totalProduct.replace(".", ",");
  
  const totalPrice = (document.querySelector(".total-price span") as HTMLSpanElement);
  totalPrice.innerText = `R$ ${totalProduct.toString()}`;
}

//--------------

const removeProductBtn = document.querySelectorAll<HTMLButtonElement>(".remove-product");
for (let i = 0; i < removeProductBtn.length; i++){

  // Evento para remover os produtos do carrinho de compras

  removeProductBtn[i].addEventListener("click", function (event): void {
       const targetElement = event.target as HTMLElement;
       const targetProduct = targetElement.closest("tr");

       if(targetProduct){
        targetProduct.remove();
       }
       updateInfoCart();
    });
}

//--------------

const addCart = document.querySelectorAll<HTMLButtonElement>(".add-cart");
    
    addCart.forEach((event)=>{
      //Essa função adiciona os itens no carrinho
      event.addEventListener("click", function addItemCart(element): void{
        const elementTarget = element.target as HTMLElement;

        const products = elementTarget.closest(".all-products-move");
        if(!products) return;
        
        const imageProduct = products.querySelector<HTMLImageElement>(".image-product")?.src || "";
        const titleProduct = products.querySelector<HTMLElement>(".title-product")?.innerText || "Produto sem título";
        const price = products.querySelector<HTMLSpanElement>(".price")?.innerText || "0,00";
        
        let createNewProduct = document.createElement("tr");
        createNewProduct.classList.add("product-in-cart");

        createNewProduct.innerHTML = 
        `
         <td class="pt-4 border-b-orange-800">
         <div class="w-24 max-w-full max-h-full p-1 bg-orange-100 rounded-md">
              <h2 class="uppercase tracking-wider text-orange-800 text-center">${titleProduct}</h2>
              <img class="rounded-md" src="${imageProduct}" alt="${titleProduct}">
         </div>
      </td>

      <td>
        <span class="price-product-cart text-gray-700 font-bold">R$ ${price}</span>
      </td>

      <td>
        <input class="quantity-cart-product w-16 outline-none border-none rounded-md text-center text-gray-700 font-bold p-1" type="number" value="1">
      </td>

      <td>
        <button class="remove-product w-5 h-5 flex justify-center items-center p-3 bg-orange-200 border border-orange-700 rounded-full text-white">X</button>
      </td>
        `;

        const bodyTable = document.querySelector<HTMLElement>(".add-tbody");
        if(bodyTable){
          bodyTable?.appendChild(createNewProduct);
        }

        updateInfoCart();
      });

    });

items.forEach((product) => {
    const btnLess = product.querySelector<HTMLButtonElement>(".btn-less");
    const btnMore = product.querySelector<HTMLButtonElement>(".btn-more");
    const quatity = product.querySelector<HTMLSpanElement>(".quantity");
    const price = product.querySelector<HTMLSpanElement>(".price");
    
    

    if (!btnLess || !btnMore || !quatity || !price) return;

    let count: number = parseInt(quatity.textContent || "1", 10);
    let convertPrice: number = parseFloat(
      price.textContent?.replace("R$", "").trim() || "0"
    );

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

    buttonPay?.addEventListener("click", ()=>{
      toggleModal();
    });   

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
