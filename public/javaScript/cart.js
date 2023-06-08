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
const convertFormatPeso = (n) =>
  n.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
  });
const paintProducts = ({products}) =>{
  if(products.length) {
      cardsContainer.innerHTML = '';
      products.forEach(({name,description,images,price,discount,Cart,id}) => {
        const priceWithDiscount = discount
        ? price - (price * discount) / 100
        : price;
      const priceFormatARG = convertFormatPeso(priceWithDiscount);
          const templete = `
          <!-- COURSE TEMPLATE CARD -->
                <div id="articleCarrito"class="card my-5">
                  <div  class="card-body row">
                    
                    <img style="object-fit:cover;width:235px" src="/Images/products/${
                      images[0].name || 'default-image.png'
                    }" alt="">
                    <div class="col-8 position-relative" id="cart-card-article">
                      <button onclick="removeProductToCart(${id})"  class="fs-5 p-0 border-0 bg-transparent position-absolute text-danger " style="top:-3px;right:10px"><i   style="padding:4px" class="rounded-circle btn-clear far fa-times-circle"></i></button>
      
                      <h5 class="card-title">${name}</h5>
                      <p class="card-text text-truncate ">${description}</p>
                      <p class="card-text ">${priceFormatARG}${
            discount
              ? `<span class="text-success mx-2">${discount}% OFF</span>`
              : ""
          }</p>
                      <p class="d-flex align-items-center gap-2">
                        <label for=""></label>
                       
                       <div id="cart-buttons-article"> 
                       <button id="lessQuantity" onclick="lessProduct(${id},${
            Cart.quantity
          })" class="btn btn-light">-</button>
                        <output id="buttonQuantity" style="width:40px"  class="form-control text-center">
                          ${Cart.quantity}
                        </output>
                        <button id="moreQuantity" onclick="moreProduct(${id})" class="btn btn-light">+</button>
                        <a href="/products/detalle/${id}" class="btn btn-outline-light">Ver más</a>
                      </p>
                    </div>
                    </div>
                 
                  </div>
                </div>
          `
          cardsContainer.innerHTML += templete;
      });
      return
    }
    cardsContainer.innerHTML = '<h2 class="text-white">No hay productos en el carrito</h2>';
    paintTotal(0)
}

//apenas carga la pagina realizo una peticion a la api por fecth 
window.addEventListener('load', async () =>{
    try {
        const {ok,data} = await getOrder()
        ok ? paintProducts({products: data.cart}) : null
        ok ? paintTotal(data.total) : null
    } catch (error) {
        console.log(error);
    }

})

const paintTotal = (n) => {
  outputTotal.textContent = convertFormatPeso(n);
};

const moreProduct = async (id) => {
  const objProductId = {
    productId: id,
  };
  const { ok } = await fetch(`${URL_API_SERVER}/cart/moreQuantity`, {
    method: "PUT",
    body: JSON.stringify(objProductId),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());

  if (ok) {
    const { ok, data } = await getOrder();
    if (ok) {
      paintProducts({ products: data.cart });
      paintTotal(data.total);
    }
  }
};

const lessProduct = async (id, quantity) => {
  const objProductId = {
    productId: id,
  };

  if (quantity > 1) {
    const { ok } = await fetch(`${URL_API_SERVER}/cart/lessQuantity`, {
      method: "PUT",
      body: JSON.stringify(objProductId),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());

    if (ok) {
      const { ok, data } = await getOrder();
      if (ok) {
        paintProducts({ products: data.cart });
        paintTotal(data.total);
      }
    }
  }
};

const removeProductToCart = async (id) => {
  try {
    const result = await Swal.fire({
      title: "¿Estas seguro de quitar el producto?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Quitar",
    });

    if (result.isConfirmed) {
      const objProductId = {
        productId: id,
      };
      const { ok } = await fetch(`${URL_API_SERVER}/cart/removeProduct`, {
        method: "DELETE",
        body: JSON.stringify(objProductId),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());

      if (ok) {
        const { ok, data } = await getOrder();
        if (ok) {
          paintProducts({ products: data.cart });
          paintTotal(data.total);
        }

        Swal.fire({
          title: "Producto eliminado del carrito",
          icon: "success",
          showConfirmButton: false,
          timer: 800,
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

clearCart.addEventListener("click", async () => {
  try {
    const result = await Swal.fire({
      title: "¿Estas seguro de borrar todo el carrito?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Quitar",
    });

    if (result.isConfirmed) {
      const { ok } = await fetch(`${URL_API_SERVER}/cart/clearCart`, {
        method: "DELETE",
      }).then((res) => res.json());

      if (ok) {
        const { ok, data } = await getOrder();

        if (ok) {
          paintProducts({ products: data.cart });
          paintTotal(data.total);
        }

        Swal.fire({
          title: "Proceso completado",
          icon: "success",
          showConfirmButton: false,
          timer: 1400,
        })
      }
    }
  } catch (error) {
    console.log(error)
  }
});

btnBuy.addEventListener("click", async () => {
  const result = await Swal.fire({
    title: "¿Estas seguro realizar la compra?",
    icon: "info",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Confirmar",
  });

  if (result.isConfirmed) {
    const { ok } = await fetch(`${URL_API_SERVER}/cart/statusOrder`, {
      method: "PUT",
      body: JSON.stringify({ status: "completed" }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());

    let timerInterval;
    const result = await Swal.fire({
      title: "Procesando la compra",
      text: "Esperar mientras se realiza la compra",
      timer: 5000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
        const b = Swal.getHtmlContainer().querySelector("b");
        timerInterval = setInterval(() => {
          b.textContent = Swal.getTimerLeft();
        }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    });

    if (result.dismiss === Swal.DismissReason.timer) {
      
      await Swal.fire({
        title: ok ? "Gracias por su compra" : "Upss hubo error",
        icon: ok ? 'success': 'error',
        showConfirmButton:false,
        timer:1000
      })

      ok && (location.href = "/")

    }
  }
});
