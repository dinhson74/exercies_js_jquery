
function Validator(options){
  let selectorRules = {};
  function validate(inputElement,rule){
    let errorMessage;
    let errorElemnt = inputElement.parentElement.querySelector(options.errorselector)
    let rules = selectorRules[rule.selector];
    for(let i = 0; i < rules.length;i++){
      errorMessage = rules[i](inputElement.value);
      if (errorMessage) break;
    }
    if(errorMessage){
      errorElemnt.innerText = errorMessage;
      inputElement.parentElement.classList.add('invalid');
      } else {
      errorElemnt.innerText ='';
      inputElement.parentElement.classList.remove('invalid');
    }
    return !errorMessage;
  }
  let formElement = document.querySelector(options.form);
  if (formElement) { 
    formElement.onsubmit = function(e){
        e.preventDefault();
        let isFormValue = true;
        options.rules.forEach(function (rule){
        let inputElement = formElement.querySelector(rule.selector);
        let isValid = validate(inputElement,rule);
        if(!isValid){
          isFormValue = false;
        }
      });
      if(isFormValue){
        if(typeof options.onsubmit === 'function'){
          let enableInputs = formElement.querySelectorAll('[name]');
          let formValue = Array.from(enableInputs).reduce(function(values,input){
            values[input.name] = input.value;
            return  values;
          }, {});
          document.getElementById('span1').innerText = formValue;
          options.onsubmit(formValue);
        } else {
          formElement.submit();
        }
      } 
    }
    options.rules.forEach(function (rule){
      if(Array.isArray(selectorRules[rule.selector])){
        selectorRules[rule.selector].push(rule.test);
      } else {
        selectorRules[rule.selector] = [rule.test];
      }
      let inputElement = formElement.querySelector(rule.selector);
      if(inputElement){
        inputElement.onblur = function() {
          validate(inputElement,rule);
        }
        inputElement.oninput = function(){
          let errorElemnt = inputElement.parentElement.querySelector('.form-message')
          errorElemnt.innerText ='';
          inputElement.parentElement.classList.remove('invalid');
        }
      }
    });
  }
}
function empty(value,messageEmpty){
  let valueTrim = value.trim();
  if(valueTrim.length == 0){
    return  messageEmpty;
  }
}
function minLength(value,min,messageMin){
  let valueTrim = value.trim();
  if(valueTrim.length < min){
    return  messageMin;
  }
}
function maxLength(value,max,messageMax){
  let valueTrim = value.trim();
  if(valueTrim.length > max){
    return  messageMax;
  }
}
function regex(value,regex,messageRegex){
  let valueTrim = value.trim();
  return regex.test(value) ?  undefined :messageRegex;
}
function messageError(nameField){
  return `Vui lòng nhập ${nameField} hợp lệ`;
}
let message,messageEmpty ;
Validator.isFullname = function(selector,nameField){
  return {
    selector: selector,
    test: function(value){
      const REGEX_FULLNAME = /^[a-zA-Z]{3,}(?: [a-zA-Z]+){0,2}$/;
      messageRegex = messageError(nameField);
      return regex(value,REGEX_FULLNAME,messageRegex) ;
    }
  };
}
Validator.isEmail = function(selector,nameField){
  return {
    selector: selector,
    test: function(value){
      const REGEX_EMAIL = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      messageRegex = messageError(nameField);
      return regex(value,REGEX_EMAIL,messageRegex);
    }
  };
}
Validator.isPhone = function(selector,nameField){
  return {
    selector: selector,
    test: function(value){
      const REGEX_PHONE = /^0\d{9}$/;
      messageRegex = `Vui lòng nhập ${nameField} hợp lệ`;
      return regex(value,REGEX_PHONE,messageRegex);
    }
  };
}

Validator.isBirthday = function(selector,nameField){
  return {
    selector: selector,
    test: function(value){
      const REGEX_BIRTHDAY =/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
      let parts = value.split("/");
      let year1 = parseInt(parts[2], 10);
      let date = new Date();
      let year_now = date.getFullYear();
      if(year1>year_now){
        return `Vui lòng nhập năm sinh hợp lệ`;
      } 
      messageRegex = `Vui lòng nhập ${nameField} hợp lệ`;
      return regex(value,REGEX_BIRTHDAY,messageRegex);
    }
  }
}

Validator.isPassword = function(selector,nameField){
  return {
    selector: selector,
    test: function(value){
    const REGEX_PASSWORD = /^([a-zA-Z])(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/;
    let parts = value.split("");
    for (let i = 0; i < parts.length; i++) {
      if (!isNaN(parts[0].charAt(0))) {
       return `Vui lòng nhập ${nameField} ký tự đầu tiên là chữ cái`
      }
    }
    messageRegex = `Vui lòng nhập ${nameField} bảo mật có chứa ký tự đặc biệt, chữ hoa, chữ thường`;
    return regex(value,REGEX_PASSWORD,messageRegex);
    }
  };
}
Validator.isCfpassword = function(selector,getConfrimValue,message){
  return {
    selector: selector,
    test: function(value){
      return value === getConfrimValue() ? undefined : message;
    }
  };
}
Validator.isImage = function(selector){
  return {
    selector: selector,
    test: function(value){
      const REGEX_IMAGE= /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i
      messageEmpty = "Vui lòng chọn avata";
      messageRegex = "Vui lòng lấy đúng hình ảnh";
      return empty(value,messageEmpty) || regex(value,REGEX_IMAGE,messageRegex);
    }
  };
}
Validator.empty = function(selector,nameField){
  return {
    selector: selector,
    test: function(value){
      return empty(value,`Vui lòng nhập ${nameField}`);
    }
  };
} 
Validator.maxLength = function(selector,max,nameField){
  return {
    selector: selector,
    test: function(value){
      messageMax = `Vui lòng nhập ${nameField} không quá ${max} ký tự`;
      return maxLength(value,max,messageMax);
    }
  };
} 
Validator.minLength = function(selector,min,nameField){
  return {
    selector: selector,
    test: function(value){
      messageMax = `Vui lòng nhập ${nameField} ít nhất ${min} ký tự`;
      return minLength(value,min,messageMax);
    }
  };
} 
Validator({
  form: '#form-signup',
  errorselector: '.form-message',
  rules: [
    // fulname || isFullname is regex value
    Validator.empty('#fname','fullname'), 
    Validator.empty('#email','email'), 
    Validator.empty('#phone','phone'), 
    Validator.empty('#birthday','birthday'),
    Validator.empty('#password','password'),
    Validator.empty('#cfpassword','confirm password'),
    Validator.empty('#chooson','hình ảnh'),
    Validator.maxLength('#fname',50,'fullname'), 
    Validator.maxLength('#password',30,'password'), 
    Validator.minLength('#password',8,'password'), 
    Validator.isFullname('#fname','fullname'),
    Validator.isEmail('#email','email'),
    Validator.isPhone('#phone','phone'),
    Validator.isBirthday('#birthday','birthday'),
    Validator.isPassword('#password','password'),
    Validator.isCfpassword('#cfpassword',function(){
      return document.querySelector('#form-signup #password').value;
    }, "Mật khẩu nhập lại không chính xác"),
    Validator.isImage('#chooson'),
  ],
  onsubmit: function(data){
    let splitStr = data['fname'].toLowerCase().split(' ');
      for (let i = 0; i < splitStr.length; i++) {
          splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);   
        }
    document.getElementById('span1').innerHTML = splitStr.join(' ');
    document.getElementById('span2').innerText = data['email'];
    document.getElementById('span3').innerText = data['phone'];
    document.getElementById('span4').innerText = data['birthday'];
    readFile(selectedFile,"img5");
  }, 
});
let selectedFile;
function onFileSelected(event) {
  selectedFile = event.target.files[0];
  readFile(selectedFile,"myimage");
}
function readFile(selectedFile,elementId){
  let reader = new FileReader();
  let imgtag = document.getElementById(elementId);
  imgtag.title = selectedFile.name;
  reader.onload = function(event) {
    imgtag.src = event.target.result;
  };
  reader.readAsDataURL(selectedFile);
}

input = document.getElementById("phone");
input.addEventListener("keyup", function(event) {
    if (event.keyCode === 16) {
        event.preventDefault();
        document.getElementById("reset").click();
    }
});
input = document.getElementById("fname");
input.addEventListener("keyup", function(event) {
    if (event.keyCode === 16) {
        event.preventDefault();
        document.getElementById("reset").click();
    }
});
input = document.getElementById("email");
input.addEventListener("keyup", function(event) {
    if (event.keyCode === 16) {
        event.preventDefault();
        document.getElementById("reset").click();
    }
});
// input = document.getElementById("password");
// input.addEventListener("keyup", function(event) {
//     if (event.keyCode === 16) {
//         event.preventDefault();
//         document.getElementById("reset").click();
//     }
// });
// input = document.getElementById("cfpassword");
// input.addEventListener("keyup", function(event) {
//     if (event.keyCode === 16) {
//         event.preventDefault();
//         document.getElementById("reset").click();
//     }
// });
input = document.getElementById("birthday");
input.addEventListener("keyup", function(event) {
    if (event.keyCode === 16) {
        event.preventDefault();
        document.getElementById("reset").click();
    }
});
