(function() {

  describe('getCellAssociations with html 5', function() {
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
    return afterEach(function() {
      return ($('body table')).remove();
    });
    /*
      it 'ignores any col element not inside a colgroup', ->
        
      it 'only accepts scope=colgroup if colgroup elements are used', ->
    */
  });

}).call(this);
