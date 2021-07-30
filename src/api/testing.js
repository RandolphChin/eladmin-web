import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/testing',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/testing/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/testing',
    method: 'put',
    data
  })
}

export const linkWebsocket = `/api/my-chat-app:id`
export default { add, edit, del, linkWebsocket }
