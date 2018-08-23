import ENV from '../../config'

export default {
    
    // 基础路径
    baseURL: `${ENV.apiGatewayURL}/`,

    method: 'POST',

    transformRequest: [function (data) {
        data = JSON.stringify(data)
        return data
    }],
   
    headers: {'X-Requested-With': 'XMLHttpRequest', 'Content-Type': 'application/json'},

    // 请求超时时长
    timeout: 10000,

    withCredentials: false, // default

    // default 响应
    responseType: 'json',

    /** 定义允许的http响应内容的最大大小**/
    maxContentLength: 10000,

    /** 如果设置为0，则不会遵循重定向。**/
    maxRedirects: 5 /* 默认 */
}