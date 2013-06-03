(function() {

  describe('getCellAssociations', function() {
    var createTable;
    $(function() {
      return ($('body')).append('<div id="testTables"></div>');
    });
    createTable = function(id) {
      ($('#testTables')).append("<table id='" + id + "'></table>");
      return $('#' + id);
    };
    beforeEach(function() {
      this.table = createTable('testTable');
      this.table.html("<tr> <td></td> <td></td> </tr>\n<tr> <td></td> <td id='testCell'></td> </tr>");
      this.matrix = this.table.tableToMatrix();
      return this.cell = this.matrix[0][0];
    });
    afterEach(function() {
      return ($('body table')).remove();
    });
    it('is defined', function() {
      return (expect(this.cell.getCellAssociations)).toBeDefined();
    });
    it('returns an object containing headers, aligned and grouped', function() {
      var aligned, grouped, headers, _ref;
      _ref = this.cell.getCellAssociations(), headers = _ref.headers, aligned = _ref.aligned, grouped = _ref.grouped;
      (expect(headers)).toBeDefined();
      (expect(aligned)).toBeDefined();
      return (expect(grouped)).toBeDefined();
    });
    it('finds headers associated with the headers attribute', function() {
      var headers;
      this.matrix[0][0].attr('id', 'foo');
      this.matrix[0][1].attr('id', 'bar');
      this.matrix[1][1].attr('headers', ' foo, bar ');
      headers = this.matrix[1][1].getCellAssociations().headers;
      (expect(headers.length)).toEqual(2);
      headers = headers.not(this.matrix[0][0]);
      (expect(headers.length)).toEqual(1);
      headers = headers.not(this.matrix[0][1]);
      return (expect(headers.length)).toEqual(0);
    });
    it('ignores any headers from the headers attribute not in the same table', function() {
      var headers, matrix, table2;
      table2 = createTable('table2');
      table2.html("<tr> <td></td> <td></td> </tr>\n<tr> <td></td> <td id='bar'></td> </tr>");
      this.table.html("<tr> <td headers='foo bar'></td> <td></td> </tr>\n<tr> <td></td> <td id='foo'></td> </tr>");
      matrix = this.table.tableToMatrix();
      headers = matrix[0][0].getCellAssociations().headers;
      (expect(headers.length)).toEqual(1);
      headers = headers.not(matrix[1][1]);
      return (expect(headers.length)).toEqual(0);
    });
    return it('ignores other headers if the headers attribute is used', function() {
      var headers, matrix;
      this.table.html("<tr> <th></th> <td headers='myheader'></td> <td id='myheader'></td> </tr>");
      matrix = this.table.tableToMatrix();
      headers = matrix[0][1].getCellAssociations().headers;
      (expect(headers.length)).toEqual(1);
      headers = headers.not(matrix[0][2]);
      return (expect(headers.length)).toEqual(0);
    });
    /*
      it 'determines if a page is html 5 based on doctype if the option is not set', ->
    */
  });

}).call(this);
