jQuery.fn.getCellAssociations = (setOptions)->
  # Default options
  options =
    html5: null
  
  # add user specified options
  for own option, value of setOptions
    options[option] = value
  
  # Get some initial data about the cell
  rowgroup     = @parent().parent()
  table        = rowgroup.parent()
  matrix       = table.tableToMatrix()
  colgroups    = getTableColGroups table

  {rows, cols} = findCellSpan this, matrix
  
  # figure out which method to use to find the headers
  findHeader = if options.html5 then findHtml5Header else findHtml4Header
  
  # Create an empty list for the headers
  headers = $ ''
  
  if (@attr 'headers') isnt undefined
    for headerId in (@attr 'headers').trim().split /\s|,/
      # Add headers
      headers = (headers.add '#' + headerId, table) unless headerId is ''
    return headers
  
  # Find headers in the same row
  for row in rows
    (headers.add findHeader cols[0], row, 1, 0)
  
  # Find headers in the same column
  for col in cols
    (headers.add findHeader col, rows[0], 0, 1)
  
    
###
Locate the 
###
jQuery.fn._getCellAssociations = (setOptions)->
  # Default options
  options =
    html5: null
  
  # add user specified options
  for own option, value of setOptions
    options[option] = value
  
  # Create empty containers for storing cells
  headers = $ ''
  aligned = $ ''
  grouped = $ ''
  
  # locate the table and it's matrix
  rowgroup     = @parent().parent()
  table        = rowgroup.parent()
  matrix       = table.tableToMatrix()
  colgroups    = getTableColGroups table
  implicitRows = []
  implicitCols = []
  target = null
  
  # Create a random id so the target can be identified in the table
  randId   = "rm_temp_target_" + Math.floor(Math.random()*100000)
  targetId = (this.attr 'id') ? ''
  this.attr 'id', randId
  
  # sameRow,   sameCol,   sameRowGroup,   sameColGroup
  
  # Find the outer most column/row of the target cell
  for row in [matrix.length-1..0]
    for col in [(matrix[row].length-1)..0]
      cell = matrix[row][col]
      if cell is undefined then continue
      
      # Locate the target. Only start marking tables if the target is found
      if target is null and cell.attr('id') is randId
        {colspan, rowspan} = cell.getCellSpan()
        # Describe wich cols/rows the target cell is at
        target = 
          pos:
            cols: [col - colspan + 1..col]
            rows: [row - rowspan + 1..row]  
          nodeName: cell.context.nodeName.toLowerCase()
          colgroups: []
          
        # Identify which colgroup the cell belongs to. -1 is used for implicit
        for colNum in target.pos.cols
          colNum = colgroups[colNum] ? -1
          if target.colgroups[target.colgroups.length] isnt colNum
            target.colgroups.push colNum
        continue
      # Cell wasn't found, or this is the same cell
      else if target is null or cell.attr('id') is randId
        continue
      
      nodeName = cell.context.nodeName.toLowerCase()
      sameRow  = ($.inArray row, target.pos.rows) isnt -1
      sameCol  = ($.inArray col, target.pos.cols) isnt -1
      scope    = (cell.attr 'scope') ? ''
      
      ###
      There are different association rules for html 5 then for previous
      versions. In options this can be set.
      ###
      if options.html5 is false
        # In html < 5 th elements only accept headers attr values as headers,
        if target.nodeName is 'th' then continue
        
        ###
        Figure out implicit associations, th same row or column
        
        Only one set of adjecent th elements will count as implicit headers
        Once at a th, the status becomes found. If it then finds a td on 
        the same row/col, the status becomes 'passed'. Once there, th elements
        are not added anymore
        ###
        if sameRow and nodeName is 'th'
          if implicitRows[row] is undefined
            implicitRows[row] = 'found'
            headers = headers.add(cell)
          else if implicitRows[row] is 'found'
            headers = headers.add(cell)
        # Same row, but passed the group of th elements
        else if sameRow and implicitRows[row] isnt undefined
          implicitRows[row] = 'passed'
        
        # Same column, match th elements
        if sameCol and nodeName is 'th'
          if implicitCols[col] is undefined
            implicitCols[col] = 'found'
            headers = headers.add(cell)
          else if implicitCols[col] is 'found'
            headers = headers.add(cell)
        # Same col, but passed the group of th elements
        else if sameCol and implicitCols[col] isnt undefined
          implicitCols[col] = 'passed'
        
        # add headers based on scope
        headers = headers.add switch (cell.attr 'scope')
          when 'row' then cell if sameRow
          when 'col' then cell if sameCol
          when 'rowgroup' 
            cell if cell.parent().parent().not(rowgroup).length is 0
          when 'colgroup'
            if (col < target.pos.cols[0] or sameCol)
              cell if $.inArray((colgroups[col] ? -1), target.colgroups) isnt -1
        
      # END html5 if statement  
      
    # END col loop
  # END row loop
  
  ###
  add headers from the headers attr to the headers list
  ###
  headersAttr = @attr 'headers'
  if headersAttr isnt undefined
    headers = $ ''
    for headerId in headersAttr.trim().split /\s|,/
      # Add headers
      headers = (headers.add '#' + headerId, table) unless headerId is ''

  if colgroups.length > 0
    cols = [] # Find the columns that should be added to 'grouped'
    for group in target.colgroups
      for i in [0..colgroups.length] when colgroups[i] is group
        cols.push i
    # Add all cells in each column
    for row in matrix
      for col in cols
        if row[col] isnt undefined
          grouped = grouped.add row[col]
  # If there is more then one rowgroup: 
  if ($ 'thead, tbody, tfoot', table).length > 1
    # add headers to the group of colgroup didn't so anything
    if grouped.length is 0
      grouped = grouped.add ($ 'td, th', rowgroup)
    else # Otherwise, only group those headers int he same rowgroup and colgroup
      grouped = grouped.filter ($ 'td, th', rowgroup)
    
  grouped = grouped.not(this).not(headers)
  
  # if colgroups.length > 0
    # if grouped.length is 0 then grouped = ($ 'td, th', table)
    # columns = for groups in target.colgroups
    # for row in matrix
      # grouped = grouped.filter
  # Reset the id of the target
  this.attr 'id', targetId
  
  {headers, aligned, grouped}
  # END getCellAssociations plugin
  
  
###
  Find the headers of a cell, using the HTML4 method
###
findHtml4Headers = (initialX, initialY, deltaX, deltaY) ->
  currentThBlock = ($ '')
  
  while x >= 0 and y >= 0
    x += deltaX
    y += deltaY
    
  currentThBlock
  # END findHtml4Headers
  

###
Returns an array with column numbers as a key and an incrementing number for the
colgroup which it is in
###
getTableColGroups = (table)->
  ### (From the HTML specs)
  Span=
  * In the absence of a span attribute, each  COLGROUP defines a column group 
    containing one column.
  * If the span attribute is set to N > 0, the current  COLGROUP element
    defines a column group containing N columns.
  User agents must ignore this attribute if the  COLGROUP element contains one
  or more COL elements.
  ###
  groups = []
  ($ 'colgroup', table).each ->
    cols = ($ 'col', this).length
    if cols is 0
      cols = +($ this).attr('span')
    if cols is 0 or isNaN cols
      cols = 1
    
    # Each column has an incrementing number
    colNum = if groups.length is 0 then 0 else groups[groups.length-1] + 1
    # Add the column number to the right column in the array
    for i in [1..cols]
      groups.push colNum
  groups
  # END getTableColGroups

  
  
### HTML 5 algaritme
isTableHeader = (type, x, y)->
  cell = tupel[x][y]
  if cell.name is 'td' then return false
  
  if cell.scope is type then return true
  if cell.scope is undefined
    if type is 'col'
      for row in tupel[x] where row[y].name is 'td'
        return false
    if type is 'row'
      for rowCell in tupel[x] where rowCell.name = 'td'
        return false
    return true
  return false


findHeaderCell = (initialX, initialY, deltaX, deltaY)->
  opaqueHeaders = ($ '')
  currentThBlock = ($ '')
  headers
  {x, y} = (initialX, initialY)
  
  if tupel[initialX][initialY].name is th
    currentThBlock = currentThBlock.add tupel[x][y]
    headerBlock = true
  else
    headerBlock = false
  
  while x >= 0 and y >= 0
    x += deltaX
    y += deltaY
    
    curCell = tupel[x][y]
    if curCell is undefined curCell.length > 1 then continue 
    
    if curCell.name is 'th'
      headerBlock = true
      currentThBlock = currentThBlock.add curCell
      blocked = false
      if deltaX is 0
        # If there are any cells in the opaque headers list
        # anchored with the same x-coordinate as the current cell, 
        # and with the same width as current cell, 
        # then let blocked be true.
        
        if isColHeader x,y
          blocked = true
          
      else if deltaY is 0
            
      if blocked is false
        headers = headers.add curCell
        
    else if curCell.name is 'td' and headerBlock is true
      headerBlock is false
      opaqueHeaders = opaqueHeaders.add currentThBlock
        
      currentThBlock = $ ''

###