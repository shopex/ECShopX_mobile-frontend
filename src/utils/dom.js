import Taro from '@tarojs/taro'

export const hasClass = function (el, cls) {
  if (el.classList) {
    return el.classList.contains(cls)
  } else {
    return !!(el.className || '').match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
  }
}

export const addClass = function (el, cls) {
  if (el.classList) {
    el.classList.add(cls)
  } else if (!hasClass(el, cls)) {
    el.className += ' ' + cls
  }
}

export const removeClass = function (el, cls) {
  if (el.classList) {
    el.classList.remove(cls)
  } else {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)', 'g')
    el.className = el.className.replace(reg, '')
  }
}

export function lockScreen (isLock = true) {
  if (Taro.getEnv() === Taro.ENV_TYPE.WEB) {
    const body = document.querySelector('body')
    if (isLock) {
      addClass(body, 'lock-screen')
    } else {
      removeClass(body, 'lock-screen')
    }
  }
}