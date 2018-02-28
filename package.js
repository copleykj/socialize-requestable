/* global Package */
Package.describe({
    name: 'socialize:requestable',
    version: '1.0.2',
    summary: 'Create models that are requestable',
    git: 'https://github.com/copleykj/socialize-requestable.git',
});

Package.onUse(function _(api) {
    api.versionsFrom('1.3');

    api.use('socialize:linkable-model@1.0.0');

    api.mainModule('common/common.js');
});
