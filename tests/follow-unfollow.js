const test = require('tape')
const Server = require('scuttle-testbot')
const pull = require('pull-stream')

test('async.create - Follow and unfollow works', t => {
  Server.use(require('ssb-backlinks'))
  const Create = require('../async/create')
  
  const server = Server({name: 'test.async.follow-unfollow'})
  const create = Create(server)

  create.follow('@6CAxOI3f+LUOVrbAl0IemqiS7ATpQvr9Mdw9LC4+Uv0=.ed25519', (err, followMsg) => {
    t.equal(followMsg.value.content.following, true, 'unfollow msg correct')
    t.equal(followMsg.value.content.previous, null, 'previous of first message is null')

    server.publish({type: 'post', text: 'first post!'}, (err) => {

      create.unfollow('@6CAxOI3f+LUOVrbAl0IemqiS7ATpQvr9Mdw9LC4+Uv0=.ed25519', (err, unfollowMsg) => {
        t.equal(unfollowMsg.value.content.following, false, 'unfollow msg correct')
        t.equal(unfollowMsg.value.content.previous, followMsg.key, 'previous of second contact msg is first contact msg')

        server.close()
        t.end()
      })
    })
  })
})

test('async.create - Follow and block works', t => {
  Server.use(require('ssb-backlinks'))
  const Create = require('../async/create')
  
  const server = Server({name: 'test.async.follow-unfollow'})
  const create = Create(server)

  create.follow('@6CAxOI3f+LUOVrbAl0IemqiS7ATpQvr9Mdw9LC4+Uv0=.ed25519', (err, followMsg) => {
    t.equal(followMsg.value.content.previous, null, 'previous of first message is null')

    server.publish({type: 'post', text: 'first post!'}, (err) => {

      create.block('@6CAxOI3f+LUOVrbAl0IemqiS7ATpQvr9Mdw9LC4+Uv0=.ed25519', (err, unfollowMsg) => {
        t.equal(unfollowMsg.value.content.blocking, true, 'block msg correct')
        t.equal(unfollowMsg.value.content.previous, followMsg.key, 'previous of second contact msg is first contact msg')

        server.close()
        t.end()
      })
    })
  })
})
