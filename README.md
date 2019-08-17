# ssb-contact-msg

Helper functions for posting contact related messages such as
follow/unfollow and blocking/unblocking. 

Since contact messages are
[non-communitative](https://en.wikipedia.org/wiki/Commutative_property)
it makes sense to store a link to the previous message of the same
type, to make sure that you have all the messages needed to find the
right state given a specific message. This module automatically
assigns a previous link when posting messages.
