 // HIDES SCROLL BAR
 document.body.style.overflow = 'hidden';    

 // Grabs the canvas set in the html file
 // Need # to specify custom ID, don't need it for HTML keywords like "canvas"
 const canvas = /** @type {HTMLCanvasElement} */ (document.querySelector("#gameCanvas")); 

 // Initialize Canvas 2D
 const context = canvas.getContext("2d"); 

 var angle = 0;