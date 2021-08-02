
function Validator(options){
 
  function validate(inputElement,rule){

    let errorMessage = rule.test(inputElement.value);

    let errorElemnt = inputElement.parentElement.querySelector(options.errorselector)
    
    if(errorMessage){

      errorElemnt.innerText = errorMessage;

      inputElement.parentElement.classList.add('invalid');

    } else {

      errorElemnt.innerText ='';

      inputElement.parentElement.classList.remove('invalid');

    }

  }
  let formElement = document.querySelector(options.form);
  if (formElement) {  
    options.rules.forEach(function (rule){
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


Validator.isRequired = function(selector,max){
  return {
    selector: selector,
    
    test: function(value){
      let regex_fullname = /^[a-zA-Z]{3,}(?: [a-zA-Z]+){0,2}$/;
      let valueTrim = value.trim();
      console.log(valueTrim);
      if(valueTrim.length == 0)
      {
        return 'Vui lòng nhập fullname';
      }
      if(valueTrim.length>max){
        return `Vui lòng nhập full name ít hơn ${max} ký tự`
      }
      var splitStr = value.toLowerCase().split(' ');
      for (var i = 0; i < splitStr.length; i++) {
          splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);   
      }
      // value=splitStr;
      // console.log(value);
      console.log(splitStr);
      return regex_fullname.test(value) ? undefined : "Vui lòng nhập full name hợp lệ";
    }
  };
}

Validator.isEmail = function(selector){
  return {
    selector: selector,
    test: function(value){
      let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      // let regex_gmail =/([a-zA-Z0-9]+)([\.{1}])?([a-zA-Z0-9]+)\@runsystem([\.])net/g;
      // let regex_gmail =/([a-zA-Z0-9]+)([\.{1}])?([a-zA-Z0-9]+)\@gmail([\.])com/g;
      value.trim();
      value.toLowerCase;
      console.log(value);
      return regex.test(value) ? undefined : "Vui lòng nhập email hợp lệ";
    }
  };
}

Validator.isPhone = function(selector,min){
  return {
    selector: selector,
    test: function(value){
      let regex_phone = /^0\d{9}$/;
      if(value.length == 0)
      {
        return "Vui lòng nhập phone"
      }
      return regex_phone.test(value) ? undefined : `Vui lòng nhập số điện thoại hợp lệ`;
    }
  };
}

Validator.isBirthday = function(selector){
  return {
    selector: selector,
    test: function(value){
    let regex_birthday =/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
    var parts = value.split("/");
    var month1 = parseInt(parts[1], 10);
    var day1 = parseInt(parts[0], 10);
    var year1 = parseInt(parts[2], 10);
    console.log(day1);
    console.log(month1);
    console.log(year1);
    var date = new Date();
    var day_now = date.getDay();
    var month_now = date.getMonth();
    var year_now = date.getFullYear();
    if(year1>year_now){
      return `Vui lòng nhập năm sinh hợp lệ`;
    } 
    // if(month1>=month_now ){
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
    console.log(day_now);
    console.log(month_now);
      console.log(year_now);
      if(value.length == 0){
        return "Vui lòng nhập birthday";
      }
      return regex_birthday.test(value) ? undefined : `Vui lòng nhập birthday hợp lệ`;
    }
  };
}

Validator.isPassword = function(selector,min,max){
  return {
    selector: selector,
    test: function(value){
    let regex_pw=/^([a-zA-Z])(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/;
    var parts = value.split("");
    console.log(parts);
    for (var i = 0; i < parts.length; i++) {
      if (!isNaN(parts[0].charAt(0))) {
       return "Vui lòng nhập ký tự đầu tiên là chữ cái"
      }
      // if (parts[i].match(/[!"#$%&'()*+,-.:;<=>?@[\]^_`{|}~]/)) {
      //   return "Vui lòng nhádasdads"
      // }
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
    return regex_pw.test(value) ? undefined : `Vui lòng nhập mật khẩu bảo mật có chứa ký tự đặc biệt, chữ hoa, chữ thường`;
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