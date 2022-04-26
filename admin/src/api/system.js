import request from '@/utils/request'

const api = {
  getTitle: '/admin/system/title',
  setTitle: '/admin/system/set'

}

export function getSystemTitle(parameter) {
  return request({
    url: api.getTitle,
    method: 'get',
    params: parameter
  })
}

export function setSystemTitle(data) {
  return request({
    url: api.setTitle,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    data: data
  })
}


export default api