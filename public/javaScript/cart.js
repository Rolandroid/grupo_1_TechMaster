const $ = (el) => document.querySelector(el)

const cardsContainer = $('#cards-container') 
const clearCart = $('#clear-cart') 
const btnBuy = $('#btn-buy') 
const outputTotal = $('#output-total') 
const URL_API_SERVER = "http://localhost:3000/api"


const getOrder = () => {
    return fetch(`${URL_API_SERVER}/cart/getOrderPending`,{
        headers:{
            'Content-Type':'application/json'
        }
    })
    .then((res)=> res.json());
};

const paintProducts = ({products}) =>{
    cardsContainer.innerHTML += '';
    products.forEach(({title,description,images,price}) => {
        const templete = `
        <!-- COURSE TEMPLATE CARD -->
              <div class="card col-12 col-lg-8 my-5">
                <div class="card-body row">
                  
                  <img class="col-4" style="width:150px" style="object-fit: contain;" src="/images/products/${
                    images[0].name
                  }" alt="">
                  <div class="col-8 position-relative">
                    <button onclick="removeProductToCart(${id})" class="fs-5 p-0 border-0 bg-transparent position-absolute text-danger " style="top:-3px;right:10px"><i style="padding:2px" class="rounded-circle btn-clear far fa-times-circle"></i></button>
    
                    <h5 class="card-title">${title}</h5>
                    <p class="card-text text-truncate">${description}</p>
                    <p class="card-text">${price}${
          discount
            ? `<span class="text-danger mx-3">${discount}% OFF</span>`
            : ""
        }</p>
                    <p class="d-flex align-items-center gap-2">
                      <label for=""></label>
                      <button onclick="lessProduct(${id},${
          Cart.quantity
        })" class="btn btn-light">-</button>
                      <output style="width:50px"  class="form-control text-center">
                        ${Cart.quantity}
                      </output>
                      <button onclick="moreProduct(${id})" class="btn btn-light">+</button>
                      <a href="/products/detail/${id}" class="btn btn-outline-dark">Ver más</a>
                    </p>
                  </div>
               
                </div>
              </div>
        `
        cardsContainer.innerHTML += templete;
    });
}

//apenas carga la pagina realizo una peticion a la api por fecth 
window.addEventListener('load', async () =>{
    try {
        const {ok,data} = await getOrder()
        ok ? paintProducts({products: data.cart}) : null
        //console.log({ok,data});
    } catch (error) {
        console.log(error);
    }

})

