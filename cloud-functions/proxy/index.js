// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const {
    url,
    headers
  } = event

  try {
    const response = await axios({
      url,
      method: 'get',
      headers
    })

    return response.data
  } catch (err) {
    console.error(err)
    return null
  }
}
