describe 'tableManners', ->

  # Add a div for storing tables in so it doesn't mix with the UI
  $ -> ($ 'body').append '<div id="testTables"></div>'
  
  # Function for creating new tables
  createTable = (id) ->
    ($ '#testTables').append "<table id='#{id}'></table>"
    $ '#'+ id
  
  beforeEach -> @table = createTable 'testTable'
  
  afterEach -> ($ 'body table').remove()
  
  it 'is defined', ->
    (expect @table.tableManners).toBeDefined()
  
  it 'returns the selected object', ->
    (expect @table).toEqual @table.tableManners()
  
  it 'adds the class "mannered" to each table in the selector', ->
    @table.tableManners()
    (expect @table.hasClass 'mannered').toBe true
    
  it 'adds a class to cells if the mouse is on a different table cell', ->
    @table.html """
      <tr> <td></td> <td></td> </tr>
      <tr> <td></td> <td></td> </tr>
    """
    
    @table.tableManners()
    matrix = @table.tableToMatrix()
    
    @table.trigger 'mouseenter'
    ($ matrix[0][0]).trigger 'mouseenter'
    
    (expect ($ matrix[1][1]).hasClass "tm_blur").toEqual true
    (expect ($ matrix[0][1]).hasClass "tm_blur").toEqual true
    (expect ($ matrix[1][0]).hasClass "tm_blur").toEqual true
    (expect ($ matrix[0][0]).hasClass "tm_blur").toEqual false
  
  it 'removes cell classes when mouse leaves the table', ->
    @table.html """
      <tr> <td></td><td></td></tr>
      <tr> <td></td><td></td> </tr>
    """
    
    @table.tableManners()
    matrix = @table.tableToMatrix()
    cell = ($ matrix[1][1])
    
    # move over the cell
    @table.trigger 'mouseenter'
    ($ matrix[0][0]).trigger 'mouseenter'
    (expect cell.hasClass "tm_blur").toEqual true
    
    # now move away from the table
    @table.trigger 'mouseleave'
    (expect cell.hasClass "tm_blur").toEqual false
  
  it 'adds a default style to the head for tables', ->
    @table.tableManners()
    (expect ($ '#tm_style').length).toEqual 1
    
  it 'has a debug option which removes and resets any style added', ->
    @table.tableManners debugStyle: true
    (expect ($ '#tm_style').length).toEqual 0
  
  it 'has an option to prevent adding style', ->
    # clear the style
    @table.tableManners debugStyle: true
    
    myTable = createTable 'myTable'
    myTable.tableManners noStyle: true
    (expect ($ '#tm_style').length).toEqual 0
  
  it 'adds a different class for header cells when a cell has hover', ->
    @table.html """
      <tr> <td id='foo'></td> <td headers='foo'></td> </tr>
      <tr> <td></td> <td></td> </tr>
    """
    
    @table.tableManners()
    matrix = @table.tableToMatrix()
    
    @table.trigger 'mouseenter'
    matrix[0][1].trigger 'mouseenter'
    
    (expect matrix[0][0].hasClass "tm_header").toEqual true
    (expect matrix[0][0].hasClass "tm_blur").toEqual false
    (expect matrix[0][1].hasClass "tm_header").toEqual false
    (expect matrix[1][0].hasClass "tm_header").toEqual false
    (expect matrix[1][1].hasClass "tm_header").toEqual false
  
  
  it 'puts tm_grouped class on cells in its group', ->
    @table.html """
      <colgroup span='2' />
      <tr> <td></td> <td></td> <td></td> </tr>
      <tr> <td></td> <td></td> <td></td> </tr>
    """
    @table.tableManners()
    matrix = @table.tableToMatrix()
    @table.trigger 'mouseenter'
    matrix[0][0].trigger 'mouseenter'
    
    (expect matrix[0][0].hasClass "tm_grouped").toEqual false
    (expect matrix[0][1].hasClass "tm_grouped").toEqual true
    (expect matrix[0][2].hasClass "tm_grouped").toEqual false
    (expect matrix[1][0].hasClass "tm_grouped").toEqual true
    (expect matrix[1][1].hasClass "tm_grouped").toEqual true
    (expect matrix[1][2].hasClass "tm_grouped").toEqual false
  ###
  it 'uses standard method for scope col and row when this is set in options', ->
  
  it 'uses new method rules for scope col and row when this is set in options', ->
  
  it 'assumes standard association rules if html 5 doctype was not used', ->
  
  ###