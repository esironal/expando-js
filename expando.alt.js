var expando = (function() {
    var node = function() {
        this.tag = "div";
        this.id = "";
        this.classList = [];
        this.children = [];
        this.mods = "";
        this.expansion = "";
        this.literal = "";
    };
    node.prototype.expand = function() {
        if (this.literal) return this.literal;
        var res = "<" + this.tag + (this.id ? ' id="' + this.id + '"' : "") + (this.classList.length ? ' class="' + this.classList.join(' ') + '"' : "") + (this.mods ? " " + this.mods : "") + ">"
        var read, i = -1;
        while (read = this.children[++i]) {
            res += read.expand();
        }
        switch (this.tag.toLowerCase()) {
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
            break;
        default:
            res += "</" + this.tag + ">"
        }
        return res;
    }
    var regex = {
        cls: /\.([a-z][a-z0-9\-\_]*)/ig,
        id: /\#([a-z][a-z0-9\-\_]*)/ig,
    	tag: /^[\s]*([a-z]*)/ig
    };
    var treeify = function(expansion){
        var i = -1;
        var subtree = function(){
			
            // This function only cares about making the tree and putting the text into the right context.
            var nodelist = [], index = 0, read = "";
            while(read = expansion[++i]){
                if(!nodelist[index])
                    nodelist[index] = new node();
                switch(read){
                    case "{":
                        //concat multiple expansions
                        nodelist[index].children.push.apply(nodelist[index].children, subtree());
						
                        //prevent expansion spill over 
                        nodelist[index].expansion += " ";
                        break;
                    case "}":
                        return nodelist;
                    case "(":
                        //text literal child, lex all the text into a child literal
                        var escaped = false, childnode = new node(); 
                        while(read = expansion[++i] && (read !== ')' || escaped)){
                            childnode.literal += read;
                            escaped = escaped ? false : read === "\\";
                        }
                        nodelist[index].push(childnode);
                        //prevent class/id spillover
                        nodelist[index].expansion += " ";
                        break;
                    case "[":
                        var escaped = false; 
                        //prevent mods from concatenating unnecessarily
                        childnode.mods += " ";
                        while(read = expansion[++i] && (read !== ']' || escaped)){
                            childnode.mods += read;
                            escaped = escaped ? false : read === "\\";
                        }
                        //prevent class/id spillover
                        nodelist[index].expansion += " ";
                        break;
                    case "+":
                        index++;
                        break;
                    default:
                       nodelist[index].expansion += read; 
                }
            }
            return nodelist;
        };
        return subtree();
    }, build = function(tree){
        var index = 0, read, readstr = "";
        while(read = tree[index++]){
            if(!read.literal){
                while(readstr = regex.cls.exec(read.expansion)){
                    read.classList.push(readstr[1]);
                }
                if(readstr = regex.id.exec(read.expansion)){
                    read.id = readstr[1];
                }
		if(readstr = regex.tag.exec(read.expansion)){
			read.tag = readstr[1];
		}
                if(read.children.length){
                    build(read.children);
                }
            }
        }
		return tree;
    };
    var module = {
        expand: function(expansion) {
            //API entrance
            return module.parse(module.lex(expansion));
            
        },
        lex: function(expansion){
            return build(treeify(expansion));
        },
        parse: function(tree){
            var node, res = "", index = -1;
            while (node = tree[++index]) {
                res += node.expand();
            }
            return res;
        }
    }
    //expose the api
    return module;
})()
