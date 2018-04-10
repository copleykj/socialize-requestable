/* eslint-disable import/no-unresolved */
import Meteor, { Mongo } from '@socialize/react-native-meteor';
import { BaseModel } from '@socialize/base-model';
import { LinkableModel, LinkParent } from '@socialize/linkable-model';
import { ServerTime } from '@socialize/server-time';
/* eslint-disable import/no-unresolved */

import construct from './common/request-model';

const { Request, RequestsCollection } = construct({ Meteor, Mongo, BaseModel, LinkableModel, LinkParent, ServerTime });

export { Request, RequestsCollection };
