
function Validator(options){

  function validate(inputElement,rule){

    var errorMessage = rule.test(inputElement.value);

    var errorElemnt = inputElement.parentElement.querySelector(options.errorselector)
    
    if(errorMessage){

      errorElemnt.innerText = errorMessage;

      inputElement.parentElement.classList.add('invalid');

    } else {

      errorElemnt.innerText ='';

      inputElement.parentElement.classList.remove('invalid');

    }

  }
  var formElement = document.querySelector(options.form);
  if (formElement) {  
    options.rules.forEach(function (rule){
      var inputElement = formElement.querySelector(rule.selector);
      if(inputElement){
        inputElement.onblur = function() {
          validate(inputElement,rule);
        }
        inputElement.oninput = function(){
          var errorElemnt = inputElement.parentElement.querySelector('.form-message')
          errorElemnt.innerText ='';
          inputElement.parentElement.classList.remove('invalid');
        }
      }
    });
  }
}


Validator.isRequired = function(selector,max){
  return {
    selector: selector,
    
    test: function(value){
      if(value.length == 0)
      {
        return "Vui lòng nhập email hợp lssdsdệ";
      }
      if(value.length>=max){
        return "vui long it hon 50 ky tu"
      }
      let first = 0;
      for(let i=0;i<value.length;i++){
        
      }
    }
  };
}

Validator.isEmail = function(selector){
  return {
    selector: selector,
    test: function(value){
      let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      // var regex_gmail =/([a-zA-Z0-9]+)([\.{1}])?([a-zA-Z0-9]+)\@runsystem([\.])net/g;
      // var regex_gmail =/([a-zA-Z0-9]+)([\.{1}])?([a-zA-Z0-9]+)\@gmail([\.])com/g;
      return regex.test(value) ? undefined : "Vui lòng nhập email hợp lệ";
    }
  };
}

Validator.isPhone = function(selector,min){
  return {
    selector: selector,
    test: function(value){
      var regex_phone = /^0\d{9}$/;
      return regex_phone.test(value) ? undefined : `Vui lòng nhập số điện thoại hợp lệ`;
      // return value.length  >=10 ? undefined : `Vui lòng nhập số điện thoại hợp lệ` ;
    }
  };
}

Validator.isBirthday = function(selector){
  return {
    selector: selector,
    test: function(value){
      return value ? undefined : `Vui lòng nhập birthday`;
    }
  };
}

Validator.isPassword = function(selector,min,max){
  return {
    selector: selector,
    test: function(value){
      if(value.length < min){
        value.length <= min ? underfined : `sss`;
      }
    // return value.length >= min ? undefined : `Vui lòng nhập tối thiểu ${min}`  value.length <= max ? undefined : `Vui lòng nhập tối thiểu ${min} ${max} ký tự`;
    }
  };
}

Validator.isCfpassword = function(selector){
  return {
    selector: selector,
    test: function(){

    }
  };
}