var expandoalt = function(){
	var lex = /([^\{\}\+\\]*)([\\\+\{\}])?/gm,
		id = /\#([a-z][a-z\-\_0-9]*)/i,
        cls = /\.([a-z][a-z\-\_0-9]*)/gi,
        tag = /^[\s]*([a-z]*)/i,
        cnt = /\*([0-9]*)/,
		prms = /\[((?:\\\]|[^\]])*)\]/gm,
		t = /[^\\]%([a-z][a-z0-9\_\.]*)/gmi,
		lit = /^\=(.*)\}/,
		newline = /(\r\n|\n|\r)/gm,
	repeat = function (str, times) {
		var res = '';
		while (times > 0) {
			if (times % 2 == 1) {
				res += str;
			}
			str += str;
			times >>= 1;
		}
		return res;
	},
	forEach = Array.prototype.forEach,
	replace = String.prototype.replace,
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
		var noEndTag = false, read;
		if(read = lit.exec(n.expansion)){
			return read[1].trim();
		}
		tabs = tabs || 0;
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
				start += (i > 0 ? " " : "") + n.classList[i].slice(1);
			}
			start += '"';
		}
		start += (noEndTag && strict && !n.children.length ? " /" : "") + ">";
		if (n.children.length) {
			for(var i = 0; i<n.children.length; i++){
				start += EM(n.children[i], strict, tabs+1);
			}
		}
		start += !noEndTag || n.children.length !== 0 ? "</" + n.tag + ">" : "";
		return n.count > 1 ? repeat(start, n.count) : start;
	},
	push = Array.prototype.push,
	lexf = function(instructions){
		var read, nodelist = [], index=0;
		while(read = instructions.shift()){
			if(!nodelist[index])
				nodelist[index] = new node();
			nodelist[index].expansion += read;
			switch(read.slice(-1)){
				case "{":
					push.apply(nodelist[index].children, lexf(instructions));
					break;
				case "}":
					return nodelist;
				case "\\":
					if(read = instructions[0]){
						nodelist[index].expansion = nodelist[index].expansion.slice(0,-1);
						nodelist[index].expansion += read[0].toString();
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
	expando = function(expansion, obj){
		expansion = " " + replace.call(expansion, newline," ");
		if(obj){
			var read;
			expansion = replace.call(expansion,t,function(match, $1){
				var nested = $1.split('.').reverse(), val = obj;
				while(read = nested.pop()){
					val = val[read];
				}
				return match[0]+val;
			});
		}
		return parse(lexf(expansion.match(lex)))||"<div></div>";		
	};
	expando.prototype.compile = function(expansion){
		return Function.prototype.bind ? expando.bind(this, expansion) : function(obj){
			return expando(expansion, obj);
		};
	};
	node.prototype.expand = function() {
        var x = this.expansion, that = this;		
		this.id = ((x.match(id) ? x.match(id)[1] : this.id) || this.id).trim();
		this.tag = ((x.match(tag) ? x.match(tag)[0] : this.tag) || this.tag).trim();
		this.classList = x.match(cls) || [];
		this.count = x.match(cnt) ? parseInt(x.match(cnt)[1]) : 1;
		replace.call(x, prms, function(match, $1){
			that.modifiers += $1 + " ";
		});
		if (this.children.length) for (var i = 0; i < this.children.length; i++) {
			this.children[i].expand();
		}
		return this;
    };
	return expando;
}();