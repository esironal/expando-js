var expando = function() {
    var regex = {
        id: /\#([a-z][a-z\-\_0-9]*)/i,
        cls: /\.([a-z][a-z\-\_0-9]*)/gi,
        tag: /^[\s]*([a-z]*)/i,
        cnt: /\*([0-9]*)/
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
            tree.forEach(function(branch) {
                branch.expand();
                result += module.EM(branch, strict);
            });
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
                node.classList.forEach(function(child, i) {
                    start += (i > 0 ? " " : "") + child.match(/[\.]([a-z\_\-]*)/i)[1];
                });
                start += '"';
            }
            start += (noEndTag && strict && !node.children.length ? " /" : "") + ">";
            if (node.children.length) {
                node.children.forEach(function(child) {
                    start += module.EM(child, strict, tabs + 1);
                });
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
        this.id = ((x.match(regex.id) ? x.match(regex.id)[1] : this.id) || this.id).trim();
        this.tag = ((x.match(regex.tag) ? x.match(regex.tag)[0] : this.tag) || this.tag).trim();
        this.classList = x.match(regex.cls) || [];
        var cl = this.classList;
        for (var i = 0; i < cl.length; i++) {
            cl[i] = cl[i].trim();
        }
        this.count = x.match(regex.cnt) ? parseInt(x.match(regex.cnt)[1]) : 1;
        if (this.children) for (var i = 0; i < this.children.length; i++) {
            this.children[i].expand();
        }
    };
    return module;
}();