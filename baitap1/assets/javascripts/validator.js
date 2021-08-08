function Validator(options) {
  let selectorRules = {};
  function validate(inputElement, rule) {
    let errorMessage;
    let errorElemnt = inputElement.parentElement.querySelector(options.errorSelector)
    let rules = selectorRules[rule.selector];
    for (let i = 0; i < rules.length; i++) {
      errorMessage = rules[i](inputElement.value);
      if (errorMessage) break;
    }
    if (errorMessage) {
      errorElemnt.innerText = errorMessage;
      inputElement.parentElement.classList.add('invalid');
    } else {
      errorElemnt.innerText = '';
      inputElement.parentElement.classList.remove('invalid');
    }
    return !errorMessage;
  }
  let formElement = document.querySelector(options.form);
  if (formElement) {
    formElement.onsubmit = function (e) {
      e.preventDefault();
      let isFormValue = true;
      options.rules.forEach(function (rule) {
        let inputElement = formElement.querySelector(rule.selector);
        let isValid = validate(inputElement, rule);
        if (!isValid) {
          isFormValue = false;
        }
      });
      if (isFormValue) {
        if (typeof options.onsubmit === 'function') {
          let enableInputs = formElement.querySelectorAll('[name]');
          let formValue = Array.from(enableInputs).reduce(function (values, input) {
            values[input.name] = input.value;
            return values;
          }, {});
          options.onsubmit(formValue);
        } else {
          formElement.submit();
        }
      }
    }
    let buttonReset = formElement.querySelector('#reset-form');
    let img = formElement.querySelector('#myimage')
    let errorElemnt = formElement.querySelectorAll('.form-message')
    let inputElement = formElement.parentElement.querySelectorAll('input')
    if(buttonReset) {
      buttonReset.click = function(){
        errorElemnt.innerText='';
        if (errorElemnt) {
          errorElemnt[0].innerText  = ''; 
          errorElemnt[1].innerText  = '';
          errorElemnt[2].innerText  = '';
          errorElemnt[3].innerText  = '';
          errorElemnt[4].innerText  = '';
          errorElemnt[5].innerText  = '';
          errorElemnt[6].innerText  = '';
        }
        if(inputElement) {
          inputElement[0].parentElement.classList.remove('invalid');
          inputElement[0].value = '';
          inputElement[1].parentElement.classList.remove('invalid');
          inputElement[1].value = '';
          inputElement[2].parentElement.classList.remove('invalid');
          inputElement[2].value = '';
          inputElement[3].parentElement.classList.remove('invalid');
          inputElement[3].value = '';
          inputElement[4].parentElement.classList.remove('invalid');
          inputElement[4].value = '';
          inputElement[5].parentElement.classList.remove('invalid');
          inputElement[5].value = '';
          img.removeAttribute('src')
          img.title = '';
        }
        spanFullname.innerText ='';
        spanEmail.innerText ='';
        spanPhone.innerText ='';
        spanBirthday.innerText ='';
        img2.src ='';
      }
    }
    options.rules.forEach(function (rule) {
      if (Array.isArray(selectorRules[rule.selector])) {
        selectorRules[rule.selector].push(rule.test);
      }
      else {
        selectorRules[rule.selector] = [rule.test];
      }
      let inputElement = formElement.querySelector(rule.selector);
      if (inputElement) {
        inputElement.onblur = function () {
          validate(inputElement, rule);
        }
        inputElement.oninput = function () {
          let errorElemnt = inputElement.parentElement.querySelector('.form-message')
          errorElemnt.innerText = '';
          inputElement.parentElement.classList.remove('invalid');
        }
      }
    });
  }
}

function empty(value, messageEmpty) {
  let valueTrim = value.trim();
  if (valueTrim.length == 0) {
    return messageEmpty;
  }
}

function regex(value, regex, messageRegex) {
  let valueTrim = value.trim();
  return regex.test(value) ? undefined : messageRegex;
}

function messageError(nameField) {
  return `Vui lòng nhập ${nameField} hợp lệ`;
}

let message, messageEmpty;
Validator.isFullname = function (selector, nameField) {
  return {
    selector: selector,
    test: function (value) {
      const regex_fulname = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s\W|_]+$/;
      messageRegex = messageError(nameField);
      return regex(value, regex_fulname, messageRegex);
    }
  };
}

Validator.isEmail = function (selector, nameField) {
  return {
    selector: selector,
    test: function (value) {
      const regex_email = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      messageRegex = messageError(nameField);
      return regex(value, regex_email, messageRegex);
    }
  };
}

Validator.isPhone = function (selector, nameField) {
  return {
    selector: selector,
    test: function (value) {
      const regex_phone = /^0\d{9}$/;
      messageRegex = messageError(nameField) + " (Ví dụ: 0528693637)";
      return regex(value, regex_phone, messageRegex);
    }
  };
}
Validator.isBirthdayDate = function (selector, nameField) {
  return {
    selector: selector,
    test: function (value) {
      let valueStr = value.toString();
      console.log(valueStr);
      let parts = value.split("/");
      let yearInput = parseInt(parts[2], 10);
      let month = parseInt(parts[1], 10);
      let day = parseInt(parts[0], 10);
      let date = new Date();
      let dayNow = date.getDate();
      let monthNow = date.getMonth() + 1;
      let yearNow = date.getFullYear();
      console.log(month);
      if(yearInput < 1900) {
        return "Chúng tôi chỉ nhận người có năm sinh từ 1900"
      }
      if (yearInput > yearNow) {
        return `Vui lòng nhập năm sinh hợp lệ`;
        
      }
      if((yearInput < yearNow || month <= monthNow) == false) {
        return "Vui lòng nhập tháng sinh hợp lệ"
      }
      if((yearInput < yearNow || month < monthNow || day < dayNow) == false) {
        return "Vui lòng nhập ngày sinh hợp lệ";
      }
    }}}
Validator.isBirthday = function (selector, nameField) {
  return {
    selector: selector,
    test: function (value) {
      const regex_birthday = /^(0?[1-9]|[12][0-9]|3[01])[/](0?[1-9]|1[012])[/]\d{4}$/;
      messageRegex = messageError(nameField) + " ( ví dụ: 03/01/1998)";
      return regex(value, regex_birthday, messageRegex);
    }
  }
}

Validator.isPassword = function (selector, nameField) {
  return {
    selector: selector,
    test: function (value) {
      const regex_password = /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,30}$/;
      let parts = value.split("");
      for (let i = 0; i < parts.length; i++) {
        if (!isNaN(parts[0].charAt(0))) {
          return `Vui lòng nhập ${nameField} ký tự đầu tiên là chữ cái`
        }
      }
      messageRegex = `Vui lòng nhập ${nameField} bảo mật có chứa ký tự đặc biệt, chữ hoa, chữ thường`;
      return regex(value, regex_password, messageRegex);
    }
  };
}
Validator.isCfpassword = function (selector, getConfrimValue, message) {
  return {
    selector: selector,
    test: function (value) {
      return value === getConfrimValue() ? undefined : message;
    }
  };
}
Validator.isImage = function (selector, nameField) {
  return {
    selector: selector,
    test: function (value) {
      const regex_image = /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i;
      messageRegex = messageError(nameField);
      return regex(value, regex_image, messageRegex);
    }
  };
}
Validator.empty = function (selector, nameField) {
  return {
    selector: selector,
    test: function (value) {
      return empty(value, `Vui lòng nhập ${nameField}`);
    }
  };
}
Validator.maxLength = function (selector, max, nameField) {
  return {
    selector: selector,
    test: function (value) {
      const mesage_max = `Vui lòng nhập ${nameField} không quá ${max} ký tự`;
      let valueTrim = value.trim();
      if (valueTrim.length > max) {
        return mesage_max;
      }
    }
  };
}

Validator.minLength = function (selector, min, nameField) {
  return {
    selector: selector,
    test: function (value) {
      const message_min = `Vui lòng nhập ${nameField} ít nhất ${min} ký tự`;
      let valueTrim = value.trim();
      if (valueTrim.length < min) {
        return message_min;
      }
    }
  };
}

Validator({
  form: '#form-signup',
  errorSelector: '.form-message',
  rules: [
    // fullname
    Validator.empty('#fname', 'fullname'),
    Validator.maxLength('#fname', 50, 'fullname'),
    Validator.isFullname('#fname', 'fullname'),
    // email
    Validator.empty('#email', 'email'),
    Validator.isEmail('#email', 'email'),
    // phone
    Validator.empty('#phone', 'phone'),
    Validator.maxLength('#phone', 10, 'phone'),
    Validator.isPhone('#phone', 'phone'),
    // birthdays
    Validator.empty('#birthday', 'birthday'),
    Validator.isBirthday('#birthday', 'birthday'),
    Validator.isBirthdayDate('#birthday'),
    // password
    Validator.empty('#password', 'password'),
    Validator.maxLength('#password', 30, 'password'),
    Validator.minLength('#password', 8, 'password'),
    Validator.isPassword('#password', 'password'),
    // confirm password
    Validator.empty('#cfpassword', 'confirm password'),
    Validator.isCfpassword('#cfpassword', function () {
      return document.querySelector('#form-signup #password').value;
    }, "Mật khẩu nhập lại không chính xác"),
    // image
    Validator.empty('#chooson', 'hình ảnh'),
    Validator.isImage('#chooson', 'hình ảnh'),
  ],
  onsubmit: function (data) {
    let splitStr = data['fname'].toLowerCase().split(' ');
    for (let i = 0; i < splitStr.length; i++) {
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    document.getElementById('result-fname').innerHTML = splitStr.join(' ');
    document.getElementById('result-email').innerText = data['email'];
    document.getElementById('result-phone').innerText = data['phone'];
    document.getElementById('result-birthday').innerText = data['birthday'];
    readFile(selectedFile, "avata");
  },
});

let selectedFile;
function onFileSelected(event) {
  selectedFile = event.target.files[0];
  readFile(selectedFile, "myimage");
}

function readFile(selectedFile, elementId) {
  let reader = new FileReader();
  let imgTag = document.getElementById(elementId);
  imgTag.title = selectedFile.name;
  reader.onload = function (event) {
    imgTag.src = event.target.result;
  };
  reader.readAsDataURL(selectedFile);
}

let formElement = document.querySelector('#form-signup');
let img = formElement.querySelector('#myimage')
let img2 = document.querySelector('#avata')
let errorElemnt = formElement.querySelectorAll('.form-message')
let inputElement = formElement.parentElement.querySelectorAll('input');
let spanFullname = document.querySelector('#result-fname');
let spanEmail = document.querySelector('#result-email');
let spanPhone = document.querySelector('#result-phone');
let spanBirthday = document.querySelector('#result-birthday');
function resetForm() {
  errorElemnt.innerText='';
  if (errorElemnt) {
    errorElemnt[0].innerText  = ''; 
    errorElemnt[1].innerText  = '';
    errorElemnt[2].innerText  = '';
    errorElemnt[3].innerText  = '';
    errorElemnt[4].innerText  = '';
    errorElemnt[5].innerText  = '';
    errorElemnt[6].innerText  = '';
  }
  if(inputElement) {
    inputElement[0].parentElement.classList.remove('invalid');
    inputElement[0].value = '';
    inputElement[1].parentElement.classList.remove('invalid');
    inputElement[1].value = '';
    inputElement[2].parentElement.classList.remove('invalid');
    inputElement[2].value = '';
    inputElement[3].parentElement.classList.remove('invalid');
    inputElement[3].value = '';
    inputElement[4].parentElement.classList.remove('invalid');
    inputElement[4].value = '';
    inputElement[5].parentElement.classList.remove('invalid');
    inputElement[5].value = '';
    img.removeAttribute('src')
    img.title = '';
  }
  spanFullname.innerText ='';
  spanEmail.innerText ='';
  spanPhone.innerText ='';
  spanBirthday.innerText ='';
  img2.src ='';
}
const shiflt_submit = 16;
const delete_reset = 46;
reset_form = document.getElementById("form-signup");
reset_form=document.addEventListener('keydown', function (event) {
  if (event.keyCode === shiflt_submit) {
    event.preventDefault();
    document.getElementById("submit").click();
  }
});

reset_form = document.getElementById("form-signup");
reset_form=document.addEventListener('keydown', function (event) {
  if (event.keyCode === delete_reset) {
    event.preventDefault();
    document.getElementById("reset-form").click();
  }
});

let input = document.getElementById('fname');
input.onkeyup = function(){
  let inputFullname = document.getElementById('fname');
  let splitStr = inputFullname.value.split(' ');
  for (let i = 0; i < splitStr.length; i++) {
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  this.value = splitStr.join(' ');
}