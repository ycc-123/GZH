import { requestPost } from './request'

export function _detailApi(config) {
  return requestPost({
    params: {
      action: config.action
    },
    data: config.data
  })
}

