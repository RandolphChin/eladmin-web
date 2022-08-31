import request from '@/utils/request'

export function get(data) {
  return request({
    url: 'api/quartzJobs',
    method: 'get',
    params: data
  })
}

export function add(data) {
  return request({
    url: 'api/quartzJobs',
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: 'api/quartzJobs/deleteJob',
    method: 'delete',
    data
  })
}

export function edit(data) {
  return request({
    url: 'api/quartzJobs',
    method: 'put',
    data
  })
}

export function pauseJob(data) {
  return request({
    url: 'api/quartzJobs/pauseJob',
    method: 'put',
    data
  })
}

export function resumeJob(data) {
  return request({
    url: 'api/quartzJobs/resumeJob',
    method: 'put',
    data
  })
}

export function runOnce(data) {
  return request({
    url: 'api/quartzJobs/runOnce/',
    method: 'post',
    data
  })
}
export const linkWebsocket = `/websocket/lims8000-app`
export const subscribeWebsocker = '/topic/quartz'
export default { add, edit, del, pauseJob, resumeJob, runOnce, get, linkWebsocket, subscribeWebsocker }
