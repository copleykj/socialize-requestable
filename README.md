# Requestable #

This package allows the creation of models that can be requested. This package is used by the [socialize:friendships](https://atmospherejs.com/socialize/friendships) package to create user to user friendship requests. It could however also be useful for other models such as event listings or groups which users can request access to.

## Supporting the Project ##
In the spirit of keeping this and all of the packages in the [Socialize](https://atmospherejs.com/socialize) set alive, I ask that if you find this package useful, please donate to it's development.

[Bitcoin](https://www.coinbase.com/checkouts/4a52f56a76e565c552b6ecf118461287) / [Patreon](https://www.patreon.com/user?u=4866588) / [Paypal](https://www.paypal.me/copleykj)

## Installation ##

```shell
$ meteor add socialize:requestable
```

## Basic Usage ##

```javascript
import { Meteor } from 'meteor/meteor';
import { LinkParent } from 'meteor/socialize:linkable-model';
import { Mongo } from 'meteor/mongo';
import { Request, RequestsCollection } from 'meteor/socialize:requestable';

import { GroupMember } from './GroupMember.js';

import SimpleSchema from 'simpl-schema';

const GroupsCollection = new Mongo.Collection('groups');

Request.registerRequestType('group');

Request.onAccepted(function() {
    //`this` is the instance of the request that is being accepted
    if(this.type === 'group'){
        new GroupMember({ userId: this.requesterId }).save();
    }
})

class Group extends LinkParent {
    requestAccess() {
        new Request({
            ...this.getLinkObject(),
            type: 'group'}
        ).save()
    },
    requests() {
        return RequestsCollection.find({
            ...this.getLinkObject(),
            type: 'friend',
            denied: { $exists: false },
            ignored: { $exists: false }
        });
    }
}

Group.attachCollection(GroupsCollection);

Group.attachSchema(new SimpleSchema({
    name: {
        type: String,
    },
    owner: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        autoValue() {
            if (this.isInsert) {
                return this.userId;
            }
            return undefined;
        },
    }
}));
```

For a more in depth explanation of how to use this package see [API.md](API.md)
