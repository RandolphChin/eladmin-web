import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/localStorage',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/localStorage/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/localStorage',
    method: 'put',
    data
  })
}

export function list(params) {
  return request({
    url: 'api/localStorage',
    method: 'get',
    params: params
  })
}
export default { add, edit, del, list }
