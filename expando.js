/*Copyright (C) Joshua Tenner - 2013

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.*/
var expando = function() {
    var regex = {
        id: /[\#]([a-z\-\_0-9]*)/i,
        cls: /[\.]([a-z\-\_0-9]*)/gi,
        tag: /^[a-z]*/gi,
        cnt: /[\*]([0-9]*)/
    }, module = {
        node: function() {
            this.tag = "div";
            this.classList = [];
            this.id = "";
            this.modifiers = "";
            this.expansion = "";
            this.children = [];
            this.count = 1;
        },
        expand: function(expression, strict) {
            var tree = module.treeify(expression.split(""));
            var result = "";
            for (var i = 0; i < tree.length; i++) {
                tree[i].expand();
                result += module.EM(tree[i], strict);
            }
            return result;
        },
        treeify: function(bytes) {
            var read = "", nodelist = [], index = 0;
            while (read = bytes.shift()) {
                if (typeof nodelist[index] === "undefined") {
                    nodelist[index] = new module.node();
                }
                switch (read) {
                  case "{":
                    nodelist[index].children = module.treeify(bytes);
                    break;

                  case "}":
                    return nodelist;

                  case "+":
                    index++;
                    break;

                  case "[":
                    var ignoreNext = false, reading = true;
                    while (bytes.length > 0 && reading) {
                        read = bytes.shift();
                        if (ignoreNext) {
                            nodelist[index].modifiers += read;
                            ignoreNext = false;
                        } else {
                            nodelist[index].modifiers += !(read == "]") && !(read == "\\") ? read : "";
                            ignoreNext = read == "\\";
                            reading = !(read == "]");
                        }
                    }
                    break;

                  default:
                    nodelist[index].expansion += read;
                }
            }
            return nodelist;
        },
        EM: function(node, strict, tabs) {
            tabs = tabs || 0;
            var noEndTag = false;
            switch (node.tag.toLowerCase()) {
              case "link":
              case "meta":
              case "img":
              case "area":
              case "source":
              case "br":
              case "basefront":
              case "col":
              case "hr":
              case "input":
              case "keygen":
              case "embed":
              case "keygen":
              case "param":
              case "source":
              case "track":
              case "wbr":
                noEndTag = true;
                break;
            }
            var start = "<" + node.tag;
            start += node.id ? ' id="' + node.id + '"' : "";
            start += node.modifiers ? " " + node.modifiers : "";
            if (node.classList.length) {
                start += ' class="';
                for (var i = 0; i < node.classList.length; i++) {
                    start += (i > 0 ? " " : "") + node.classList[i].match(/[\.]([a-z\_\-]*)/i)[1];
                }
                start += '"';
            }
            start += (noEndTag && strict && !node.children.length ? " /" : "") + ">";
            if (node.children.length) {
                for (var i = 0; i < node.children.length; i++) {
                    start += module.EM(node.children[i], strict, tabs + 1);
                }
            }
            start += !noEndTag || node.children.length ? "</" + node.tag + ">" : "";
            var repeat = start;
            for (var i = 2; i <= node.count; i++) {
                start += repeat;
            }
            return start;
        }
    };
    module.node.prototype.expand = function() {
        var x = this.expansion;
        this.id = (x.match(regex.id) ? x.match(regex.id)[1] : this.id) || this.id;
        this.tag = (x.match(regex.tag) ? x.match(regex.tag)[0] : this.tag) || this.tag;
        this.classList = x.match(regex.cls) || [];
        this.count = x.match(regex.cnt) ? parseInt(x.match(regex.cnt)[1]) : 1;
        if (this.children) for (var i = 0; i < this.children.length; i++) {
            this.children[i].expand();
        }
    };
    return module;
}();