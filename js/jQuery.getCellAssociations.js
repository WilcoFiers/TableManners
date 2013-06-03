(function() {
  var findHtml4Headers, getTableColGroups,
    __hasProp = Object.prototype.hasOwnProperty;

  jQuery.fn.getCellAssociations = function(setOptions) {
    var col, colgroups, cols, findHeader, headerId, headers, matrix, option, options, row, rowgroup, rows, table, value, _i, _j, _k, _len, _len2, _len3, _ref, _ref2, _results;
    options = {
      html5: null
    };
    for (option in setOptions) {
      if (!__hasProp.call(setOptions, option)) continue;
      value = setOptions[option];
      options[option] = value;
    }
    rowgroup = this.parent().parent();
    table = rowgroup.parent();
    matrix = table.tableToMatrix();
    colgroups = getTableColGroups(table);
    _ref = findCellSpan(this, matrix), rows = _ref.rows, cols = _ref.cols;
    findHeader = options.html5 ? findHtml5Header : findHtml4Header;
    headers = $('');
    if ((this.attr('headers')) !== void 0) {
      _ref2 = (this.attr('headers')).trim().split(/\s|,/);
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        headerId = _ref2[_i];
        if (headerId !== '') headers = headers.add('#' + headerId, table);
      }
      return headers;
    }
    for (_j = 0, _len2 = rows.length; _j < _len2; _j++) {
      row = rows[_j];
      headers.add(findHeader(cols[0], row, 1, 0));
    }
    _results = [];
    for (_k = 0, _len3 = cols.length; _k < _len3; _k++) {
      col = cols[_k];
      _results.push(headers.add(findHeader(col, rows[0], 0, 1)));
    }
    return _results;
  };

  /*
  Locate the
  */

  jQuery.fn._getCellAssociations = function(setOptions) {
    var aligned, cell, col, colNum, colgroups, cols, colspan, group, grouped, headerId, headers, headersAttr, i, implicitCols, implicitRows, matrix, nodeName, option, options, randId, row, rowgroup, rowspan, sameCol, sameRow, scope, table, target, targetId, value, _i, _j, _k, _l, _len, _len2, _len3, _len4, _len5, _m, _n, _o, _ref, _ref10, _ref11, _ref12, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9, _results, _results2;
    options = {
      html5: null
    };
    for (option in setOptions) {
      if (!__hasProp.call(setOptions, option)) continue;
      value = setOptions[option];
      options[option] = value;
    }
    headers = $('');
    aligned = $('');
    grouped = $('');
    rowgroup = this.parent().parent();
    table = rowgroup.parent();
    matrix = table.tableToMatrix();
    colgroups = getTableColGroups(table);
    implicitRows = [];
    implicitCols = [];
    target = null;
    randId = "rm_temp_target_" + Math.floor(Math.random() * 100000);
    targetId = (_ref = this.attr('id')) != null ? _ref : '';
    this.attr('id', randId);
    for (row = _ref2 = matrix.length - 1; _ref2 <= 0 ? row <= 0 : row >= 0; _ref2 <= 0 ? row++ : row--) {
      for (col = _ref3 = matrix[row].length - 1; _ref3 <= 0 ? col <= 0 : col >= 0; _ref3 <= 0 ? col++ : col--) {
        cell = matrix[row][col];
        if (cell === void 0) continue;
        if (target === null && cell.attr('id') === randId) {
          _ref4 = cell.getCellSpan(), colspan = _ref4.colspan, rowspan = _ref4.rowspan;
          target = {
            pos: {
              cols: (function() {
                _results = [];
                for (var _i = _ref5 = col - colspan + 1; _ref5 <= col ? _i <= col : _i >= col; _ref5 <= col ? _i++ : _i--){ _results.push(_i); }
                return _results;
              }).apply(this),
              rows: (function() {
                _results2 = [];
                for (var _j = _ref6 = row - rowspan + 1; _ref6 <= row ? _j <= row : _j >= row; _ref6 <= row ? _j++ : _j--){ _results2.push(_j); }
                return _results2;
              }).apply(this)
            },
            nodeName: cell.context.nodeName.toLowerCase(),
            colgroups: []
          };
          _ref7 = target.pos.cols;
          for (_k = 0, _len = _ref7.length; _k < _len; _k++) {
            colNum = _ref7[_k];
            colNum = (_ref8 = colgroups[colNum]) != null ? _ref8 : -1;
            if (target.colgroups[target.colgroups.length] !== colNum) {
              target.colgroups.push(colNum);
            }
          }
          continue;
        } else if (target === null || cell.attr('id') === randId) {
          continue;
        }
        nodeName = cell.context.nodeName.toLowerCase();
        sameRow = ($.inArray(row, target.pos.rows)) !== -1;
        sameCol = ($.inArray(col, target.pos.cols)) !== -1;
        scope = (_ref9 = cell.attr('scope')) != null ? _ref9 : '';
        /*
              There are different association rules for html 5 then for previous
              versions. In options this can be set.
        */
        if (options.html5 === false) {
          if (target.nodeName === 'th') continue;
          /*
                  Figure out implicit associations, th same row or column
                  
                  Only one set of adjecent th elements will count as implicit headers
                  Once at a th, the status becomes found. If it then finds a td on 
                  the same row/col, the status becomes 'passed'. Once there, th elements
                  are not added anymore
          */
          if (sameRow && nodeName === 'th') {
            if (implicitRows[row] === void 0) {
              implicitRows[row] = 'found';
              headers = headers.add(cell);
            } else if (implicitRows[row] === 'found') {
              headers = headers.add(cell);
            }
          } else if (sameRow && implicitRows[row] !== void 0) {
            implicitRows[row] = 'passed';
          }
          if (sameCol && nodeName === 'th') {
            if (implicitCols[col] === void 0) {
              implicitCols[col] = 'found';
              headers = headers.add(cell);
            } else if (implicitCols[col] === 'found') {
              headers = headers.add(cell);
            }
          } else if (sameCol && implicitCols[col] !== void 0) {
            implicitCols[col] = 'passed';
          }
          headers = headers.add((function() {
            var _ref10;
            switch (cell.attr('scope')) {
              case 'row':
                if (sameRow) return cell;
                break;
              case 'col':
                if (sameCol) return cell;
                break;
              case 'rowgroup':
                if (cell.parent().parent().not(rowgroup).length === 0) return cell;
                break;
              case 'colgroup':
                if (col < target.pos.cols[0] || sameCol) {
                  if ($.inArray((_ref10 = colgroups[col]) != null ? _ref10 : -1, target.colgroups) !== -1) {
                    return cell;
                  }
                }
            }
          })());
        }
      }
    }
    /*
      add headers from the headers attr to the headers list
    */
    headersAttr = this.attr('headers');
    if (headersAttr !== void 0) {
      headers = $('');
      _ref10 = headersAttr.trim().split(/\s|,/);
      for (_l = 0, _len2 = _ref10.length; _l < _len2; _l++) {
        headerId = _ref10[_l];
        if (headerId !== '') headers = headers.add('#' + headerId, table);
      }
    }
    if (colgroups.length > 0) {
      cols = [];
      _ref11 = target.colgroups;
      for (_m = 0, _len3 = _ref11.length; _m < _len3; _m++) {
        group = _ref11[_m];
        for (i = 0, _ref12 = colgroups.length; 0 <= _ref12 ? i <= _ref12 : i >= _ref12; 0 <= _ref12 ? i++ : i--) {
          if (colgroups[i] === group) cols.push(i);
        }
      }
      for (_n = 0, _len4 = matrix.length; _n < _len4; _n++) {
        row = matrix[_n];
        for (_o = 0, _len5 = cols.length; _o < _len5; _o++) {
          col = cols[_o];
          if (row[col] !== void 0) grouped = grouped.add(row[col]);
        }
      }
    }
    if (($('thead, tbody, tfoot', table)).length > 1) {
      if (grouped.length === 0) {
        grouped = grouped.add($('td, th', rowgroup));
      } else {
        grouped = grouped.filter($('td, th', rowgroup));
      }
    }
    grouped = grouped.not(this).not(headers);
    this.attr('id', targetId);
    return {
      headers: headers,
      aligned: aligned,
      grouped: grouped
    };
  };

  /*
    Find the headers of a cell, using the HTML4 method
  */

  findHtml4Headers = function(initialX, initialY, deltaX, deltaY) {
    var currentThBlock;
    currentThBlock = $('');
    while (x >= 0 && y >= 0) {
      x += deltaX;
      y += deltaY;
    }
    return currentThBlock;
  };

  /*
  Returns an array with column numbers as a key and an incrementing number for the
  colgroup which it is in
  */

  getTableColGroups = function(table) {
    /* (From the HTML specs)
    Span=
    * In the absence of a span attribute, each  COLGROUP defines a column group 
      containing one column.
    * If the span attribute is set to N > 0, the current  COLGROUP element
      defines a column group containing N columns.
    User agents must ignore this attribute if the  COLGROUP element contains one
    or more COL elements.
    */
    var groups;
    groups = [];
    ($('colgroup', table)).each(function() {
      var colNum, cols, i, _results;
      cols = ($('col', this)).length;
      if (cols === 0) cols = +($(this)).attr('span');
      if (cols === 0 || isNaN(cols)) cols = 1;
      colNum = groups.length === 0 ? 0 : groups[groups.length - 1] + 1;
      _results = [];
      for (i = 1; 1 <= cols ? i <= cols : i >= cols; 1 <= cols ? i++ : i--) {
        _results.push(groups.push(colNum));
      }
      return _results;
    });
    return groups;
  };

  /* HTML 5 algaritme
  isTableHeader = (type, x, y)->
    cell = tupel[x][y]
    if cell.name is 'td' then return false
    
    if cell.scope is type then return true
    if cell.scope is undefined
      if type is 'col'
        for row in tupel[x] where row[y].name is 'td'
          return false
      if type is 'row'
        for rowCell in tupel[x] where rowCell.name = 'td'
          return false
      return true
    return false
  
  
  findHeaderCell = (initialX, initialY, deltaX, deltaY)->
    opaqueHeaders = ($ '')
    currentThBlock = ($ '')
    headers
    {x, y} = (initialX, initialY)
    
    if tupel[initialX][initialY].name is th
      currentThBlock = currentThBlock.add tupel[x][y]
      headerBlock = true
    else
      headerBlock = false
    
    while x >= 0 and y >= 0
      x += deltaX
      y += deltaY
      
      curCell = tupel[x][y]
      if curCell is undefined curCell.length > 1 then continue 
      
      if curCell.name is 'th'
        headerBlock = true
        currentThBlock = currentThBlock.add curCell
        blocked = false
        if deltaX is 0
          # If there are any cells in the opaque headers list
          # anchored with the same x-coordinate as the current cell, 
          # and with the same width as current cell, 
          # then let blocked be true.
          
          if isColHeader x,y
            blocked = true
            
        else if deltaY is 0
              
        if blocked is false
          headers = headers.add curCell
          
      else if curCell.name is 'td' and headerBlock is true
        headerBlock is false
        opaqueHeaders = opaqueHeaders.add currentThBlock
          
        currentThBlock = $ ''
  */

}).call(this);
