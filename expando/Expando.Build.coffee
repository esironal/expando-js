ls = false
callbacks = []
filters = []
setLS = ->
  val = JSON.stringify expando.cache
  localStorage.expandocache = val if localStorage.expandocache isnt val
expando = (expansion)->
  temp = ""
  if (temp = expando.cache[expansion]) is undefined 
    expando.cache[expansion] = temp = (new treeify(expansion)).generateNodes()
    (setTimeout setLS, 0) if ls
  if filters.length > 0
    (temp = filter temp) for filter in filters
  if callbacks.length > 0
    callback temp for callback in callbacks
  temp

expando.cache = []

expando.addFilter = (filter)->
  filters.push filter

expando.addCallback = (callback)->
  callbacks.push callback
if !(typeof window is "undefined")
  window.expando = expando
  try
    ls = "localStorage" of window and window["localStorage"] isnt null
  catch
  if ls
    try
      expando.cache = JSON.parse localStorage.expandocache 
    catch 
      expando.cache = []
if !(typeof module is "undefined") && !(typeof module.exports is "undefined")
  module.exports = expando
