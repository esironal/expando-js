class node
  voidElements = " area base br col command embed hr img input keygen link meta param source track wbr "
  repeat = (str, times) ->
    res = ""
    while times > 0
      res += str  if times % 2 is 1
      str += str
      times >>= 1
    res
  constructor: ->
    @classList = []
    @id = ""
    @attributes = ""
    @tag = ""
    @count = 1
    @children = []
  expand: ->
    if !(typeof @literal == "undefined")
      return @literal
    {tag, id, attributes, count, children} = {@tag, @id, @attributes, @count, @children}
    classes = @classList.join ' '
    return "" if classes is "" and tag is "" and id is "" and attributes is "" and children.length is 0 and count is 1 
    
    if tag == ""
      tag = "div"
    endTag = (voidElements.indexOf (" "+tag+" ")) == -1
    hasClasses = classes.length > 0
    hasId = id != ""
    res = "<#{tag}"
    if hasClasses
      res+=' class="'+classes+'"'
    if hasId
      res+=' id="'+id+'"'
    if attributes.length > 0
      res+=" "+attributes
    res+=">"
    if children.length > 0
      (res+= mynode.expand()) for mynode in children
    if endTag
      res+="</#{tag}>"
    res = repeat(res, count) if count > 1
    return res
