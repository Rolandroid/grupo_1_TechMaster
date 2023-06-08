const $ = (el) => document.querySelector(el);
const btnPrev = $("#btn-prev");
const btnNext = $("#btn-next");
// const selectLimit = $("#select-limit");
const containerItemsPage = $("#container-items-page");
const containerProductsCard = $("#container-courses-card");
const idUser = document.body.getAttribute("data-idUser");
const URL_API_SERVER = "http://localhost:3000/api";

let pageActive = 1;
const apiGetProducts = "http://localhost:3000/api/products/paginate";

const backgrounds = [
  "linear-gradient(-229deg, #fbd52d, #ef3a7c)",
  "linear-gradient(-229deg, #FF70AF, #5fa8f5)",
  "linear-gradient(-229deg, #0cebeb, #29ffc6)",
  "linear-gradient(-229deg, #88F7F9, #048FFF)",
  "linear-gradient(-229deg, #0093E9, #80D0C7)",
  "linear-gradient(-229deg, #cf91ff, #5782F5)",
  "linear-gradient(-229deg, #642B73, #C6426E)"
];

const getProducts = ({ page = 1, limit = 6 } = {}) =>
  fetch(`${apiGetProducts}?page=${page}&limit=${limit}`).then((res) =>
    res.json()
  );

const paintProducts = (products) => {
  containerProductsCard.innerHTML = "";
  products.forEach(
    ({ id, images, name, discount, price /* usersFavorites */ }) => {
      const priceWithDiscount = discount
        ? price - (price * discount) / 100
        : price;
      const priceFormatARG = priceWithDiscount.toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS",
      });
      const template = `
      <article class="articleResultados" style="background:${backgrounds[Math.floor(Math.random() * 7)]}">
      <span>
        <img src="/Images/products/${
          images.length ? images[0].name : "default-image.png"
        }"></img>
      </span>
      <div>
          <h3>${name}</h3>
        <div class="precioYOferta">
          <h4>${discount ? discount + " % OFF" : ""}</h4>
          <h2>${priceFormatARG}</h2>
        </div>
        <div>
          <a href="/products/detalle/${id}"><button>DETALLES</button></a>
          <a><button onclick="addProductToCart(${id})">ADQUIRIR</button></a>
        </div>
      </div>
    </article>
      `;
      containerProductsCard.innerHTML += template;
    }
  );
};

const getPage = async (page) => {
  pageActive = page;
  const { pages, currentPage, data } = await getProducts({ page, limit: 6 });
  visualImpact({ pages, currentPage, products: data });
};

const paintItemsPage = ({ numberPages, itemActive }) => {
  containerItemsPage.innerHTML = "";
  const visiblePages = 3;
  let startPage = Math.max(itemActive - Math.floor(visiblePages / 2), 1);
  let endPage = Math.min(startPage + visiblePages - 1, numberPages);

  if (endPage - startPage < visiblePages - 1) {
    startPage = Math.max(endPage - visiblePages + 1, 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    containerItemsPage.innerHTML += `
      <li class="page-item ${itemActive == i && "active"}">
        <button class="page-link" onclick="getPage(${i})">${i}</button>
      </li>
    `;
  }
};

const statusPrevAndNext = ({ currentPage, pages }) => {
  if (currentPage == pages) {
    btnNext.hidden = true;
  } else {
    btnNext.hidden = false;
  }

  if (currentPage == 1) {
    btnPrev.hidden = true;
  } else {
    btnPrev.hidden = false;
  }
};

const visualImpact = async ({ pages, currentPage, products }) => {
  paintProducts(products);
  paintItemsPage({ numberPages: pages, itemActive: currentPage });
  statusPrevAndNext({ currentPage, pages });

  if (currentPage === 1) {
    btnPrev.style.display = "none";
  } else {
    btnPrev.style.display = "inline-block";
  }

  if (currentPage === pages) {
    btnNext.style.display = "none";
  } else {
    btnNext.style.display = "inline-block";
  }
};

window.addEventListener("load", async () => {
  try {
    const { pages, currentPage, data } = await getProducts();
    visualImpact({ pages, currentPage, products: data });
  } catch (error) {
    console.log(error);
  }
});

const handleEventPrevNext = (btnElement, { isNext = false } = {}) => {
  btnElement.addEventListener("click", async () => {
    try {
      const { pages, currentPage, data } = await getProducts({
        page: isNext ? ++pageActive : --pageActive,
        limit: 6,
      });
      visualImpact({ pages, currentPage, products: data });
    } catch (error) {
      console.log(error);
    }
  });
};

handleEventPrevNext(btnNext, { isNext: true });
handleEventPrevNext(btnPrev);

const addProductToCart = async (id) => {
  try {
    if (!idUser) {
      await Swal.fire({
        title: "Debes iniciar sesión",
        icon: "info",
        showConfirmButton: false,
        timer: 1200,
      });
      location.href = "/users/login";
      return;
    }

    const objProductId = {
      productId: id,
    };
    const { ok } = await fetch(`${URL_API_SERVER}/cart/addProduct`, {
      method: "POST",
      body: JSON.stringify(objProductId),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());

    await Swal.fire({
      title: ok
        ? "Producto agregado al carrito"
        : "El producto no puedo agregarse",
      icon: ok ? "success" : "error",
      showConfirmButton: false,
      timer: 1200,
    });
  } catch (error) {
    console.log(error);
  }
};

const toggleProductFavorite = async (id, event) => {
  try {
    if (!idUser) {
      await Swal.fire({
        title: "Debes iniciar sesión",
        icon: "info",
        showConfirmButton: false,
        timer: 800,
      });
      location.href = "/users/login";
      return;
    }

    const objCourseId = {
      courseId: id,
    };
    const {
      data: { isRemove },
    } = await fetch(`${URL_API_SERVER}/favorites/toggle`, {
      method: "PUT",
      body: JSON.stringify(objCourseId),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());

    if (isRemove) {
      event.target.classList.remove("fas");
      event.target.classList.add("far");
    } else {
      event.target.classList.remove("far");
      event.target.classList.add("fas");
    }
  } catch (error) {
    console.log(error);
  }
};
