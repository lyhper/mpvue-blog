import timeago from 'timeago.js';

export function getTitle(title) {
  return title.replace(/\.md$/, '')
    .replace(/^\d{4}-\d{1,2}-\d{1,2}-/, '');
}

export function getDate(title) {
  return /^\d{4}-\d{1,2}-\d{1,2}/.exec(title)[0];
}

export function formatDate(str) {
  if (!str) return '';
  return timeago(null, 'zh_CN').format(new Date(str));
}

export function appendToken(url) {
  return url + 'client_id=02f65cf2f87be5c7f6cd&client_secret=0abdaea86d9bed60f48d05ecf42983e79a391a33';
}

/**
 * 生成失败重试函数
 * @param {function} fn 执行函数，必须返回promise
 * @param {function} failFn 重试达到次数限制后的回调函数
 * @param {number} maxTimes 执行次数 
 */
export function generateRetryFunc(fn, failFn, maxTimes) {

  let times = 0;

  return async function retryFunc() {
    try {
      if (times >= maxTimes) {
        failFn();

        console.info(`失败重试次数达到${maxTimes}次，放弃重试`);
        return;
      }

      times++;

      await fn();
    }catch(err) {

      await retryFunc();

    }
  }

}