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

Expansion | Code | Result (minified)
---|---|---
`.test{.child-test}`|`expando.expand(".test{.child-test}")`| `<div class="test"><div class="child-test"></div></div>`
`input[required]`|`expando.expand("input[required]")`|`<input required>` 

Note that elements that _never have child elements_ or _don't need a closing tag_ will automatically render without one unless they have children.

API usage
=========
```javascript
expando.expand(expansion, strict/*used for xhtml*/);
```

And there it is, very easy to use.

Expansion Syntax
================
```tagname``` _defaults to div if not specified_

```.class1``` _creates a div element with a class "class1"_

```section.class1``` _creates a section element with a class "class1"_

```#id``` _creates a div element with an id "id"_

```section{child_expansion}``` _creates a section element with children specified by the child expansion_

```ul{li*8{a[href="#target"]}}``` _creates a list with 8 list items that each contain an anchor element with a "href" parameter_

Notes:
======
Anything between ```[``` and ```]``` will be put into the element character for character and it saves the compiler a TON of time.  The only exception to this is when the ] character is escaped.  It must be escaped like this: ```\\]```.

Pull requests welcome, issues/possible performance gains testing would be appreciated.

I plan on adding a few more customization features that may slow down expando's performance for usability.  The goal was to get expando to the point where it became an incredibly quick templating engine, but for now, I want to keep it small and fun.

Check out [jsperf Emmet vs Expando performance](http://jsperf.com/emmet-vs-expando/2).

Enjoy!
