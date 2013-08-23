var expando  = (function(){
	var node = function(){
		this.tag = "div";
		this.id = "";
		this.classList = [];
		this.children = [];
		this.mods = "";
		this.expansion = "";
	};
	node.prototype.expand = function(){
		if(this.literal)
			return this.literal;
		var res = "<"+this.tag +(this.id ? ' id="'+this.id+'"':"") +(this.classList.length?' class="'+this.classList.join(' ')+'"':"") +(this.mods ? " " + this.mods : "")+">"
		var read;
		while(read = this.children.shift()){
			res += read.expand();
		}
		switch(this.tag.toLowerCase()){
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
			res+="</"+this.tag+">"
		}
		return res;
	}
	var regex = {
		cls: /\.([a-z][a-z0-9\-\_]*)/ig,
		id: /\#([a-z][a-z0-9\-\_]*)/ig
	};
	var treeify = function(bytes){
		var read, nodelist = [], index = 0;
		if(!nodelist[index]){
			nodelist[index] = new node();
		}
		while(read = bytes.shift()){
			switch(read){
				case "+":
					index++;
					break;
				case "{":
					nodelist[index].children = treeify(bytes);
					break;
				case "}":
					return nodelist;
				case "[":
					var esc = false;
					while(read = bytes.shift() && (esc || read !== "]")){
						esc = false;
						nodelist[index].mods += (!(read==="\\") ? read : "");
						esc = (read==="\\");
					}
				default:
					nodelist[index].expansion += read;
			}
		}
		return nodelist;
	}, build = function(tree){
		for(var i = 0; i < tree.length; i++){
			var read;
			while(read = regex.cls.exec(tree[i].expansion)){
				tree[i].classList.push(read[1]);
			}
			if(read = regex.id.exec(tree[i].expansion)){
				tree[i].id = read;
			}
			
		}
		return tree;
	};
	var module = {
		expand: function(expansion){
			var nodelist = build(treeify(expansion.split(''))), node, res = "";
			while(node = nodelist.shift()){
				res += node.expand();
			}
			return res;
		}
	}
	return module;
})();

console.log(expando.expand("div.test{.test}"));
