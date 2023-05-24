window.addEventListener('load',function(){
    //form & inputs
    const $ = (element)=>document.getElementById(element);
    const CreationForm = $('CreationForm')
    const name = $('name')
    const category = $('category');
    const visible = $('visible');
    const price = $('price');
    const discount = $('discount');
    const images = $('images');
    const resetear = $('resetear');
    const crear = $('crear');
    const description = $('description');

    //campos invalidos
    const msgError = (element,message, {target}) => {
      $(element).innerHTML = message
      target.classList.add('isInvalid')
  }

  //campos validos
  const cleanError = (element, {target}) => {
      target.classList.remove('isInvalid')
      target.classList.remove('isValid')
      $(element).innerHTML = null
  }

    name.addEventListener('blur',function(e){
       
      switch(true){
       case !this.value.trim():
           msgError('errorName','El nombre es obligatorio',e)
           break;
       case this.value.length < 5 || this.value.trim().length > 20:
           msgError('errorName','Mímino 5 caracteres',e)
           break;
       default:
           this.classList.add('isValid')
      }
       })
   name.addEventListener('focus',function(e){
       cleanError('errorName', e)
   })

   price.addEventListener('blur', function (event) {
    if (!this.value) {
      msgError('errorPrice', "El precio es obligatorio", event)
    }else if(this.value < 1){
      msgError('errorPrice', "El precio tiene que ser mayor a 0", event)
    } else {
      this.classList.add('is-valid')
    }
  })
  
  price.addEventListener('focus', function () {
    cleanError('errorDescription', event)
  })

  discount.addEventListener('blur', function (event) {
    if(this.value < 0 || this.value > 100 ){
      msgError('errorDiscount', "El descuento tiene que ser entre 0 y 100", event)
    } else {
      this.classList.add('is-valid')
    }
  })

  discount.addEventListener('focus', function () {
    cleanError('errorDiscount', event)
  })
  
  description.addEventListener('blur', function (event) {
    if (!this.value) {
      msgError('errorDescription', "La descripción es obligatoria", event);
    } else {
      var descriptionLength = this.value.length; // Get the length of the description
      if (descriptionLength < 100 || descriptionLength > 500) {
        msgError('errorDescription', "Debe tener entre 100 y 500 caracteres", event);
      } else {
        this.classList.add('is-valid');
      }
    }
  });
  
  description.addEventListener('focus', function () {
    cleanError('errorDescription', event)
  })
  
  


  const regExExt = /(.jpg|.jpeg|.png|.gif|.webp)$/i;

    images.addEventListener('change', function (e) {
      $('btnImages').innerText = "Agregar imágenes"
      switch (true) {
        case !regExExt.exec(this.value):
          $('errorImages').innerHTML = "Solo se admiten imágenes jpg | jpeg | png | gif | webp"
          $('boxImagesPreview').innerHTML = null;

          break;
        case this.files.length !== 3: $
          $('errorImages').innerHTML = "Tienen que ser 3 imágenes"
          $('boxImagesPreview').innerHTML = null;

          break;

        default:             
          cleanError('errorImages', event);
        $('btnImages').innerText = "Cambiar imágenes";
        $('btnImages').classList.remove('btn-danger')
          if(this.files){
            [].forEach.call(this.files,readAndPreview);
          }

          function readAndPreview(file) {
            let reader = new FileReader()
            $('boxImagesPreview').innerHTML = null;
            reader.addEventListener('load', function(){
              let image = new Image();
              image.height = 100;
              image.title = file.name;
              image.src = this.result;
              $('boxImagesPreview').appendChild(image)
            })
            reader.readAsDataURL(file)
          }


          break;
      }
    })

  



})
