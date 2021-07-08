# Requestable

This package allows the creation of models that can be requested. This package is used by the [socialize:friendships][friendships] package to create user to user friendship requests. It could however also be useful for other models such as event listings or groups which users can request access to.

>>This is a [Meteor][meteor] package with part of it's code published as a companion NPM package made to work with clients other than Meteor. For example your server is Meteor, but you want to build a React Native app for the client. This allows you to share code between your Meteor server and other clients to give you a competitive advantage when bringing your mobile and web application to market.

<!-- TOC depthFrom:1 depthTo:6 withLinks:1 updateOnSave:1 orderedList:0 -->
- [Supporting The Project](#supporting-the-project)
- [Meteor Installation](#meteor-installation)
- [NPM Installation](#npm-installation)
- [Usage Outside Meteor](#usage-outside-meteor)
  - [React Native](#react-native)
- [Basic Usage](#basic-usage)
- [Scalability - Redis Oplog](#scalability---redis-oplog)
<!-- /TOC -->

## Supporting The Project

Finding the time to maintain FOSS projects can be quite difficult. I am myself responsible for over 30 personal projects across 2 platforms, as well as Multiple others maintained by the [Meteor Community Packages](https://github.com/meteor-community-packages) organization. Therfore, if you appreciate my work, I ask that you either sponsor my work through GitHub, or donate via Paypal or Patreon. Every dollar helps give cause for spending my free time fielding issues, feature requests, pull requests and releasing updates. Info can be found in the "Sponsor this project" section of the [GitHub Repo](https://github.com/copleykj/socialize-postable)

## Meteor Installation

This package relies on the npm package `simpl-schema` so you will need to make sure it is installed as well.

```shell
meteor npm install --save simpl-schema
meteor add socialize:requestable
```

## NPM Installation

When using this package with React Native, the dependency tree ensures that `simpl-schema` is loaded so there's no need to install it as when using within Meteor.

```shell
npm install --save @socialize/user-requestable
```

## Usage Outside Meteor

The client side parts of this package are published to NPM as `@socialize/cloudinary` for use in front ends outside of Meteor.

When using the npm package you'll need to connect to a server, which hosts the server side Meteor code for your app, using `Meteor.connect` as per the [@socialize/react-native-meteor usage example](https://github.com/copleykj/react-native-meteor#example-usage) documentation.

 ```javascript
Meteor.connect('ws://192.168.X.X:3000/websocket');
 ```

### React Native

When using this package with React Native there is some minor setup required by the `@socialize/react-native-meteor` package. See [@socialize/react-native-meteor react-native](https://github.com/copleykj/react-native-meteor#react-native) for necessary instructions.

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
import Meteor, { Mongo } from '@socialize/react-native-meteor';
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

## Scalability - Redis Oplog

This package implements [cultofcoders:redis-oplog][redis-oplog]'s namespaces to provide reactive scalability as an alternative to Meteor's `livedata`. Use of redis-oplog is not required and will not engage until you install the [cultofcoders:redis-oplog][redis-oplog] package and configure it.

[friendships]: https://atmospherejs.com/socialize/friendships
[socialize]: https://atmospherejs.com/socialize
[redis-oplog]:https://github.com/cultofcoders/redis-oplog
[api]: https://github.com/copleykj/socialize-requestable/blob/master/API.md
[meteor]: https://meteor.com
