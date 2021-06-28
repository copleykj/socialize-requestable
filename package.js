/* global Package */
Package.describe({
    name: 'socialize:requestable',
    version: '1.0.6',
    summary: 'Create models that are requestable',
    git: 'https://github.com/copleykj/socialize-requestable.git',
});

Package.onUse(function _(api) {
    api.versionsFrom(['1.10.2', '2.3']);

    api.use('socialize:linkable-model@1.0.6');

    api.mainModule('common/common.js');
});
