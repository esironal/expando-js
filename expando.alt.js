var expandoalt = function(){
	var lex = /([^\{\}\+\\]*)([\\\+\{\}])?/gm,
		id = /\#([a-z][a-z\-\_0-9]*)/i,
        cls = /\.([a-z][a-z\-\_0-9]*)/gi,
        tag = /^[\s]*([a-z]*)/i,
        cnt = /\*([0-9]*)/,
	forEach = Array.prototype.forEach,
	node = function() {
		this.tag = "div";
		this.classList = [];
		this.id = "";
		this.modifiers = "";
		this.expansion = "";
		this.children = [];
		this.count = 1;
	},
	EM = function(n, strict, tabs) {
		tabs = tabs || 0;
		var noEndTag = false, read;
		switch (n.tag.toLowerCase()) {
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
		  case "":
			return "";
		}
		var start = "<" + n.tag;
		start += n.id ? ' id="' + n.id + '"' : "";
		start += n.modifiers ? " " + n.modifiers : "";
		if (n.classList.length) {
			start += ' class="';
			for(var i = 0; i < n.classList.length; i++){
				start += (i > 0 ? " " : "") + n.classList[i].match(/[\.]([a-z\_\-]*)/i)[1];
			}
			start += '"';
		}
		start += (noEndTag && strict && !n.children.length ? " /" : "") + ">";
		if (n.children.length) {
			for(var i = 0; i<n.children.length; i++){
				start += EM(n.children[i], strict, tabs+1);
			}
		}
		start += !noEndTag || n.children.length ? "</" + n.tag + ">" : "";
		var repeat = start;
		for (var i = 2; i <= n.count; i++) {
			start += repeat;
		}
		return start;
	},
	push = Array.prototype.push,
	lexf = function(instructions){
		var read, nodelist = [], index=0;
		while(read = instructions.shift()){
			if(!nodelist[index])
				nodelist[index] = new node();
			nodelist[index].expansion += read.slice(0,-1);
			switch(read.slice(-1)){
				case "{":
					push.apply(nodelist[index].children, lexf(instructions));
					break;
				case "}":
					return nodelist;
				case "\\":
					if(read = instructions[0]){
						nodelist[index].expansion += read[0];
						instructions[0] = read.slice(1);
					}
					break;
				case "+":
					index++;
			}
		}
		return nodelist;
	},
	parse = function(tree){
		var res = "", read;
		while(read = tree.shift()){
			res += EM(read.expand());
		}
		return res;
	},
	expando = function(expansion){
		return parse(lexf(expansion.match(lex)))||"<div></div>";
	};
	node.prototype.expand = function() {
        var x = this.expansion;
		if(x||this.children.length){
			this.id = ((x.match(id) ? x.match(id)[1] : this.id) || this.id).trim();
			this.tag = ((x.match(tag) ? x.match(tag)[0] : this.tag) || this.tag).trim();
			this.classList = x.match(cls) || [];
			var cl = this.classList;
			for (var i = 0; i < cl.length; i++) {
				cl[i] = cl[i].trim();
			}
			this.count = x.match(cnt) ? parseInt(x.match(cnt)[1]) : 1;
			if (this.children.length) for (var i = 0; i < this.children.length; i++) {
				this.children[i].expand();
			}
		} else {
			this.tag = "";
		}
		return this;
    };
	return expando;
}();
