# Requestable

This package allows the creation of models that can be requested. This package is used by the [socialize:friendships][friendships] package to create user to user friendship requests. It could however also be useful for other models such as event listings or groups which users can request access to.

>This is a [Meteor][meteor] package with part of it's code published as a companion NPM package made to work with React Native. This allows your Meteor and React Native projects that use this package to share code between them to give you a competitive advantage when bringing your mobile and web application to market.


<!-- TOC START min:1 max:3 link:true update:true -->
- [Requestable](#requestable)
  - [Supporting the Project](#supporting-the-project)
  - [Installation](#installation)
  - [React Native Installation](#react-native-installation)
  - [Basic Usage](#basic-usage)
  - [Scalability - Redis Oplog ##](#scalability---redis-oplog-)

<!-- TOC END -->

## Supporting the Project
In the spirit of keeping this and all of the packages in the [Socialize][socialize] set alive, I ask that if you find this package useful, please donate to it's development.

Litecoin: LXLBD9sC5dV79eQkwj7tFusUHvJA5nhuD3 / [Patreon](https://www.patreon.com/user?u=4866588) / [Paypal](https://www.paypal.me/copleykj)

## Meteor Installation

This package relies on the npm package `simpl-schema` so you will need to make sure it is installed as well.

```shell
$ meteor npm install --save simpl-schema
$ meteor add socialize:requestable
```

## React Native Installation

When using this package with React Native, the dependency tree ensures that `simpl-schema` is loaded so there's no need to install it as when using within Meteor.

```shell
$ npm install --save @socialize/user-requestable
```
> **Note**
>
>  When using with React Native, you'll need to connect to a server which hosts the server side Meteor code for your app using `Meteor.connect` as per the [@socialize/react-native-meteor](https://www.npmjs.com/package/@socialize/react-native-meteor#example-usage) documentation.

## Basic Usage

Depending on the environment your code runs in, Meteor or React Native, you'll need to import things slightly different.

```javascript
//Meteor Imports
import { Meteor } from 'meteor/meteor';
import { LinkParent } from 'meteor/socialize:linkable-model';
import { Mongo } from 'meteor/mongo';
import { Request, RequestsCollection } from 'meteor/socialize:requestable';
```

```javascript
//Meteor Imports
import Meteor { Mongo } from '@socialize/react-native-meteor';
import { LinkParent } from '@socialize/linkable-model';
import { Request, RequestsCollection } from '@socialize/requestable';
```

The Rest of the code runs independent of which environment.

```javascript
import { GroupMember } from './GroupMember.js';

import SimpleSchema from 'simpl-schema';

const GroupsCollection = new Mongo.Collection('groups');

Request.registerRequestType('group');

class Group extends LinkParent {
    requestAccess() {
        new Request({
            ...this.getLinkObject(),
            type: 'group'
        }).save();
    }

    requests() {
        return RequestsCollection.find({
            ...this.getLinkObject(),
            type: 'group',
            deniedAt: { $exists: false },
            ignoredAt: { $exists: false }
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

Request.onAccepted(Group, function() {
    //`this` is the instance of the request that is being accepted
    if(this.type === 'group'){
        new GroupMember({ userId: this.requesterId }).save();
    }
});
```

> **Note**
>
> This package does not provide any allow/deny rules for requests. You will need to write your own, making sure to check the `type` field to ensure its the type of request you are expecting. Other request types should then be ignored as other packages that use this package will handle their own.

For a more in depth explanation of how to use this package see [API.md](api)

## Scalability - Redis Oplog ##

This package implements [cultofcoders:redis-oplog][redis-oplog]'s namespaces to provide reactive scalability as an alternative to Meteor's `livedata`. Use of redis-oplog is not required and will not engage until you install the [cultofcoders:redis-oplog][redis-oplog] package and configure it.


[friendships]: https://atmospherejs.com/socialize/friendships
[socialize]: https://atmospherejs.com/socialize
[redis-oplog]:https://github.com/cultofcoders/redis-oplog
[api]: https://github.com/copleykj/socialize-requestable/blob/master/API.md
[meteor]: https://meteor.com
