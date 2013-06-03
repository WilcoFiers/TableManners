
/*
This plugin returns a matrix (nested arrays) containing the table cell nodes
*/

(function() {

  jQuery.fn.tableToMatrix = function() {
    var colTotal, matrix, rowNum;
    matrix = [];
    rowNum = 0;
    colTotal = 0;
    (this.find('tr')).each(function() {
      var colNum;
      colNum = 0;
      if (matrix[rowNum] === void 0) matrix[rowNum] = [];
      (($(this)).children('td, th')).each(function() {
        var cell, col, colspan, row, rowspan, _ref, _ref2, _ref3;
        cell = $(this);
        _ref = cell.getCellSpan(), colspan = _ref.colspan, rowspan = _ref.rowspan;
        while (matrix[rowNum] !== void 0 && matrix[rowNum][colNum] !== void 0) {
          colNum += 1;
        }
        for (row = 0, _ref2 = rowspan - 1; 0 <= _ref2 ? row <= _ref2 : row >= _ref2; 0 <= _ref2 ? row++ : row--) {
          for (col = 0, _ref3 = colspan - 1; 0 <= _ref3 ? col <= _ref3 : col >= _ref3; 0 <= _ref3 ? col++ : col--) {
            if (matrix[rowNum + row] === void 0) matrix[rowNum + row] = [];
            matrix[rowNum + row][colNum + col] = cell;
          }
        }
        colNum += colspan;
        if (colTotal < colNum) return colTotal = colNum;
      });
      return rowNum += 1;
    });
    return matrix;
  };

}).call(this);
