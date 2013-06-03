describe 'getCellAssociations with html 4 / xhtml', ->
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
  
    
  it 'finds implicit th headers', ->
    @table.html """
      <tr> <td colspan='4'></td> <th>-</th> </tr>
      <tr> <td colspan='4'></td> <td></td> </tr>
      <tr> <td colspan='4'></td> <th>X</th> </tr>
      <tr> <td colspan='4'></td> <th>X</th> </tr>
      <tr> <th>-</th> <td></td> <th>X</th> <th>X</th> <td>O</td></tr>
    """
    matrix = @table.tableToMatrix()
    {headers} = matrix[4][4].getCellAssociations html5: false
    # expect to find the following headers
    cells = [matrix[2][4], matrix[3][4], matrix[4][2], matrix[4][3]]
    
    (expect headers.length).toEqual cells.length
    while cell = cells.pop()
      headers = headers.not cell
      (expect headers.length).toEqual cells.length
  
  
  it 'finds scope col and row headers', ->
    @table.html """
      <tr> <td colspan='4'></td> <th scope='col'>X</th> </tr>
      <tr> <td colspan='4'></td> <td scope='col'>X</td> </tr>
      <tr> <td colspan='4'></td> <td scope='row'>-</td> </tr>
      <tr> <td colspan='4'></td> <th>X</th> </tr>
      <tr> <th scope='row'>X</th> <td scope='row'>X</td> <td scope='col'>-</td> <th>X</th> <td>O</td></tr>
    """
    matrix = @table.tableToMatrix()
    {headers} = matrix[4][4].getCellAssociations html5: false
    # expect to find the following headers
    cells = [matrix[0][4], matrix[1][4], matrix[3][4],
             matrix[4][0], matrix[4][1], matrix[4][3]]
      
    (expect headers.length).toEqual cells.length
    while cell = cells.pop()
      headers = headers.not cell
      (expect headers.length).toEqual cells.length
  
  
  it 'finds scope col and row headers of spanning cells', ->
    @table.html """
      <tr> <td></td>   <td scope='col'>X</td> <td scope='col'>X</td> </tr>
      <tr> <td scope='row'>X</td> <td colspan='2' rowspan='2'>O</td> </tr>
      <tr> <td scope='row'>X</td>                                     </tr>
    """
    matrix = @table.tableToMatrix()
    {headers} = matrix[1][1].getCellAssociations html5: false
    # expect to find the following headers
    cells = [matrix[0][1], matrix[0][2], matrix[1][0], matrix[2][0]]
    (expect headers.length).toEqual cells.length
    while cell = cells.pop()
      headers = headers.not cell
      (expect headers.length).toEqual cells.length
  
  
  it 'finds scope rowgroup headers', ->
    @table.html """
      <tbody><tr>
        <th scope='rowgroup'>-</th> <td scope='rowgroup'>-</td> <th>-</th> <td></td>
            <td rowspan='2'>O</td>
      </tr></tbody> <tbody><tr>
        <th scope='rowgroup'>X</th> <td scope='rowgroup'>X</td> <th>X</th> <td>O</td>
      </tr></tbody>
    """
    matrix = @table.tableToMatrix()
    {headers} = matrix[1][3].getCellAssociations html5: false
    # expect to find the following headers
    cells = [matrix[1][0], matrix[1][1], matrix[1][2]]
    
    (expect headers.length).toEqual cells.length
    while cell = cells.pop()
      headers = headers.not cell
      (expect headers.length).toEqual cells.length
    
    # Now test it when a cell spans outside multiple rowgroup.
    # which should not associate
    {headers} = matrix[0][4].getCellAssociations html5: false
    # expect to find the following headers
    cells = [matrix[0][0], matrix[0][1], matrix[0][2], matrix[1][2]]
    (expect headers.length).toEqual cells.length
    while cell = cells.pop()
      headers = headers.not cell
      (expect headers.length).toEqual cells.length
    
  
  it 'finds scope colgroup headers', ->
    @table.html """
      <colgroup span='1'><col/><col/></colgroup>
      <colgroup span='0' />
      <colgroup span='2' />
      <colgroup span='a' />
      <tr>
        <td scope='colgroup'>A</td>
        <td scope='colgroup'>A</td>
        <td scope='colgroup'>B</td>
        <td scope='colgroup'>C</td>
        <td scope='colgroup'>C</td>
        <td scope='colgroup'>D</td>
      </tr> <tr>
        <td>A</td> <td>A</td>  <td>O</td> <td>C</td> <td>C</td> <td>D</td> <td>D</td>
      </tr> <tr> 
        <td>A</td> <td colspan='3'>O</td> <td>C</td> <td>D</td>
        </tr>
    """
    
    matrix = @table.tableToMatrix()
    {headers} = matrix[1][2].getCellAssociations html5: false
    # expect to find the following headers
    
    (expect headers.length).toEqual 1
    headers = headers.not matrix[0][2]
    (expect headers.length).toEqual 0
    
    # And now for something more complicated
    {headers} = matrix[2][1].getCellAssociations html5: false
    # expect to find the following headers
    cells = [matrix[0][0], matrix[0][1], matrix[0][2], matrix[0][3]]
    
    (expect headers.length).toEqual cells.length
    while cell = cells.pop()
      headers = headers.not cell
      (expect headers.length).toEqual cells.length
    
  
  it 'understands implicit colgroups', ->
    @table.html """
      <tr>
        <td scope='colgroup'>A</td>
        <td scope='colgroup'>B</td>
        <td scope='colgroup'>C</td>
      </tr>
      <tr> <td></td> <td>O</td> <td></td></tr>
    """
    matrix = @table.tableToMatrix()
    {headers} = matrix[1][1].getCellAssociations html5: false
    # expect to find the following headers
    cells = [matrix[0][0], matrix[0][1]]
    
    (expect headers.length).toEqual cells.length
    while cell = cells.pop()
      headers = headers.not cell
      (expect headers.length).toEqual cells.length
  
  
  it 'only uses headers attribute for th elements when html5 is false', ->
    @table.html """
      <tr> <th></th> <td scope='row'></td> <td scope='rowgroup'></td> <th>O</th> </tr>
    """
    [row] = @table.tableToMatrix()
    {headers} = row[3].getCellAssociations html5: false
    (expect headers.length).toEqual 0
  
  
  it 'If rowgroup does not span the entire table they are returned in grouped', ->
    @table.html """
      <tbody><tr>
        <td></td> <td></td> <td></td>
      </tr></tbody> <tbody><tr>
        <td></td> <td></td> <td></td>
      </tr></tbody>
    """
    matrix = @table.tableToMatrix()
    {grouped} = matrix[0][0].getCellAssociations html5: false
    
    cells = [matrix[0][1], matrix[0][2]]
    (expect grouped.length).toEqual cells.length
    while cell = cells.pop()
      grouped = grouped.not cell
      (expect grouped.length).toEqual cells.length
  
  
  it 'If colgroup does not span the entire table they are returned in grouped', ->
    @table.html """
      <colgroup span='3'>
      <tbody><tr>
        <td></td> <td></td> <td></td> <td id='notMe'></td>
      </tr></tbody> <tbody><tr>
        <td></td> <td></td> <td></td> <td></td>
      </tr></tbody>
    """
    matrix = @table.tableToMatrix()
    {grouped} = matrix[0][0].getCellAssociations html5: false
    
    # console.log grouped
    
    cells = [matrix[0][1], matrix[0][2]]
    (expect grouped.length).toEqual cells.length
    while cell = cells.pop()
      grouped = grouped.not cell
      (expect grouped.length).toEqual cells.length
    
    
  it 'ignores other headers if the headers attribute is used', ->
    @table.html """
      <tr> <th></th> <td headers='myheader'></td> <td id='myheader'></td> </tr>
    """
    matrix = @table.tableToMatrix()
    {headers} = matrix[0][1].getCellAssociations html5: false
    (expect headers.length).toEqual 1
    headers = headers.not matrix[0][2]
    (expect headers.length).toEqual 0
    
  ###
  it 'ignores any other header if the headers attribute is used', ->
    
  it 'correctly interprets span attribute on col elements for html 4', ->
  
  it 'allows col elements outside colgroups in html 4', ->
  
  it 'only fills grouped if the group isn't the entire table', ->
  
  it 'understands tables in different directions', ->
  ###
