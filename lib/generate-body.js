const generateBlobLink = require('./generate-blob-link')

/**
 * @typedef config {object}
 * @prop {boolean|string|string[]} [autoAssign=true]
 * @prop {string} [keyword='@todo']
 * @prop {number|boolean} [blobLines=5]
 * @prop {boolean} [caseSensitive=false]
 *
 * Generate a body string for the new issue.
 * @param {object} context - Probot context object
 * @param {config} config - Config object
 * @param {string} title - Issue title
 * @param {string} file - File name
 * @param {string} contents - Contents of the file
 * @param {string} author - Author of the commit
 * @param {string} sha - Commit where this todo was introduced
 * @param {number} [pr] - PR number if applicable
 *
 * :TODO: Include code blob
 */
module.exports = function generateBody (context, config, title, file, contents, author, sha, pr) {
  const footer = `###### This issue was generated by [todo](https://github.com/jasonetco/todo) based on a \`@todo\` comment in ${sha}${pr ? ` in #${pr}` : ''}. It's been assigned to @${author} because they committed the code.`
  const re = new RegExp(`${title}\n.*@body (.*)`, 'gim')
  const bodyRe = re.exec(contents)
  const separator = '\n\n---\n\n'

  let blob = ''
  if (!Number.isNaN(config.blobLines) && config.blobLines !== 0) {
    blob = generateBlobLink(context, file, contents, title, sha, config) + separator
  }

  if (bodyRe) {
    const body = bodyRe ? bodyRe[1] : ''
    return body + separator + blob + footer
  } else {
    return blob + separator + footer
  }
}