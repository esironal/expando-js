expando = (expansion)->
  temp = ""
  if (temp = expando.cache[expansion]) is undefined 
    expando.cache[expansion] = temp = (new treeify(expansion)).generateNodes()
  temp
tokenize = (expansion)->
  return new tokenizer(expansion)
expando.cache = []
if !(typeof window is "undefined")
  window.expando = expando
if !(typeof module is "undefined") && !(typeof modules.exports is "undefined")
  modules.exports = expando
