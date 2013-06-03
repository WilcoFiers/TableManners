###
Copyright statement goes here
###

if jQuery is undefined 
  throw new Error "jQuery is required to use tableManners"

###
Assign tablemanners to tables

TODO: Consider animation
###
jQuery.fn.tableManners = (setOptions)->
  # Default options
  options = 
    debugStyle: false
    noStyle: false
    html5: false # Not yet implemented
    keyboardAccess: false # Not yet implemented
  
  # add user specified options
  for own option, value of setOptions
    options[option] = value
  
  # Loop through every selected table
  @each ->
    table = ($ this).addClass 'mannered'
    
    # Event handler when a cell receives focus
    focusOnCell = (e)->
      target = $ e.target
      cells = ($ 'td, th', table)
      cells.removeClass 'tm_blur tm_header tm_grouped'
      
      {headers, aligned, grouped} = target.getCellAssociations options
      headers.addClass 'tm_header'
      grouped.addClass 'tm_grouped'
      ###
      aligned.addClass 'tm_aligned'
      grouped.addClass 'tm_grouped'
      .not(headers).not(aligned).not(grouped).addClass 'tm_blur'
      ###
      cells.not(target)
           .not(headers)
           .not(grouped).addClass 'tm_blur'
    
    # Listen/stop listening for cell focus on mouse enter/leave
    table.bind 
      'mouseenter': ->
        ($ 'td, th', table).bind 'mouseenter', focusOnCell
      'mouseleave': ->
        cells = ($ 'td, th', table)
        cells.unbind 'mouseenter', focusOnCell
        cells.removeClass 'tm_blur tm_header tm_grouped tm_aligned'
    # END table iteration
  
  # add style to the page
  if options.debugStyle is off and options.noStyle is false
    if ($ '#tm_style').length is 0
      ($ 'head').append "<style id='tm_style'>#{defaultStyle}</style>"
  
  else if options.debugStyle is on
    ($ '#tm_style').remove()
  
  this
  # END tableManners plugin

  
###
Default style for the tables
###
defaultStyle = """
  table.mannered .tm_blur {
    filter: alpha(opacity=20);
    opacity: 0.2;
  }
  table.mannered .tm_grouped {
    filter: alpha(opacity=40);
    opacity: 0.4;
  }
  table.mannered .tm_aligned {
    filter: alpha(opacity=70);
    opacity: 0.7;
  }
  table.mannered .tm_header {
    outline:solid 1px red;
  }
"""