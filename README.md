Docsify Swagger
===============
A plugin to load swagger document for [docsify][1].


Usage
=====

* Add the following script in your `index.html` after docsify
```html
<script src="//unpkg.com/docsify-swagger/dist/docsify-swagger.min.js"></script>
```

* Then add a swagger json url into your markdown
```markdown
[swagger](http://petstore.swagger.io/v2/swagger.json)
```

* It's recommended to add each swagger into a seprated markdown file, and add them in `_sidebar.md`. Check the example for more details.

Options
=======

This plugin provides some options:

```javascript
window.$docsify = {
  swagger: {
    cache: true,
    tableWidth: "auto",
    i18n: {
        "en": {
          request: "Request parameters",
          response: "Response parameters",
          name: "Name",
          type: "Type",
          required: "Required",
          description: "Description",
          none: "None"
        },
        fallback: "en"
      }
    }
}
```

### `cache`

Should cache the docs or not, the plugin will show cached document when loading failed, default is `true`.

### `tableWidth`

Set the width of parameters table, default is `auto`.

### `i18n`

Set the i18n for the document. The plugin has two built-in lang, `en` and `zh-cn`. It will try to load the fallback i18n if not found. The default `fallback` is `en`.

License
=======

    MIT License

	Copyright (C) 2020 Vincent Cheung

	This source code is licensed under the MIT license found in the
	LICENSE file in the root directory of this source tree.


[1]: https://docsify.js.org/