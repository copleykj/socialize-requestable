## Request (class) - Extends [BaseModel](https://github.com/copleykj/socialize-base-model)  ##

To gain access the methods of a request you must first have an instance of a request. You can obtain an instance by performing a query on the requests collection. A `findOne` will return an instance and a `find` will return a cursor which when iterated over will return an instance for each iteration.

```javascript
var request = Meteor.requests.findOne(); //instance of Request

var requests = Meteor.requests.find();  //cursor which returns Request instances
```
### Instance Methods ###

_**all examples assume an instance of `Request` as `request`**_

**requester** - Get the user instance for the user who requested the friendship.

```javascript
var requester = request.requester(); //instance of User for person making the request
```

**accept** - Accept a request.

```javascript
request.accept(); //accept the request
```

**deny** - Deny a request.

```javascript
request.deny(); //deny the request
```

**cancel** - Cancel a request.

```javascript
request.cancel(); //cancel the request
```

**wasRespondedTo** - Check to see if the request has been responded to (denied or ignored).

```javascript
request.wasRespondedTo(); //true if the request was responded to.
```

### Static Methods ###

**onAccepted(model, hookFunction)** - A hook to run when a request is accepted. Hook will be called with the accepted request bound to `this`.
