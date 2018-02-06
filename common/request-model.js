/* eslint-disable import/no-unresolved */
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { BaseModel } from 'meteor/socialize:base-model';
import { LinkableModel, LinkParent } from 'meteor/socialize:linkable-model';
import { ServerTime } from 'meteor/socialize:server-time';


/* eslint-disable import/no-unresolved */

export const RequestsCollection = new Mongo.Collection('socialize:requests');

if (RequestsCollection.configureRedisOplog) {
    RequestsCollection.configureRedisOplog({
        mutation(options, { selector, doc }) {
            const namespaces = [];
            if (doc) {
                namespaces.push(doc.linkedObjectId, doc.requesterId);
            } else if (selector && selector._id) {
                const request = RequestsCollection.findOne({ _id: selector._id }, { fields: { linkedObjectId: 1, requesterId: 1 } });
                if (request) {
                    namespaces.push(request.linkedObjectId, request.requesterId);
                }
            }

            Object.assign(options, {
                namespaces,
            });
        },
        cursor(options, selector) {
            const selectorId = selector.linkedObjectId || selector.requesterId;
            if (selectorId) {
                Object.assign(options, {
                    namespace: selectorId,
                });
            }
        },
    });
}

const acceptHooks = {};
let requestTypes = [];
/**
 * The Request Class
 * @class Request
 * @param {Object} document An object representing a request, usually a Mongo document
 */
export class Request extends LinkableModel(BaseModel) {
    /**
     * onAccepted - Register a function to run when the request is accepted
     *
     * @static
     * @param  {LinkParent} Model       The model for which the function should run
     * @param  {Function} acceptedHook  The function to run when the request is accepted
     * @throws {Meteor.error}
     */

    static onAccepted(Model, acceptedHook) {
        if (new Model() instanceof LinkParent) {
            if (typeof acceptedHook === 'function') {
                const hookName = Model.prototype.getCollectionName();

                if (!acceptHooks[hookName]) {
                    acceptHooks[hookName] = [];
                }

                acceptHooks[hookName].push(acceptedHook);
            } else {
                throw new Meteor.Error('notAFunction', 'Second parameter of onAccepted must be a function');
            }
        } else {
            throw new Meteor.Error('notALinkParent', 'First parameter of onAccepted must be a model of type LinkParent');
        }
    }

    static registerRequestType(type) {
        // create a set from the requestTypes array so we only add unique values
        const typesSet = new Set(requestTypes);

        typesSet.add(type);

        requestTypes = Array.from(typesSet);
    }

    /**
     * Get the User instance for the user who made the request
     * @returns {User} The user who made the request
     */
    requester() {
        return Meteor.users.findOne({ _id: this.requesterId });
    }

    /**
     * Get the User instance for the user who is invited if exists
     * @returns {User} The user who is invited
     */
    invited() {
        if (this.invited) {
            return Meteor.users.findOne({ _id: this.invited });
        }
        return null;
    }

    /**
     * Accept the request
     */
    accept() {
        acceptHooks[this.objectType].forEach((hook) => {
            hook.call(this);
        });
    }

    /**
     * Deny the request
     */
    deny() {
        this.update({ $set: { deniedAt: ServerTime.date() } });
    }

    /**
     * Ignore the request so that it can be accepted or deniedAt later
     */
    ignore() {
        this.update({ $set: { ignoredAt: ServerTime.date() } });
    }

    /**
     * Cancel the request
     */
    cancel() {
        this.remove();
    }

    /**
     * Check if the request had been responded to
     * @returns {Boolean} Whether the request has been responded to
     */
    wasRespondedTo() {
        return !!this.deniedAt || !!this.ignoredAt;
    }
}

Request.attachCollection(RequestsCollection);


// Create the schema for a request
RequestsCollection.attachSchema(new SimpleSchema({
    requesterId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        autoValue() {
            if (this.isInsert) {
                return this.userId;
            }
            return undefined;
        },
        index: 1,
        denyUpdate: true,
    },
    invitedId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        index: 1,
        denyUpdate: true,
        optional: true
    },
    type: {
        type: String,
        allowedValues: () => requestTypes,
    },
    createdAt: {
        type: Date,
        autoValue() {
            if (this.isInsert) {
                return ServerTime.date();
            }
            return undefined;
        },
        index: -1,
        denyUpdate: true,
    },
    deniedAt: {
        type: Date,
        optional: true,
    },
    ignoredAt: {
        type: Date,
        optional: true,
    },
    data: {
        type: Object,
        blackbox: true,
        optional: true
    }
}));

// add the LinkableSchema to the request class
Request.appendSchema(LinkableModel.LinkableSchema);
