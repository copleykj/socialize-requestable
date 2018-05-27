/* eslint-disable import/no-unresolved */
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { BaseModel } from 'meteor/socialize:base-model';
import { LinkableModel, LinkParent } from 'meteor/socialize:linkable-model';
import { ServerTime } from 'meteor/socialize:server-time';
/* eslint-disable import/no-unresolved */

import construct from './request-model';

const { Request, RequestsCollection } = construct({ Meteor, Mongo, BaseModel, LinkableModel, LinkParent, ServerTime });

export { Request, RequestsCollection };
