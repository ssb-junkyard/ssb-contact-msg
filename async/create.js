const isFollow = require('ssb-contact-schema/sync/isFollow')
const isBlock = require('ssb-contact-schema/sync/isBlock')
const pull = require('pull-stream')
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
    pull(
      server.messagesByType({type: 'contact', reverse: true, limit: 1}),
      pull.collect((err, msgs) => {
        if (msgs.length == 0)
          cb(null, { key: null })
        else
          cb(null, msgs[0])
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
  
  return {
    follow: function(feedId, cb) {
      if (!ref.isFeed(feedId)) return cb(new Error('a feed id must be specified'))

      let msg = createMsg(feedId, { following: true })
      addPreviousValidateAndPublish(msg, isFollow, cb)
    },
    unfollow: function(feedId, cb) {
      if (!ref.isFeed(feedId)) return cb(new Error('a feed id must be specified'))

      let msg = createMsg(feedId, { following: false })
      addPreviousValidateAndPublish(msg, isFollow, cb)
    },
    
    block: function(feedId, cb) {
      if (!ref.isFeed(feedId)) return cb(new Error('a feed id must be specified'))

      let msg = createMsg(feedId, { blocking: true })
      addPreviousValidateAndPublish(msg, isBlock, cb)
    },
    unblock: function(feedId, cb) {
      if (!ref.isFeed(feedId)) return cb(new Error('a feed id must be specified'))

      let msg = createMsg(feedId, { blocking: false })
      addPreviousValidateAndPublish(msg, isBlock, cb)
    }
  }
}
