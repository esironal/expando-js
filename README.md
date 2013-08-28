expando-js
========
>Copyright (C) Joshua Tenner - 2013

>Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
>
>The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
>
>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

If you ever needed to make a shorthand for HTML expansion like EMMET or HAML, this is your kind of library.

This library creates a global object called expando and is powerful enough to perform quick HTML expansion with a very small amount of text.

Examples:

Expansion | Result (minified)
---|---|---
`.test{.child-test}`| `<div class="test"><div class="child-test"></div></div>`
`input[required]`|`<input required>`
`{=Escaped Text}`|`<div>Escaped Text</div>`

Note that elements that _never have child elements_ or _don't need a closing tag_ will automatically render without one unless they have children.

API usage
=========
```javascript
expando(expansion,  templateobj); 
//or
var cachedExpression = expando.compile(expression);
cachedExpression(templateobj);
```

And there it is, very easy to use.

Expansion Syntax
================
Combinator | Description
---|---
`[attributes]`| This sequence will place `attributes` into the current element context
`.test` | Identifies a class
`%property` | If a templateobj is specified, it will place the property value inline into the expansion
`{expansion}` | Place the `expansion` into the contents of the current element
`+` | Sibling Combinator, ex: `div+div` results in 2 divs. `div div` _does not work_.

Escape Sequences
================
In order to use a combinator as part of the text in a child element, the text must be escaped.  Future versions will automatically escape text produced by the templating engine.


Notes:
======
This library was designed for size and speed as a templating engine. 

Check out [jsperf Emmet vs Expando performance](http://jsperf.com/emmet-vs-expando/2).

Enjoy!
