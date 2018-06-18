## \<skeleton-sms-validator\>

`skeleton-sms-validator` is a [Polymer 3](http://polymer-project.org) element to check SMS length and encoding type.

## Installation

Install skeleton-sms-validator with npm

```shell
$ npm install FabricElements/skeleton-sms-validator --save
```

## Usage

Import it into the `<head>` of your page

```html
<script type="module" src="node_modules/@fabricelements/skeleton-sms-validator/skeleton-sms-validator.js"></script>
```

### Example: basic usage

Add the `skeleton-sms-validator` element.

```html
<skeleton-sms-validator segments="{{segments}}"
                        value="{{value}}"
                        type="{{type}}"
                        characters="{{characters}}"
                        limit-segments="2"></skeleton-sms-validator>
```

### Attributes

* `segments` (number) - The SMS parts.
* `value` (string) - The text value.
* `type` (string) - The encoding type.
* `characters` (array) - SMS chars array
* `limit-segments` (number) - Limits the parts an SMS should have.

### Other attributes

* `invalid` (boolean) - True if SMS parts exceed limitSegments.
* `charCounter` (array) - The input char counter.
* `_limit` (number) - Limits the char qty by encoding type and segments limit.
* `labelGsm` (string) - GSM label
* `labelGsmDouble` (string) - GSM double chars label.
* `labelUcs2` (string) - UCS2 label.

## Contributing

Please check [CONTRIBUTING](./CONTRIBUTING.md).

## Acknowledgments

[encoder-utils.js](./encoder-utils.js) is based on [chadselph/smssplit](https://github.com/chadselph/smssplit) by Chad Selph.

## License

Released under the [BSD 3-Clause License](./LICENSE.md).
