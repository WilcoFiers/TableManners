describe 'getCellAssociations', ->
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
  
  it 'is defined', ->
    (expect @cell.getCellAssociations).toBeDefined()
    
    
  it 'returns an object containing headers, aligned and grouped', ->
    {headers, aligned, grouped} = @cell.getCellAssociations()
    (expect headers).toBeDefined()
    (expect aligned).toBeDefined()
    (expect grouped).toBeDefined()
    
    
  it 'finds headers associated with the headers attribute', ->
    @matrix[0][0].attr 'id', 'foo'
    @matrix[0][1].attr 'id', 'bar'
    @matrix[1][1].attr 'headers', ' foo, bar '
    
    {headers} = @matrix[1][1].getCellAssociations()
    
    # Test if the expected headers are present
    (expect headers.length).toEqual 2
    headers = headers.not @matrix[0][0]
    (expect headers.length).toEqual 1
    headers = headers.not @matrix[0][1]
    (expect headers.length).toEqual 0
  
  
  it 'ignores any headers from the headers attribute not in the same table', ->
    table2 = createTable 'table2'
    table2.html """
      <tr> <td></td> <td></td> </tr>
      <tr> <td></td> <td id='bar'></td> </tr>
    """
    @table.html """
      <tr> <td headers='foo bar'></td> <td></td> </tr>
      <tr> <td></td> <td id='foo'></td> </tr>
    """
    matrix = @table.tableToMatrix()
    {headers} = matrix[0][0].getCellAssociations()
    (expect headers.length).toEqual 1
    
    headers = headers.not matrix[1][1]
    (expect headers.length).toEqual 0
  
  it 'ignores other headers if the headers attribute is used', ->
    @table.html """
      <tr> <th></th> <td headers='myheader'></td> <td id='myheader'></td> </tr>
    """
    matrix = @table.tableToMatrix()
    {headers} = matrix[0][1].getCellAssociations()
    (expect headers.length).toEqual 1
    headers = headers.not matrix[0][2]
    (expect headers.length).toEqual 0
  
  
  ###
  it 'determines if a page is html 5 based on doctype if the option is not set', ->
  ###
