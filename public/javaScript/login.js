function togglePasswordVisibility() {
    var passwordInput = document.getElementById("password");
    var eyeIcon = document.getElementById("eye-icon");

    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      eyeIcon.className = "fa fa-eye-slash";
    } else {
      passwordInput.type = "password";
      eyeIcon.className = "fa fa-eye";
    }
  }
  
window.addEventListener('load',function(){
    //form & inputs

    const get = (element)=>document.getElementById(element);
    const email = get('email')
    const password = get('password');
    const form = get('form');

    //expresiones regulares 
    const regExpEmail = /^(([^<>()\[\]\.,;:\s@\”]+(\.[^<>()\[\]\.,;:\s@\”]:+)*)|(\”.+\”))@(([^<>()[\]\.,;:\s@\”]+\.)+[^<>()[\]\.,;:\s@\”]{2,})$/;
    
    //campos invalidos
    const msgError = (element,message, {target}) => {
        get(element).innerHTML = message
        target.classList.add('isInvalid')
    }

    //campos validos
    const cleanError = (element, {target}) => {
        target.classList.remove('isInvalid')
        target.classList.remove('isValid')
        get(element).innerHTML = null
    }

    //validaciones del e-mail
    email.addEventListener('blur',function(e){
       
        if(!this.value.trim()){
            msgError('errorEmail','El email es obligatorio',e)
             }if (!regExpEmail.test(this.value.trim())) {
                msgError('errorEmail','El email tiene un formato incorrecto',e)
            } else {
                this.classList.add('isValid')
            }
    })
   email.addEventListener('focus',function(e){
    cleanError('errorEmail', e)
   })



   //validaciones del password
   password.addEventListener('blur',function(e){
    if(!this.value.trim()){
        msgError('errorPass','La contraseña es obligatoria',e)
    }else{
        this.classList.add('isValid')
    }
    })
    password.addEventListener('focus',function(e){
        cleanError('errorPass', e)
        })


    //validaciones del formulario 
    form.addEventListener('submit',function(e){

        e.preventDefault();
        let error = false;
        for (let i = 0; i < this.elements.length -1; i++) {
            if (!this.elements[i].value.trim() || this.elements[i].classList.contains('isInvalid')) {
                error = true
            }
        }
   
        !error && this.submit()

    })
})