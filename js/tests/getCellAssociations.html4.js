(function() {

  describe('getCellAssociations with html 4 / xhtml', function() {
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
    it('finds implicit th headers', function() {
      var cell, cells, headers, matrix, _results;
      this.table.html("<tr> <td colspan='4'></td> <th>-</th> </tr>\n<tr> <td colspan='4'></td> <td></td> </tr>\n<tr> <td colspan='4'></td> <th>X</th> </tr>\n<tr> <td colspan='4'></td> <th>X</th> </tr>\n<tr> <th>-</th> <td></td> <th>X</th> <th>X</th> <td>O</td></tr>");
      matrix = this.table.tableToMatrix();
      headers = matrix[4][4].getCellAssociations({
        html5: false
      }).headers;
      cells = [matrix[2][4], matrix[3][4], matrix[4][2], matrix[4][3]];
      (expect(headers.length)).toEqual(cells.length);
      _results = [];
      while (cell = cells.pop()) {
        headers = headers.not(cell);
        _results.push((expect(headers.length)).toEqual(cells.length));
      }
      return _results;
    });
    it('finds scope col and row headers', function() {
      var cell, cells, headers, matrix, _results;
      this.table.html("<tr> <td colspan='4'></td> <th scope='col'>X</th> </tr>\n<tr> <td colspan='4'></td> <td scope='col'>X</td> </tr>\n<tr> <td colspan='4'></td> <td scope='row'>-</td> </tr>\n<tr> <td colspan='4'></td> <th>X</th> </tr>\n<tr> <th scope='row'>X</th> <td scope='row'>X</td> <td scope='col'>-</td> <th>X</th> <td>O</td></tr>");
      matrix = this.table.tableToMatrix();
      headers = matrix[4][4].getCellAssociations({
        html5: false
      }).headers;
      cells = [matrix[0][4], matrix[1][4], matrix[3][4], matrix[4][0], matrix[4][1], matrix[4][3]];
      (expect(headers.length)).toEqual(cells.length);
      _results = [];
      while (cell = cells.pop()) {
        headers = headers.not(cell);
        _results.push((expect(headers.length)).toEqual(cells.length));
      }
      return _results;
    });
    it('finds scope col and row headers of spanning cells', function() {
      var cell, cells, headers, matrix, _results;
      this.table.html("<tr> <td></td>   <td scope='col'>X</td> <td scope='col'>X</td> </tr>\n<tr> <td scope='row'>X</td> <td colspan='2' rowspan='2'>O</td> </tr>\n<tr> <td scope='row'>X</td>                                     </tr>");
      matrix = this.table.tableToMatrix();
      headers = matrix[1][1].getCellAssociations({
        html5: false
      }).headers;
      cells = [matrix[0][1], matrix[0][2], matrix[1][0], matrix[2][0]];
      (expect(headers.length)).toEqual(cells.length);
      _results = [];
      while (cell = cells.pop()) {
        headers = headers.not(cell);
        _results.push((expect(headers.length)).toEqual(cells.length));
      }
      return _results;
    });
    it('finds scope rowgroup headers', function() {
      var cell, cells, headers, matrix, _results;
      this.table.html("<tbody><tr>\n  <th scope='rowgroup'>-</th> <td scope='rowgroup'>-</td> <th>-</th> <td></td>\n      <td rowspan='2'>O</td>\n</tr></tbody> <tbody><tr>\n  <th scope='rowgroup'>X</th> <td scope='rowgroup'>X</td> <th>X</th> <td>O</td>\n</tr></tbody>");
      matrix = this.table.tableToMatrix();
      headers = matrix[1][3].getCellAssociations({
        html5: false
      }).headers;
      cells = [matrix[1][0], matrix[1][1], matrix[1][2]];
      (expect(headers.length)).toEqual(cells.length);
      while (cell = cells.pop()) {
        headers = headers.not(cell);
        (expect(headers.length)).toEqual(cells.length);
      }
      headers = matrix[0][4].getCellAssociations({
        html5: false
      }).headers;
      cells = [matrix[0][0], matrix[0][1], matrix[0][2], matrix[1][2]];
      (expect(headers.length)).toEqual(cells.length);
      _results = [];
      while (cell = cells.pop()) {
        headers = headers.not(cell);
        _results.push((expect(headers.length)).toEqual(cells.length));
      }
      return _results;
    });
    it('finds scope colgroup headers', function() {
      var cell, cells, headers, matrix, _results;
      this.table.html("<colgroup span='1'><col/><col/></colgroup>\n<colgroup span='0' />\n<colgroup span='2' />\n<colgroup span='a' />\n<tr>\n  <td scope='colgroup'>A</td>\n  <td scope='colgroup'>A</td>\n  <td scope='colgroup'>B</td>\n  <td scope='colgroup'>C</td>\n  <td scope='colgroup'>C</td>\n  <td scope='colgroup'>D</td>\n</tr> <tr>\n  <td>A</td> <td>A</td>  <td>O</td> <td>C</td> <td>C</td> <td>D</td> <td>D</td>\n</tr> <tr> \n  <td>A</td> <td colspan='3'>O</td> <td>C</td> <td>D</td>\n  </tr>");
      matrix = this.table.tableToMatrix();
      headers = matrix[1][2].getCellAssociations({
        html5: false
      }).headers;
      (expect(headers.length)).toEqual(1);
      headers = headers.not(matrix[0][2]);
      (expect(headers.length)).toEqual(0);
      headers = matrix[2][1].getCellAssociations({
        html5: false
      }).headers;
      cells = [matrix[0][0], matrix[0][1], matrix[0][2], matrix[0][3]];
      (expect(headers.length)).toEqual(cells.length);
      _results = [];
      while (cell = cells.pop()) {
        headers = headers.not(cell);
        _results.push((expect(headers.length)).toEqual(cells.length));
      }
      return _results;
    });
    it('understands implicit colgroups', function() {
      var cell, cells, headers, matrix, _results;
      this.table.html("<tr>\n  <td scope='colgroup'>A</td>\n  <td scope='colgroup'>B</td>\n  <td scope='colgroup'>C</td>\n</tr>\n<tr> <td></td> <td>O</td> <td></td></tr>");
      matrix = this.table.tableToMatrix();
      headers = matrix[1][1].getCellAssociations({
        html5: false
      }).headers;
      cells = [matrix[0][0], matrix[0][1]];
      (expect(headers.length)).toEqual(cells.length);
      _results = [];
      while (cell = cells.pop()) {
        headers = headers.not(cell);
        _results.push((expect(headers.length)).toEqual(cells.length));
      }
      return _results;
    });
    it('only uses headers attribute for th elements when html5 is false', function() {
      var headers, row;
      this.table.html("<tr> <th></th> <td scope='row'></td> <td scope='rowgroup'></td> <th>O</th> </tr>");
      row = this.table.tableToMatrix()[0];
      headers = row[3].getCellAssociations({
        html5: false
      }).headers;
      return (expect(headers.length)).toEqual(0);
    });
    it('If rowgroup does not span the entire table they are returned in grouped', function() {
      var cell, cells, grouped, matrix, _results;
      this.table.html("<tbody><tr>\n  <td></td> <td></td> <td></td>\n</tr></tbody> <tbody><tr>\n  <td></td> <td></td> <td></td>\n</tr></tbody>");
      matrix = this.table.tableToMatrix();
      grouped = matrix[0][0].getCellAssociations({
        html5: false
      }).grouped;
      cells = [matrix[0][1], matrix[0][2]];
      (expect(grouped.length)).toEqual(cells.length);
      _results = [];
      while (cell = cells.pop()) {
        grouped = grouped.not(cell);
        _results.push((expect(grouped.length)).toEqual(cells.length));
      }
      return _results;
    });
    it('If colgroup does not span the entire table they are returned in grouped', function() {
      var cell, cells, grouped, matrix, _results;
      this.table.html("<colgroup span='3'>\n<tbody><tr>\n  <td></td> <td></td> <td></td> <td id='notMe'></td>\n</tr></tbody> <tbody><tr>\n  <td></td> <td></td> <td></td> <td></td>\n</tr></tbody>");
      matrix = this.table.tableToMatrix();
      grouped = matrix[0][0].getCellAssociations({
        html5: false
      }).grouped;
      cells = [matrix[0][1], matrix[0][2]];
      (expect(grouped.length)).toEqual(cells.length);
      _results = [];
      while (cell = cells.pop()) {
        grouped = grouped.not(cell);
        _results.push((expect(grouped.length)).toEqual(cells.length));
      }
      return _results;
    });
    return it('ignores other headers if the headers attribute is used', function() {
      var headers, matrix;
      this.table.html("<tr> <th></th> <td headers='myheader'></td> <td id='myheader'></td> </tr>");
      matrix = this.table.tableToMatrix();
      headers = matrix[0][1].getCellAssociations({
        html5: false
      }).headers;
      (expect(headers.length)).toEqual(1);
      headers = headers.not(matrix[0][2]);
      return (expect(headers.length)).toEqual(0);
    });
    /*
      it 'ignores any other header if the headers attribute is used', ->
        
      it 'correctly interprets span attribute on col elements for html 4', ->
      
      it 'allows col elements outside colgroups in html 4', ->
      
      it 'only fills grouped if the group isn't the entire table', ->
      
      it 'understands tables in different directions', ->
    */
  });

}).call(this);
