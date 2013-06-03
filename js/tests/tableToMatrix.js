(function() {

  describe('tableToMatrix', function() {
    beforeEach(function() {
      ($('body')).append("<table id='testTable'></table>");
      return this.table = $('#testTable');
    });
    afterEach(function() {
      return ($('#testTable')).remove();
    });
    it('is defined', function() {
      return (expect(this.table.tableToMatrix)).toBeDefined();
    });
    it('returns an empty array on an empty table', function() {
      return (expect(this.table.tableToMatrix().length)).toEqual(0);
    });
    it('returns the correct number of rows', function() {
      this.table.html('<tr></tr> <tr></tr> <tr></tr>');
      return (expect(this.table.tableToMatrix().length)).toEqual(3);
    });
    it('returns the correct number of cells in a row', function() {
      var matrix;
      this.table.html("<tr> </tr>\n<tr> <td></td> </tr>\n<tr> <th></th><td></td> </tr>\n<tr> <td colspan=\"3\"></td> </tr>");
      matrix = this.table.tableToMatrix();
      (expect(matrix[0].length)).toEqual(0);
      (expect(matrix[1].length)).toEqual(1);
      (expect(matrix[2].length)).toEqual(2);
      return (expect(matrix[3].length)).toEqual(3);
    });
    return it('can move cells onto multiple rows with rowspan', function() {
      var matrix;
      this.table.html("<tr> <td></td><td rowspan=\"4\"></td> </tr>\n<tr> <th></th><td></td> </tr>\n<tr> <td colspan=\"4\"></td> </tr>");
      matrix = this.table.tableToMatrix();
      (expect(matrix.length)).toEqual(4);
      (expect(matrix[0].length)).toEqual(2);
      (expect(matrix[1].length)).toEqual(3);
      (expect(matrix[2][0])).toEqual(matrix[2][1]);
      (expect(matrix[3].length)).toEqual(2);
      (expect(matrix[3][0])).toEqual(void 0);
      return (expect(matrix[3][1])).toBeDefined();
    });
  });

}).call(this);
