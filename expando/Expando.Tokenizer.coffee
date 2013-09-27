class tokenizer
  
  isAn=(_char)->
    (_char >= "a" and _char <= "z") or (_char >= "A" and _char <= "Z") or (_char >= "0" and _char <= "9")
  isA=(_char)->
    (_char >= "a" and _char <= "z") or (_char >= "A" and _char <= "Z")
  isCombinator=(_char)->
    _char is "." or _char is "#" or _char is "{" or _char is "}" or _char is "+" or _char is "["
  isN=(_char)->
    (_char >= "0" and _char <= "9")
  constructor: (expansion) ->
    @expansion = expansion
    @length = expansion.length
    @location = 0
  readToken: ->
    {location, length, expansion} = {@location, @length, @expansion}
    if location > length-1
      return {type:"EOT"}
    _char = expansion.charAt location
    if _char is "{" or _char is "}" or _char is "+" or _char is "["
      if _char is "{" and (expansion.charAt (location+1)) is "="
        @location+=2
        return @escapedReadUntil "}","LITERAL"
      if _char is "["
        @location++
        return @escapedReadUntil "]","ATTRIBUTES"
      @location++
      return {token: _char,type: "COMBINATOR"}  
    if isA _char
      return @alphaNumericRead("TAG")
    if _char is "."
      @location++
      return @alphaNumericRead("CLASS")
    if  _char is "#"
      @location++
      return @alphaNumericRead("ID")
    if _char is "*"
      @location++
      return @numericRead("COUNT")
    res = _char
    until (isA(_char) or isCombinator(_char) or location > length)
      res+= (_char = expansion.charAt(++location))
    @location = location
    return @readToken()
    
  escapedReadUntil: (endChar, type)->
    location = @location
    length = @length
    expansion = @expansion
    res = ""
    while (_char = expansion.charAt (location) ) != endChar and location < length
      res+=_char
      location++
    @location = ++location
    { token: res, type: type }

  alphaNumericRead: (type) ->
    location = @location
    expansion = @expansion
    res = expansion.charAt(location)
    if isCombinator res
      return {
              token: ""
              type: type
              }
    while isAn (_char = (expansion.charAt ++location))
      res+=_char
    @location = location
    { token: res, type: type }
  
  numericRead: (type) ->
    location = @location
    expansion = @expansion
    res = expansion.charAt(location)
    if isCombinator res
      return {
              token: ""
              type: type
              }
    while isN (_char = (expansion.charAt ++location))
      res+=_char
    @location = location
    { token: res, type: type }