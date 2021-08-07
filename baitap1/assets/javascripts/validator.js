
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
    let errorElemnt = formElement.querySelectorAll('.form-message')
    let inputElement = formElement.parentElement.querySelectorAll('input')
    console.log(inputElement[0]);

    // let inputElement = formElement.querySelector(rule.selector);
    if(buttonReset) {
      buttonReset.click = function(){
        errorElemnt.innerText='';
        if (errorElemnt) {
          errorElemnt[0].innerText=''; 
          errorElemnt[1].innerText='';
          errorElemnt[2].innerText='';
          errorElemnt[3].innerText='';
          errorElemnt[4].innerText='';
          errorElemnt[5].innerText='';
          errorElemnt[6].innerText='';
        }
        if(inputElement){
          console.log(inputElement);
          inputElement[0].parentElement.classList.remove('invalid');
          inputElement[1].parentElement.classList.remove('invalid');
          inputElement[2].parentElement.classList.remove('invalid');
          inputElement[3].parentElement.classList.remove('invalid');
          inputElement[4].parentElement.classList.remove('invalid');
          inputElement[5].parentElement.classList.remove('invalid');
          inputElement[6].parentElement.classList.remove('invalid');
        }
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
      const regex_fulname = /^[a-zA-Z]{3,}(?: [a-zA-Z]+){0,2}$/;
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
      messageRegex = messageError(nameField);
      return regex(value, regex_phone, messageRegex);
    }
  };
}

Validator.isBirthday = function (selector, nameField) {
  return {
    selector: selector,
    test: function (value) {
      const regex_birthday = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
      let parts = value.split("/");
      let year1 = parseInt(parts[2], 10);
      let date = new Date();
      let yearNow = date.getFullYear();
      if (year1 > yearNow) {
        return `Vui lòng nhập năm sinh hợp lệ`;
      }
      messageRegex = messageError(nameField);
      return regex(value, regex_birthday, messageRegex);
    }
  }
}

Validator.isPassword = function (selector, nameField) {
  return {
    selector: selector,
    test: function (value) {
      const regex_password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$#!%*?&])[A-Za-z\d@$#!%*?&]{8,30}$/;
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
    Validator.isPhone('#phone', 'phone'),
    // birthdays
    Validator.empty('#birthday', 'birthday'),
    Validator.isBirthday('#birthday', 'birthday'),
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

const shiflt_reset = 16;
const enter_submit = 13;
reset_form = document.getElementById("form-signup");
reset_form=document.addEventListener('keydown', function (event) {
  if (event.keyCode === enter_submit) {
    event.preventDefault();
    document.getElementById("submit").click();
  }
});

reset_form = document.getElementById("form-signup");
reset_form=document.addEventListener('keydown', function (event) {
  if (event.keyCode === shiflt_reset) {
    event.preventDefault();
    document.getElementById("reset-form").click();
  }
});
