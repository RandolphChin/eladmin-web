import request from '@/utils/request'

export function list(params) {
  return request({
    url: 'api/baseEntrustCompany',
    method: 'get',
    params: params
  })
}

export function listAll(params) {
  return request({
    url: 'api/baseEntrustCompany/all',
    method: 'get',
    params: params
  })
}

export function get(id) {
  return request({
    url: 'api/baseEntrustCompany/' + id,
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: 'api/baseEntrustCompany',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/baseEntrustCompany/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/baseEntrustCompany',
    method: 'put',
    data
  })
}

export default { list, get, add, edit, del, listAll }
