import request from '@/utils/request'

const api = {
  list: '/admin/customer/list',
  add: '/admin/customer/add',
  update: '/admin/customer/update',
  delete: '/admin/customer/delete',
  deleteBatch: '/admin/customer/deletebatch',
  updateStatusBatch: '/admin/customer/status',
  downloadCustomerExcel: '/admin/customer/excel',
}

export function getCustomerList(parameter) {
  return request({
    url: api.list,
    method: 'get',
    params: parameter
  })
}
export function addCustomer(data) {
  return request({
    url: api.add,
    method: 'post',
    data: data
  })
}
export function updateCustomer(data) {
  return request({
    url: api.update,
    method: 'post',
    data: data
  })
}
export function deleteCustomer(parameter) {
  return request({
    url: api.delete,
    method: 'delete',
    params: parameter
  })
}
export function deleteBatchCustomer(parameter) {
  return request({
    url: api.deleteBatch,
    method: 'delete',
    params: parameter
  })
}
export function updateBatchCustomerStatus(parameter) {
  return request({
    url: api.updateStatusBatch,
    method: 'put',
    params: parameter
  })
}
export function downloadCustomerExcel(parameter) {
  return request({
    url: api.downloadCustomerExcel,
    method: 'get',
    params: parameter
  })
}


export default api