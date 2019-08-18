const isFollow = require('ssb-contact-schema/sync/isFollow')
const isBlock = require('ssb-contact-schema/sync/isBlock')
const pull = require('pull-stream')
const pullAbort = require('pull-abortable')
const ref = require('ssb-ref')

module.exports = function (server) {
  function createMsg(feedId, attr)
  {
    return Object.assign({}, {
      type: 'contact',
      contact: feedId
    }, attr)
  }

  function getLatestContact(cb)
  {
    var abortablePullStream = pullAbort()
    var found = false
    pull(
      server.messagesByType({type: 'contact', reverse: true}),
      abortablePullStream,
      pull.drain((msg) => {
        if (typeof msg.value.content !== 'string') {
          cb(null, msg)
          found = true
          abortablePullStream.abort()
        }
      }, () => {
        if (!found)
          cb(null, { key: null })
      })
    )
  }

  function addPreviousValidateAndPublish(msg, isOk, cb)
  {
    getLatestContact((err, latest) => {
      if (err) return cb(err)

      msg.previous = latest.key

      if (!isOk(msg)) return cb(msg.errors)
      delete msg.errors

      server.publish(msg, cb)
    })
  }

  function publishSelf(msg, isOk, cb)
  {
    if (!isOk(msg)) return cb(msg.errors)
    delete msg.errors

    server.private.publish(msg, [server.id], cb)
  }
  
  return {
    follow: function(feedId, cb) {
      if (!ref.isFeed(feedId)) return cb(new Error('a feed id must be specified'))

      let msg = createMsg(feedId, { following: true })
      addPreviousValidateAndPublish(msg, isFollow, cb)
    },
    followPrivately: function(feedId, cb) {
      if (!ref.isFeed(feedId)) return cb(new Error('a feed id must be specified'))

      let msg = createMsg(feedId, { following: true })
      publishSelf(msg, isFollow, cb)
    },

    unfollow: function(feedId, cb) {
      if (!ref.isFeed(feedId)) return cb(new Error('a feed id must be specified'))

      let msg = createMsg(feedId, { following: false })
      addPreviousValidateAndPublish(msg, isFollow, cb)
    },
    unfollowPrivately: function(feedId, cb) {
      if (!ref.isFeed(feedId)) return cb(new Error('a feed id must be specified'))

      let msg = createMsg(feedId, { following: false })
      publishSelf(msg, isFollow, cb)
    },
    
    block: function(feedId, cb) {
      if (!ref.isFeed(feedId)) return cb(new Error('a feed id must be specified'))

      let msg = createMsg(feedId, { blocking: true })
      addPreviousValidateAndPublish(msg, isBlock, cb)
    },
    blockPrivately: function(feedId, cb) {
      if (!ref.isFeed(feedId)) return cb(new Error('a feed id must be specified'))

      let msg = createMsg(feedId, { blocking: true })
      publishSelf(msg, isBlock, cb)
    },

    unblock: function(feedId, cb) {
      if (!ref.isFeed(feedId)) return cb(new Error('a feed id must be specified'))

      let msg = createMsg(feedId, { blocking: false })
      addPreviousValidateAndPublish(msg, isBlock, cb)
    },
    unblock: function(feedId, cb) {
      if (!ref.isFeed(feedId)) return cb(new Error('a feed id must be specified'))

      let msg = createMsg(feedId, { blocking: false })
      publishSelf(msg, isBlock, cb)
    }
  }
}
