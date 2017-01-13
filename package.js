/* eslint-disable no-undef */
Package.describe({
    name: 'socialize:requestable',
    version: '1.0.0',
    summary: 'Create models that are requestable',
    git: 'https://github.com/copleykj/socialize-requestable.git',
});

Package.onUse(function _(api) {
    api.versionsFrom('1.3');

    api.use('ecmascript');

    api.use('socialize:linkable-model@1.0.0');

    api.mainModule('server/server.js', 'server');
    api.mainModule('common/common.js');
});
