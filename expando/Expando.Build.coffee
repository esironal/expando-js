expando = (expansion)->
   return (new treeify(expansion)).generateNodes()
tokenize = (expansion)->
   return new tokenizer(expansion)
if !(typeof window is "undefined")
  window.expando = expando
if !(typeof module is "undefined") && !(typeof modules.exports is "undefined")
  modules.exports = expando
window.tokenizer = tokenize