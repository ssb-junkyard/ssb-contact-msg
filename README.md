# ssb-contact-msg

Helper functions for posting contact related messages such as
follow/unfollow and blocking/unblocking. 

Supports privately posting these messages using the ssb-private
plugin.

Since contact messages are
[non-communitative](https://en.wikipedia.org/wiki/Commutative_property)
it makes sense to store a link to the previous message of the same
type, to make sure that you have all the messages needed to find the
right state given a specific message. This module automatically
assigns a previous link when posting messages. Private messages will
not have a previous link and ordinary contact messages will not link
to private contact messages. In this way, previous links are only
meant for an external observer.

## API

### async.follow(feedId, cb)

Creates and publishes a public message saying you follow
feedId. Automatically adds a link to the previous public contact
message.

### async.followPrivately(feedId, cb)

Creates and publishes a private messages saying you follow feedId.

### async.unfollow(feedId, cb)

Creates and publishes a public message saying you no longer follow
feedId. Automatically adds a link to the previous public contact
message.

### async.unfollowPrivately(feedId, cb)

Creates and publishes a private messages saying you no longer follow
feedId.

### async.block(feedId, cb)

Creates and publishes a public message saying you block
feedId. Automatically adds a link to the previous public contact
message.

### async.blockPrivately(feedId, cb)

Creates and publishes a private messages saying you block feedId.

### async.unblock(feedId, cb)

Creates and publishes a public message saying you no longer block
feedId. Automatically adds a link to the previous public contact
message.

### async.blockPrivately(feedId, cb)

Creates and publishes a private messages saying you no longer block
feedId.
