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
function togglePasswordVisibility2() {
  var passwordInput = document.getElementById("password2");
  var eyeIcon = document.getElementById("eye-icon2");

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
        case this.value.length < 2 || this.value.trim().length > 20:
            msgError('errorName','Mímino 2 caracteres',e)
            break;
        case !regExLetter.test(this.value.trim()):
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
     case this.value.length < 2 || this.value.trim().length > 20:
         msgError('errorSurname','Mímino 2 caracteres',e)
         break;
     case !regExLetter.test(this.value.trim()):
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
    get('msgPass').hidden = true;

      switch (true) {
        case !this.value.trim():
        msgError("errorPass", "La contraseña es obligatorio", e);
        break;
        case !regExPass.test(this.value.trim()):
        msgError("errorPass",
        "Debe ser entre 6 y 12 caracteres y tener una mayúscula, una minúscula, carácter especial y un número",e);
        break;
        default:
        this.classList.add("isValid");
        break;
  }
    })
    password.addEventListener('focus',function(e){
        cleanError('errorPass', e);
        get("msgPass").hidden = false;
        })

        const exRegs = {
            exRegMayu: /[A-Z]/,
            exRegMinu: /[a-z]/,
            exRegNum: /[0-9]/,
            exRegEsp: /[$@!%*?&_-]/,
            exRegMin: /.{6,}/,
            exRegMax: /.{13}/,
          };
          
          const validPassword = (element, exReg, value) => {
            if (!exReg.test(value)) {
              get(element).classList.add("text-danger");
            } else {
              get(element).classList.add("text-success");
              get(element).classList.remove("text-danger");
            }
          };
          
          const validMaxPassword = (element, exReg, value) => {
            if (exReg.test(value)) {
              get(element).classList.add("text-danger");
            } else {
              get(element).classList.add("text-success");
              get(element).classList.remove("text-danger");
            }
          };
        
          password.addEventListener("keyup", function () {
            validPassword("mayu", exRegs.exRegMayu, this.value);
            validPassword("minu", exRegs.exRegMinu, this.value);
            validPassword("num", exRegs.exRegNum, this.value);
            validPassword("esp", exRegs.exRegEsp, this.value);
            validPassword("min", exRegs.exRegMin, this.value);
            validMaxPassword("max", exRegs.exRegMax, this.value);
          });
//validaciones pass 2
          password2.addEventListener("blur", function (e) {
            switch (true) {
              case !this.value.trim():
                msgError("errorPass2", "Debes confirmar la contraseña", e);
                break;
              case this.value.trim() !== password.value.trim():
                msgError("errorPass2", "La confirmación no coincide", e);
                break;
              default:
                this.classList.add("isValid");
                break;
            }
          });

          password2.addEventListener("focus", function (e) {
            cleanError("errorPass2", e);
          });
    //validacion de terminos y politicas
    get("terms").addEventListener("click", function (e) {
        this.classList.remove("isInvalid");
        get("error-terms").innerHTML = null;
      });

    //validaciones del formulario 
    form.addEventListener('submit',function(e){

        e.preventDefault();
        let error = false;

        if (!get("terms").checked) {
        error = true;
        get("error-terms").innerHTML = "Debes aceptar las bases y condiciones";
        get("terms").classList.add("isInvalid");
         }

        for (let i = 0; i < this.elements.length - 2; i++) {
            if (
              !this.elements[i].value.trim() ||
              this.elements[i].classList.contains("isInvalid")
            ) {
              error = true;
              this.elements[i].classList.add("isInvalid");
              get("error-form").innerHTML = "Hay campos con errores o están vacíos";
            }
        }

        !error && this.submit();
    })
})