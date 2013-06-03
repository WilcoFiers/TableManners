
/*
 This plugin returns a matrix (nested arrays) containing the table cell nodes
*/

(function() {

  jQuery.fn.getCellSpan = function() {
    var colspan, rowspan, _ref, _ref2;
    colspan = ((_ref = this.attr('colspan')) != null ? _ref : 1) * 1;
    rowspan = ((_ref2 = this.attr('rowspan')) != null ? _ref2 : 1) * 1;
    /*
      At the monent, Explorer, Opera, Safari and Chrome do not support
      colspan 0 for tables. Only Firefox implemented this spec.
      TableManners therefore assumes it's unintended and will treat it as colspan 1
    */
    if (colspan < 1 || isNaN(colspan)) colspan = 1;
    if (rowspan < 1 || isNaN(rowspan)) rowspan = 1;
    return {
      colspan: colspan,
      rowspan: rowspan
    };
  };

}).call(this);
