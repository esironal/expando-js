class treeify
  push = Array::push
  cr = "\n"
  lf = "\r"
  generateNodes: (_index)->
    if @expansion
      return @expansion
    {length, tokens} = {@length, @tokens}
    nodeindex = 0
    nodelist = []
    expansion = ""
    nodelist.push new node
    ref = nodelist[0]
    if _index is undefined
      index = @index
    else
      index = _index
    while index < length
      token = tokens[index]
      if token.type is "EOT"
        return ((mynode.expand() for mynode in nodelist).join '') if _index is undefined
        @index = index-1
        return nodelist
      if token.token is "}"
        if  not(_index is undefined)
          @index = index
          return nodelist 
      if nodelist[nodeindex] is undefined
        ref = nodelist[nodeindex] = new node
      if token.token is "+"
        nodeindex++
      if token.token is "{"
        push.apply ref.children,  @generateNodes ++index
        index = @index
        nodeindex++
      if token.type is "CLASS"
        ref.classList.push token.token
      if token.type is "ID"
        ref.id = token.token if ref.id == ""
      if token.type is "TAG"
        ref.tag = token.token if ref.tag == ""
      if token.type is "ATTRIBUTES"
        ref.attributes += token.token
      if token.type is "COUNT"
        ref.count = parseInt token.token if ref.count == 1
      if token.type is "LITERAL"
        child = new node
        child.literal = token.token
        ref.children.push  child
        nodeindex++
      index++
    if _index is undefined
      return (mynode.expand() for mynode in nodelist).join ''
    return nodelist
  constructor: (expansion)->
    mytokenizer = new tokenizer expansion
    tokens = []
    @index = 0
    while x = mytokenizer.readToken()
      tokens.push x
      break if x.type is "EOT"
      
    @tokens = tokens
    @length = tokens.length