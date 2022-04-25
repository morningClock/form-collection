import request from '@/utils/request'

const api = {
  list: '/admin/user/list',
  add: '/admin/user/register'

}

export function getUserList(parameter) {
  return request({
    url: api.list,
    method: 'get',
    params: parameter
  })
}

export function addUser(data) {
  return request({
    url: api.add,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    data: data
  })
}


export default api