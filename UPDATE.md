# Update old Ember.js project

Updating Ember CLI

```
$ npm install -g ember-cli-update
$ ember-cli-update
```

## Codemod packages

Add eslint

```
$ npm install --save-dev eslint-plugin-ember
```

```
// .eslintrc.js
module.exports = {
  plugins: [
    'ember'
  ],
  extends: [
    'eslint:recommended',
    'plugin:ember/recommended' // or 'plugin:ember/base'
  ],
  rules: {
    // override rules' settings here
  }
}
```

```
$ ./node_modules/.bin/eslint --fix
```


```
$ npm install ember-modules-codemod -g

```

Converting to new module import syntax:

* https://github.com/ember-cli/ember-modules-codemod

Removing .get() - Ember 3.1:

* https://github.com/rondale-sc/es5-getter-ember-codemod

Removing Ember.K:

* https://github.com/abuiles/ember-watson#remove-usages-of-emberk

## New Testing API

* New API: https://github.com/emberjs/ember-test-helpers/blob/master/API.md

Updating QUnit tests:

* https://github.com/rwjblue/ember-qunit-codemod
* https://github.com/simonihmig/ember-test-helpers-codemod

Removing jQuery dependency:

* https://github.com/simonihmig/ember-native-dom-helpers-codemod
* https://github.com/cibernox/ember-native-dom-helpers

Converting andThen to async/await:

* https://github.com/abuiles/ember-watson#remove-usages-of-emberk

```
$ ember install ember-cli-qunit@4.2.0
```

Ember test selectors:

* https://github.com/simplabs/ember-test-selectors

QUnit dom:

* https://github.com/simplabs/qunit-dom

## New filestructure layout

Migrator:

* https://github.com/rwjblue/ember-module-migrator

Generate new app with the new structure:

* Install Ember CLI canary

```
$ npm install -g ember-cli/ember-cli
MODULE_UNIFICATION=true ember new my-app
```
