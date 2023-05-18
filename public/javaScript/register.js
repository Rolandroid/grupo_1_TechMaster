window.addEventListener('load',function(){
    //form & inputs
    
    const get = (element)=>document.getElementById(element);
    const name = get('name');
    const surname = get('surname');
    const email = get('email')
    const password = get('password');
    const password2 = get('password2');
    const form = get('form');

    //expresiones regulares 
    const regExpEmail = /^(([^<>()\[\]\.,;:\s@\”]+(\.[^<>()\[\]\.,;:\s@\”]:+)*)|(\”.+\”))@(([^<>()[\]\.,;:\s@\”]+\.)+[^<>()[\]\.,;:\s@\”]{2,})$/;
    let regExLetter = /^[A-Z]+$/i;
    let regExPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,12}$/; // Mayúscula, número y 8 a 12 caracteres
    let regExPass2 = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&_-])[A-Za-z\d$@$!%*?&_-]{6,12}/;


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
    
    //validaciones del name
    name.addEventListener('blur',function(e){
       
       switch(true){
        case !this.value.trim():
            msgError('errorName','El nombre es obligatorio',e)
            break;
        case e.this.value.length > 2:
            msgError('errorName','Mímino 2 caracteres',e)
            break;
        case regExLetter.test(e.this.value):
            msgError('errorName','Solo caracteres alfabéticos',e)
            break;    
        default:
            this.classList.add('isValid')
       }
        })
    name.addEventListener('focus',function(e){
        cleanError('errorName', e)
    })
   
    //validaciones del surname
    surname.addEventListener('blur',function(e){
       
    switch(true){
     case !this.value.trim():
         msgError('errorSurname','El apellido es obligatorio',e)
         break;
     case e.this.value.length > 2:
         msgError('errorSurname','Mímino 2 caracteres',e)
         break;
     case regExLetter.test(e.this.value):
         msgError('errorSurname','Solo caracteres alfabéticos',e)
         break;    
     default:
         this.classList.add('isValid')
    }
    })
    surname.addEventListener('focus',function(e){
    cleanError('errorSurname', e)
    })

    //validaciones del e-mail
    const verifyEmail = async (email) => {
        try {
            let response = await fetch("/api/users/verify-email",{
                method: "POST",
                body: JSON.stringify({email : email}),
                header : {
                    "Content-Type" : "application/json"
                }
            });
            let result = await response.json();
            console.log(response);
            return result.data.existUser
        } catch (error) {
            console.error
        }
    }
    email.addEventListener('blur', async function (e) {
        switch (true) {
          case !this.value.trim():
            msgError('errorEmail', 'El email es obligatorio', e);
            break;
          case !regExpEmail.test(this.value.trim()):
            msgError('errorEmail', 'Debe ser un email con formato válido', e);
            break;
          case await verifyEmail(this.value.trim()):
            msgError('errorEmail', 'El email ya se encuentra registrado', e)
            break
          default:
            this.classList.add('isValid');
            break;
        }
      });
      
      email.addEventListener('focus', function (e) {
        cleanError('errorEmail', e);
      });
      



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