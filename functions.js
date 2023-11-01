/**
 * @param {string} path
 * @returns {string}
 */
function removeSlashes(path) {
  return path.split('/').filter(Boolean).join('/');
}

export { removeSlashes };
