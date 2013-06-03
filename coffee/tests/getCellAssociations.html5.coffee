describe 'getCellAssociations with html 5', ->
  # Add a div for storing tables in so it doesn't mix with the UI
  $ -> ($ 'body').append '<div id="testTables"></div>'
  
  # Function for creating new tables
  createTable = (id)->
    ($ '#testTables').append "<table id='#{id}'></table>"
    $ '#'+ id
  
  beforeEach ->
    @table = createTable 'testTable'
    @table.html """
      <tr> <td></td> <td></td> </tr>
      <tr> <td></td> <td id='testCell'></td> </tr>
    """
    @matrix = @table.tableToMatrix()
    @cell = @matrix[0][0]
    
  afterEach -> ($ 'body table').remove()
  
  ###
  it 'ignores any col element not inside a colgroup', ->
    
  it 'only accepts scope=colgroup if colgroup elements are used', ->
  
  ###