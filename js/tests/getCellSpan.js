(function() {

  describe('getCellSpan', function() {
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
      this.table.html("<td></td>");
      return this.cell = $('td', this.table);
    });
    afterEach(function() {
      return ($('body table')).remove();
    });
    it('is defined', function() {
      return (expect(this.cell.getCellSpan)).toBeDefined();
    });
    it('returns an object with colspan and rowspan as properties', function() {
      var span;
      span = this.cell.getCellSpan();
      (expect(span.colspan)).toBeDefined();
      return (expect(span.rowspan)).toBeDefined();
    });
    it('uses cols/rows 1 if span is not defined', function() {
      var span;
      span = this.cell.getCellSpan();
      (expect(span.colspan)).toEqual(1);
      return (expect(span.rowspan)).toEqual(1);
    });
    it('accepts colspan and rowspan great then 1', function() {
      var span;
      this.cell.attr({
        colspan: 2,
        rowspan: 3
      });
      span = this.cell.getCellSpan();
      (expect(span.colspan)).toEqual(2);
      return (expect(span.rowspan)).toEqual(3);
    });
    return it('normalizes colspan and rowspan with invalid values', function() {
      var span;
      this.cell.attr({
        colspan: 0,
        rowspan: 0
      });
      span = this.cell.getCellSpan();
      (expect(span.colspan)).toEqual(1);
      (expect(span.rowspan)).toEqual(1);
      this.cell.attr({
        colspan: 'a',
        rowspan: 'b'
      });
      span = this.cell.getCellSpan();
      (expect(span.colspan)).toEqual(1);
      (expect(span.rowspan)).toEqual(1);
      this.cell.attr({
        colspan: -2,
        rowspan: -2
      });
      span = this.cell.getCellSpan();
      (expect(span.colspan)).toEqual(1);
      return (expect(span.rowspan)).toEqual(1);
    });
  });

}).call(this);
