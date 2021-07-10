import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/qrtzJob',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/qrtzJob/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/qrtzJob',
    method: 'put',
    data
  })
}

export function updateIsPause(id) {
  return request({
    url: 'api/qrtzJob/' + id,
    method: 'put'
  })
}


export function runOnce(id) {
  return request({
    url: 'api/qrtzJob/runOnce/' + id,
    method: 'put'
  })
}

export default { add, edit, del, updateIsPause, runOnce }
