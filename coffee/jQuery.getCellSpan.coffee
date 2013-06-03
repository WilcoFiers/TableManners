###
 This plugin returns a matrix (nested arrays) containing the table cell nodes
###
jQuery.fn.getCellSpan = ->
  # Get the colspan and rowspan as a number, where undefined = 1
  colspan = ((this.attr 'colspan') ? 1) * 1
  rowspan = ((this.attr 'rowspan') ? 1) * 1
  
  ###
  At the monent, Explorer, Opera, Safari and Chrome do not support
  colspan 0 for tables. Only Firefox implemented this spec.
  TableManners therefore assumes it's unintended and will treat it as colspan 1
  ###
  # Normalize colspan / rowspan
  if colspan < 1 or isNaN colspan then colspan = 1
  if rowspan < 1 or isNaN rowspan then rowspan = 1
  
  {colspan, rowspan}
  # END getCellSpan plugin