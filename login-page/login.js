(function () {
  'use strict';

  var form = document.getElementById('loginForm');
  var usernameInput = document.getElementById('username');
  var passwordInput = document.getElementById('password');
  var rememberMeInput = document.getElementById('rememberMe');
  var togglePasswordBtn = document.getElementById('togglePassword');
  var submitBtn = document.getElementById('submitBtn');
  var formAlert = document.getElementById('formAlert');
  var usernameError = document.getElementById('usernameError');
  var passwordError = document.getElementById('passwordError');

  var STORAGE_KEY = 'login_remember_username';
  var DEMO_USER = { username: 'admin', password: '123456' };

  function showAlert(message, type) {
    formAlert.textContent = message;
    formAlert.className = 'alert ' + type;
    formAlert.hidden = false;
  }

  function hideAlert() {
    formAlert.hidden = true;
    formAlert.textContent = '';
    formAlert.className = 'alert';
  }

  function setFieldError(input, errorEl, message) {
    if (message) {
      input.classList.add('invalid');
      errorEl.textContent = message;
    } else {
      input.classList.remove('invalid');
      errorEl.textContent = '';
    }
  }

  function validateUsername(value) {
    var trimmed = value.trim();
    if (!trimmed) {
      return '请输入用户名';
    }
    if (trimmed.length < 3) {
      return '用户名至少需要 3 个字符';
    }
  }

  function validatePassword(value) {
    if (!value) {
      return '请输入密码';
    }
    if (value.length < 6) {
      return '密码至少需要 6 个字符';
    }
  }

  function validateForm() {
    var usernameMsg = validateUsername(usernameInput.value);
    var passwordMsg = validatePassword(passwordInput.value);

    setFieldError(usernameInput, usernameError, usernameMsg);
    setFieldError(passwordInput, passwordError, passwordMsg);

    return !usernameMsg && !passwordMsg;
  }

  function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    submitBtn.classList.toggle('loading', isLoading);
    submitBtn.querySelector('.btn-text').hidden = isLoading;
    submitBtn.querySelector('.btn-loader').hidden = !isLoading;
  }

  function simulateLogin(username, password) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        if (username === DEMO_USER.username && password === DEMO_USER.password) {
          resolve({ success: true, message: '登录成功，欢迎回来！' });
        } else {
          reject(new Error('用户名或密码错误'));
        }
      }, 1200);
    });
  }

  function loadRememberedUsername() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        usernameInput.value = saved;
        rememberMeInput.checked = true;
      }
    } catch (e) {
      // localStorage 不可用时静默忽略
    }
  }

  function saveRememberPreference(username) {
    try {
      if (rememberMeInput.checked) {
        localStorage.setItem(STORAGE_KEY, username);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      // localStorage 不可用时静默忽略
    }
  }

  togglePasswordBtn.addEventListener('click', function () {
    var isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    togglePasswordBtn.setAttribute('aria-label', isPassword ? '隐藏密码' : '显示密码');
  });

  usernameInput.addEventListener('input', function () {
    setFieldError(usernameInput, usernameError, '');
    hideAlert();
  });

  passwordInput.addEventListener('input', function () {
    setFieldError(passwordInput, passwordError, '');
    hideAlert();
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    hideAlert();

    if (!validateForm()) {
      return;
    }

    var username = usernameInput.value.trim();
    var password = passwordInput.value;

    setLoading(true);

    simulateLogin(username, password)
      .then(function (result) {
        saveRememberPreference(username);
        showAlert(result.message, 'success');
      })
      .catch(function (err) {
        showAlert(err.message || '登录失败，请重试', 'error');
      })
      .finally(function () {
        setLoading(false);
      });
  });

  loadRememberedUsername();
})();
