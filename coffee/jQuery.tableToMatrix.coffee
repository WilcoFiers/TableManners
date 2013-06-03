###
This plugin returns a matrix (nested arrays) containing the table cell nodes
###
jQuery.fn.tableToMatrix = ->
  # Start values
  matrix   = []
  rowNum   = 0
  colTotal = 0
  
  # loop over every row
  (@find 'tr').each ->
    colNum = 0 # Add to the row from column 0
    
    if matrix[rowNum] is undefined
      matrix[rowNum] = []
    
    # loop over every cell in the row
    (($ this).children 'td, th').each ->
      cell = ($ this) # jQuery accesser
      
      # Get the colspan and rowspan as a number, where undefined = 1
      {colspan, rowspan} = cell.getCellSpan()
      
      # Find the next empty cell in the row. Due to rowspan that might differ
      while matrix[rowNum] isnt undefined and
            matrix[rowNum][colNum] isnt undefined
        colNum += 1
      
      # Add cells depending on the rowspan
      for row in [0..rowspan-1]
        # Add the cell depending on the colspan
        for col in [0..colspan-1]
        
          # Add a row if it's not yet defined
          if matrix[rowNum + row] is undefined
            matrix[rowNum + row] = [] 
          # Add the DOM element to the matrix
          matrix[rowNum + row][colNum + col] = cell
          
      # increment a number for the column
      colNum += colspan
      
      if colTotal < colNum then colTotal = colNum
      # END td/th loop
    rowNum += 1
    # END tr loop
    
  matrix
  # END getCellAssociations plugin
  

