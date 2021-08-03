
function Validator(options){
  var selectorRules ={};
  function validate(inputElement,rule){
    let errorMessage;
    let errorElemnt = inputElement.parentElement.querySelector(options.errorselector)
    let rules = selectorRules[rule.selector];
    for(var i =0; i<rules.length;i++){
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
        var isFormValue = true;
        options.rules.forEach(function (rule){
        let inputElement = formElement.querySelector(rule.selector);
        var isValid=validate(inputElement,rule);
        if(!isValid){
          isFormValue = false;
        }
      });
      if(isFormValue){
        if(typeof options.onsubmit === 'function'){
          var enableInputs = formElement.querySelectorAll('[name]');
          var formValue = Array.from(enableInputs).reduce(function(values,input){
            values[input.name] = input.value;
            return  values;
          }, {});
          console.log(formValue);
          document.getElementById('span1').innerText =formValue;
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
    console.log(selectorRules);
  }
}
Validator.isRequired = function(selector,max){
  return {
    selector: selector,
    test: function(value){
      const REGEX_FULLNAME = /^[a-zA-Z]{3,}(?: [a-zA-Z]+){0,2}$/;
      let valueTrim = value.trim();
      if(valueTrim.length == 0)
      {
        return 'Vui lòng nhập fullname';
      }
      if(valueTrim.length>max){
        return `Vui lòng nhập full name ít hơn ${max} ký tự`
      }
      
      return REGEX_FULLNAME.test(value) ? undefined : "Vui lòng nhập full name hợp lệ";
    }
  };
}
Validator.isEmail = function(selector){
  return {
    selector: selector,
    test: function(value){
      const REGEX_EMAIL = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      value.trim();
      value.toLowerCase;
      if(value.length == 0){
        return "Vui lòng nhập email"
      }
      return REGEX_EMAIL.test(value) ? undefined : "Vui lòng nhập email hợp lệ";
    }
  };
}

Validator.isPhone = function(selector,min){
  return {
    selector: selector,
    test: function(value){
      const REGEX_PHONE = /^0\d{9}$/;
      if(value.length == 0)
      {
        return "Vui lòng nhập phone"
      }
      return REGEX_PHONE.test(value) ? undefined : `Vui lòng nhập số điện thoại hợp lệ`;
    }
  };
}

Validator.isBirthday = function(selector){
  return {
    selector: selector,
    test: function(value){
    const REGEX_BIRTHDAY =/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
    let parts = value.split("/");
    let month1 = parseInt(parts[1], 10);
    let day1 = parseInt(parts[0], 10);
    let year1 = parseInt(parts[2], 10);
    let date = new Date();
    let day_now = date.getDay();
    let month_now = date.getMonth();
    let year_now = date.getFullYear();
    if(year1>year_now){
      return `Vui lòng nhập năm sinh hợp lệ`;
    } 
    // if(month1>month_now & year1>year_now){
    //   return `Vui lòng nhập tháng sinh hợp lệ`;
    // } 
    // if(day1>day_now){
    //   return `Vui lòng nhập ngày sinh hợp lệ`;
    // } 
    // if(month_now<=month){
    //   return `Vui lòng nhập tháng hợp lệ`;
    // } 
    // if(day_now<=day){
    //   return `Vui lòng nhập ngày hợp lệ`;
    // } 
    // console.log(day_now);
    // console.log(month_now);
    // console.log(year_now);
      if(value.length == 0){
        return "Vui lòng nhập birthday";
      }
      return REGEX_BIRTHDAY.test(value) ? undefined : `Vui lòng nhập birthday hợp lệ`;
    }
  };
}

Validator.isPassword = function(selector,min,max){
  return {
    selector: selector,
    test: function(value){
    const REGEX_PASSWORD=/^([a-zA-Z])(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/;
    var parts = value.split("");
    // console.log(parts);
    for (var i = 0; i < parts.length; i++) {
      if (!isNaN(parts[0].charAt(0))) {
       return "Vui lòng nhập ký tự đầu tiên là chữ cái"
      }
      }
      if(value.length == 0){
        return "Vui lòng nhập password";
      }
      if(value.length < min){
        return `Vui lòng nhập password có ít nhất ${min} ký tự`;
      }
      if(value.length > max){
        return `Vui lòng nhập password có ít hơn ${max} ký tự`;
      }
    return REGEX_PASSWORD.test(value) ? undefined : `Vui lòng nhập mật khẩu bảo mật có chứa ký tự đặc biệt, chữ hoa, chữ thường`;
    }
  };
}

Validator.isCfpassword = function(selector,getConfrimValue,message){
  return {
    selector: selector,
    test: function(value){
      if(value.length == 0){
        return "Vui lòng nhập lại mật khẩu"
      }
      return value === getConfrimValue() ? undefined : message;
    }
  };
}
Validator.isImage = function(selector){
  return {
    selector: selector,
    test: function(value){
      if(value.length == 0){
        return "Vui lòng chọn avata";
      }
    }
  };
}
Validator({
  form: '#form-signup',
  errorselector: '.form-message',
  rules: [
    Validator.isRequired('#fname',50),
    Validator.isEmail('#email'),
    Validator.isPhone('#phone',10),
    Validator.isBirthday('#birthday'),
    Validator.isPassword('#password',8,30),
    Validator.isCfpassword('#cfpassword',function(){
      return document.querySelector('#form-signup #password').value;
    }, "Mật khẩu nhập lại không chính xác"),
    Validator.isImage('#chooson'),
  ],
  onsubmit: function(data){
    let splitStr = data['fname'].toLowerCase().split(' ');
      for (var i = 0; i < splitStr.length; i++) {
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
  var reader = new FileReader();
  var imgtag = document.getElementById(elementId);
  imgtag.title = selectedFile.name;
  reader.onload = function(event) {
    imgtag.src = event.target.result;
  };
  reader.readAsDataURL(selectedFile);
}
var input = document.getElementById("phone");
input.addEventListener("keyup", function(event) {
    if (event.keyCode === 16) {
        event.preventDefault();
        document.getElementById("reset").click();
    }
});
var input = document.getElementById("fname");
input.addEventListener("keyup", function(event) {
    if (event.keyCode === 16) {
        event.preventDefault();
        document.getElementById("reset").click();
    }
});
var input = document.getElementById("email");
input.addEventListener("keyup", function(event) {
    if (event.keyCode === 16) {
        event.preventDefault();
        document.getElementById("reset").click();
    }
});
var input = document.getElementById("password");
input.addEventListener("keyup", function(event) {
    if (event.keyCode === 16) {
        event.preventDefault();
        document.getElementById("reset").click();
    }
});
var input = document.getElementById("cfpassword");
input.addEventListener("keyup", function(event) {
    if (event.keyCode === 16) {
        event.preventDefault();
        document.getElementById("reset").click();
    }
});
var input = document.getElementById("birthday");
input.addEventListener("keyup", function(event) {
    if (event.keyCode === 16) {
        event.preventDefault();
        document.getElementById("reset").click();
    }
});