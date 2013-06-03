
/*
Copyright statement goes here
*/

(function() {
  var defaultStyle,
    __hasProp = Object.prototype.hasOwnProperty;

  if (jQuery === void 0) throw new Error("jQuery is required to use tableManners");

  /*
  Assign tablemanners to tables
  
  TODO: Consider animation
  */

  jQuery.fn.tableManners = function(setOptions) {
    var option, options, value;
    options = {
      debugStyle: false,
      noStyle: false,
      html5: false,
      keyboardAccess: false
    };
    for (option in setOptions) {
      if (!__hasProp.call(setOptions, option)) continue;
      value = setOptions[option];
      options[option] = value;
    }
    this.each(function() {
      var focusOnCell, table;
      table = ($(this)).addClass('mannered');
      focusOnCell = function(e) {
        var aligned, cells, grouped, headers, target, _ref;
        target = $(e.target);
        cells = $('td, th', table);
        cells.removeClass('tm_blur tm_header tm_grouped');
        _ref = target.getCellAssociations(options), headers = _ref.headers, aligned = _ref.aligned, grouped = _ref.grouped;
        headers.addClass('tm_header');
        grouped.addClass('tm_grouped');
        /*
              aligned.addClass 'tm_aligned'
              grouped.addClass 'tm_grouped'
              .not(headers).not(aligned).not(grouped).addClass 'tm_blur'
        */
        return cells.not(target).not(headers).not(grouped).addClass('tm_blur');
      };
      return table.bind({
        'mouseenter': function() {
          return ($('td, th', table)).bind('mouseenter', focusOnCell);
        },
        'mouseleave': function() {
          var cells;
          cells = $('td, th', table);
          cells.unbind('mouseenter', focusOnCell);
          return cells.removeClass('tm_blur tm_header tm_grouped tm_aligned');
        }
      });
    });
    if (options.debugStyle === false && options.noStyle === false) {
      if (($('#tm_style')).length === 0) {
        ($('head')).append("<style id='tm_style'>" + defaultStyle + "</style>");
      }
    } else if (options.debugStyle === true) {
      ($('#tm_style')).remove();
    }
    return this;
  };

  /*
  Default style for the tables
  */

  defaultStyle = "table.mannered .tm_blur {\n  filter: alpha(opacity=20);\n  opacity: 0.2;\n}\ntable.mannered .tm_grouped {\n  filter: alpha(opacity=40);\n  opacity: 0.4;\n}\ntable.mannered .tm_aligned {\n  filter: alpha(opacity=70);\n  opacity: 0.7;\n}\ntable.mannered .tm_header {\n  outline:solid 1px red;\n}";

}).call(this);
