import axios from 'axios'
import {Base64} from 'js-base64'
import {token, owner, repo, branch, pathPrefix, pathSuffix} from '@/const/ConstUtlis'

/**
 * 更新量结果信息
 * @param scaleName
 * @param content
 * @returns {Promise<void>}
 */
export const uploadScaleResults = async (scaleName, content) => {
  const fileName = `${pathPrefix}-${scaleName}${pathSuffix}`
  checkFileExistence(fileName).then(result => {
    if (result) {
      readWriteAndUploadFile(fileName, content)
    } else {
      const arrResult = []
      arrResult.push(content)
      uploadNewFile(fileName, arrResult)
    }
  }).catch(error => {
    console.error('Error occurred:', error)
  })
}
/**
 * 读取一个存在的文件并更新内容
 * 内容格式：
 * `[
 *       {
 *   "nickName": [
 *     {
 *       "sas": {
 *         "options": [
 *
 *         ],
 *         "score": 1
 *       }
 *     }
 *   ]
 * }
 * ]`
 */
const readWriteAndUploadFile = async (path, content) => {
  return new Promise((resolve, reject) => {
    axios.get(`/repos/${owner}/${repo}/contents/${path}`, {
      headers: {
        Authorization: `Bearer ${Base64.decode(token)}`
      }
    })
      .then(response => {
        const file = response.data
        const currentContent = Buffer.from(response.data.content, 'base64').toString('utf-8')
        let contentArr = JSON.parse(currentContent)
        // 修改文件内容
        contentArr.push(content)
        const newContent = JSON.stringify(contentArr)
        // 更新文件内容
        axios.put(`/repos/${owner}/${repo}/contents/${path}`, {
          message: `Update ${path} content`, content: Buffer.from(newContent).toString('base64'), sha: file.sha
        }, {
          headers: {
            Authorization: `Bearer ${Base64.decode(token)}`
          }
        })
          .then(updatedResponse => {
            console.log('File updated:', updatedResponse.data)
            resolve(true) // 返回 true 表示文件更新成功
          })
          .catch(error => {
            console.error('Error updating file:', error.response.data)
            resolve(false) // 返回 false 表示文件更新失败
          })
      })
      .catch(error => {
        console.error('Error retrieving file:', error.response.data)
        resolve(false) // 返回 false 表示文件获取失败
      })
  })
}
/**
 * 更新一个不存在的文件
 * 内容格式：
 * [
 *       {
 *   "nickName": [
 *     {
 *       "sas": {
 *         "options": [
 *
 *         ],
 *         "score": 1
 *       }
 *     }
 *   ]
 * }
 * ]
 * @param path
 * @param content
 * @returns {Promise<boolean>}
 */
const uploadNewFile = async (path, content) => {
  // 将文件内容进行 Base64 编码
  const encodedContent = Buffer.from(JSON.stringify(content)).toString('base64')
  // 构建请求 URL
  const url = `/repos/${owner}/${repo}/contents/${path}`
  // 构建请求体
  const requestBody = {
    message: `Create ${path} file`, content: encodedContent, branch: branch
  }
  try {
    await axios.put(url, requestBody, {
      headers: {
        'Authorization': `Bearer ${Base64.decode(token)}`, 'Content-Type': 'application/json'
      }
    })
    return true // 返回 true 表示文件上传成功
  } catch (error) {
    console.error(`Error occurred while uploading file: ${error.response.data.message}`)
    return false // 返回 false 表示文件上传失败
  }
}

/**
 * 检测文件是否存在
 * @param path
 * @returns {Promise<boolean>}
 */
const checkFileExistence = async (path) => {
  try {
    const url = `/repos/${owner}/${repo}/contents/${path}`
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${Base64.decode(token)}`
      }
    })
    if (response.status === 200) {
      // 文件存在
      return true
    } else {
      // 其他 API 响应状态码
      console.log('Unexpected response:', response)
      return false
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // 文件不存在
      return false
    } else {
      // 处理其他错误
      console.error('Error occurred while checking file:', error)
      return false
    }
  }
}
