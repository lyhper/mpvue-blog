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
