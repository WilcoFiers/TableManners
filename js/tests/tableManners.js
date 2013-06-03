(function() {

  describe('tableManners', function() {
    var createTable;
    $(function() {
      return ($('body')).append('<div id="testTables"></div>');
    });
    createTable = function(id) {
      ($('#testTables')).append("<table id='" + id + "'></table>");
      return $('#' + id);
    };
    beforeEach(function() {
      return this.table = createTable('testTable');
    });
    afterEach(function() {
      return ($('body table')).remove();
    });
    it('is defined', function() {
      return (expect(this.table.tableManners)).toBeDefined();
    });
    it('returns the selected object', function() {
      return (expect(this.table)).toEqual(this.table.tableManners());
    });
    it('adds the class "mannered" to each table in the selector', function() {
      this.table.tableManners();
      return (expect(this.table.hasClass('mannered'))).toBe(true);
    });
    it('adds a class to cells if the mouse is on a different table cell', function() {
      var matrix;
      this.table.html("<tr> <td></td> <td></td> </tr>\n<tr> <td></td> <td></td> </tr>");
      this.table.tableManners();
      matrix = this.table.tableToMatrix();
      this.table.trigger('mouseenter');
      ($(matrix[0][0])).trigger('mouseenter');
      (expect(($(matrix[1][1])).hasClass("tm_blur"))).toEqual(true);
      (expect(($(matrix[0][1])).hasClass("tm_blur"))).toEqual(true);
      (expect(($(matrix[1][0])).hasClass("tm_blur"))).toEqual(true);
      return (expect(($(matrix[0][0])).hasClass("tm_blur"))).toEqual(false);
    });
    it('removes cell classes when mouse leaves the table', function() {
      var cell, matrix;
      this.table.html("<tr> <td></td><td></td></tr>\n<tr> <td></td><td></td> </tr>");
      this.table.tableManners();
      matrix = this.table.tableToMatrix();
      cell = $(matrix[1][1]);
      this.table.trigger('mouseenter');
      ($(matrix[0][0])).trigger('mouseenter');
      (expect(cell.hasClass("tm_blur"))).toEqual(true);
      this.table.trigger('mouseleave');
      return (expect(cell.hasClass("tm_blur"))).toEqual(false);
    });
    it('adds a default style to the head for tables', function() {
      this.table.tableManners();
      return (expect(($('#tm_style')).length)).toEqual(1);
    });
    it('has a debug option which removes and resets any style added', function() {
      this.table.tableManners({
        debugStyle: true
      });
      return (expect(($('#tm_style')).length)).toEqual(0);
    });
    it('has an option to prevent adding style', function() {
      var myTable;
      this.table.tableManners({
        debugStyle: true
      });
      myTable = createTable('myTable');
      myTable.tableManners({
        noStyle: true
      });
      return (expect(($('#tm_style')).length)).toEqual(0);
    });
    it('adds a different class for header cells when a cell has hover', function() {
      var matrix;
      this.table.html("<tr> <td id='foo'></td> <td headers='foo'></td> </tr>\n<tr> <td></td> <td></td> </tr>");
      this.table.tableManners();
      matrix = this.table.tableToMatrix();
      this.table.trigger('mouseenter');
      matrix[0][1].trigger('mouseenter');
      (expect(matrix[0][0].hasClass("tm_header"))).toEqual(true);
      (expect(matrix[0][0].hasClass("tm_blur"))).toEqual(false);
      (expect(matrix[0][1].hasClass("tm_header"))).toEqual(false);
      (expect(matrix[1][0].hasClass("tm_header"))).toEqual(false);
      return (expect(matrix[1][1].hasClass("tm_header"))).toEqual(false);
    });
    return it('puts tm_grouped class on cells in its group', function() {
      var matrix;
      this.table.html("<colgroup span='2' />\n<tr> <td></td> <td></td> <td></td> </tr>\n<tr> <td></td> <td></td> <td></td> </tr>");
      this.table.tableManners();
      matrix = this.table.tableToMatrix();
      this.table.trigger('mouseenter');
      matrix[0][0].trigger('mouseenter');
      (expect(matrix[0][0].hasClass("tm_grouped"))).toEqual(false);
      (expect(matrix[0][1].hasClass("tm_grouped"))).toEqual(true);
      (expect(matrix[0][2].hasClass("tm_grouped"))).toEqual(false);
      (expect(matrix[1][0].hasClass("tm_grouped"))).toEqual(true);
      (expect(matrix[1][1].hasClass("tm_grouped"))).toEqual(true);
      return (expect(matrix[1][2].hasClass("tm_grouped"))).toEqual(false);
    });
    /*
      it 'uses standard method for scope col and row when this is set in options', ->
      
      it 'uses new method rules for scope col and row when this is set in options', ->
      
      it 'assumes standard association rules if html 5 doctype was not used', ->
    */
  });

}).call(this);
