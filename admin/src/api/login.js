import request from '@/utils/request'

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
export function login(parameter) {
  return request({
    url: '/admin/user/login',
    method: 'post',
    data: parameter,
  })
}

export function getInfo() {
  return request({
    url: '/admin/user/info',
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  })
}

export function resetPassword(data) {
  return request({
    url: '/admin/user/reset',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    data: data
  })
}
