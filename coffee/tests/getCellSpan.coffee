describe 'getCellSpan', ->
  #Add a div for storing tables in so it doesn't mix with the UI
  $ -> ($ 'body').append '<div id="testTables"></div>'
  
  #Function for creating new tables
  createTable = (id) ->
    ($ '#testTables').append "<table id='#{id}'></table>"
    $ '#'+ id
  
  #beforeEach -> @table = createTable 'testTable'
  
  beforeEach ->
    @table = createTable 'testTable'
    @table.html "<td></td>"
    @cell = $ 'td', @table
    
  afterEach -> ($ 'body table').remove()
  
  it 'is defined', ->
    (expect @cell.getCellSpan).toBeDefined()
    
  it 'returns an object with colspan and rowspan as properties', ->
    span = @cell.getCellSpan()
    (expect span.colspan).toBeDefined()
    (expect span.rowspan).toBeDefined()
    
  it 'uses cols/rows 1 if span is not defined', ->
    span = @cell.getCellSpan()
    (expect span.colspan).toEqual 1
    (expect span.rowspan).toEqual 1
    
  it 'accepts colspan and rowspan great then 1', ->
    @cell.attr
      colspan: 2
      rowspan: 3
      
    span = @cell.getCellSpan()
    (expect span.colspan).toEqual 2
    (expect span.rowspan).toEqual 3
  
  it 'normalizes colspan and rowspan with invalid values', ->
    @cell.attr
      colspan: 0
      rowspan: 0
    span = @cell.getCellSpan()
    (expect span.colspan).toEqual 1
    (expect span.rowspan).toEqual 1
    
    @cell.attr
      colspan: 'a'
      rowspan: 'b'
    span = @cell.getCellSpan()
    (expect span.colspan).toEqual 1
    (expect span.rowspan).toEqual 1
    
    @cell.attr
      colspan: -2
      rowspan: -2
    span = @cell.getCellSpan()
    (expect span.colspan).toEqual 1
    (expect span.rowspan).toEqual 1
    
  