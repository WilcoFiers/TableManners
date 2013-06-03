describe 'tableToMatrix', ->
  beforeEach ->
    ($ 'body').append "<table id='testTable'></table>"
    @table = $ '#testTable'
    
  afterEach ->
    ($ '#testTable').remove()
  
  it 'is defined', ->
    (expect @table.tableToMatrix).toBeDefined()
  
  it 'returns an empty array on an empty table', ->
    (expect @table.tableToMatrix().length).toEqual(0)
    
  it 'returns the correct number of rows', ->
    @table.html '<tr></tr> <tr></tr> <tr></tr>'
    (expect @table.tableToMatrix().length).toEqual 3
    
  it 'returns the correct number of cells in a row', ->
    @table.html """
      <tr> </tr>
      <tr> <td></td> </tr>
      <tr> <th></th><td></td> </tr>
      <tr> <td colspan="3"></td> </tr>
    """
    matrix = @table.tableToMatrix()
    
    (expect matrix[0].length).toEqual 0
    (expect matrix[1].length).toEqual 1
    (expect matrix[2].length).toEqual 2
    (expect matrix[3].length).toEqual 3
  
  it 'can move cells onto multiple rows with rowspan', ->
    @table.html """
      <tr> <td></td><td rowspan="4"></td> </tr>
      <tr> <th></th><td></td> </tr>
      <tr> <td colspan="4"></td> </tr>
    """
    matrix = @table.tableToMatrix()
    
    (expect matrix.length).toEqual 4
    (expect matrix[0].length).toEqual 2
    (expect matrix[1].length).toEqual 3
    (expect matrix[2][0]).toEqual matrix[2][1]
    (expect matrix[3].length).toEqual 2
    (expect matrix[3][0]).toEqual(undefined)
    (expect matrix[3][1]).toBeDefined()
      