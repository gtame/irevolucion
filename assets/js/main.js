/* ==========================================================================
   jQuery plugin settings and other scripts
   ========================================================================== */

$(document).ready(function() {
  // Sticky footer
  var bumpIt = function() {
      $("body").css("margin-bottom", $(".page__footer").outerHeight(true));
    },
    didResize = false;

  bumpIt();
 

  
//funcion para convertir un formulario en un objeto json.
function toJSONString( form ) {
  var obj = {};
  var elements = form.querySelectorAll( "input, select, textarea" );
  for( var i = 0; i < elements.length; ++i ) {
      var element = elements[i];
      var name = element.name.replace("-","");
      var value = element.value; 
      if( name ) {
          obj[ name ] = value;
      }
  }

  return JSON.stringify( obj );
}

function showError()
{
  $.magnificPopup.close();

  $.magnificPopup.open({
    items: {
        src: '#errordialog',
        type: 'inline'
    }
  }); 

  // Cierra el popup en 3 seg
  setTimeout("$.magnificPopup.close()",3000);
}


  $('#contactform').on('submit',function(e){

    e.preventDefault();

    //valida -> validateform(inputscontact)

    if (true)
    {
      
      var maildata=JSON.parse(toJSONString(this));
      //Llamamos api rest. 
      var urlAjax =  "../mail.php?nombre=" + encodeURI(maildata.nombre) + 
      "&mail="+ encodeURI(maildata.email) + 
      "&msj=" + encodeURI(maildata.message);
      
      
       //crear nuevos registro via ajax
       $.ajax({
          type: "GET",
          url: urlAjax,
          beforeSend: function() {
              $.magnificPopup.open({
                    items: {
                        src: '#loadingdialog',
                        type: 'inline'
                    }
                  }); 
           },
          success: function(data) { 
              

              if (data.status='success')
              {
                $.magnificPopup.close();
                  $.magnificPopup.open({
                    items: {
                        src: '#dialog',
                        type: 'inline'
                    }
                  }); 
              
                  // Cierra el popup en 3 seg
                  setTimeout("$.magnificPopup.close()",3000);
                  //Clear form
                  $("#contactform").trigger('reset');
                  //$("#first-name").focus();            
              }
              else
              {
                showError();
              }

          },
          error: function(data) { 
              showError();
           },
          dataType: 'json'
          });
      //Si ok


    } 

    return false;
 

 


  });



  $(window).resize(function() {
    didResize = true;
  });
  setInterval(function() {
    if (didResize) {
      didResize = false;
      bumpIt();
    }
  }, 250);

  // FitVids init
  $("#main").fitVids();

  // Sticky sidebar
  var stickySideBar = function() {
    var show =
      $(".author__urls-wrapper button").length === 0
        ? $(window).width() > 1024 // width should match $large Sass variable
        : !$(".author__urls-wrapper button").is(":visible");
    if (show) {
      // fix
      $(".sidebar").addClass("sticky");
    } else {
      // unfix
      $(".sidebar").removeClass("sticky");
    }
  };

  stickySideBar();

  // Sticky sidebar
  var rotatetext = function() {
    var show =$('#span1');
   
    if (show) {
      // fix
      show.cycleText();
    } 
  };

  rotatetext();
  

  $(window).resize(function() {
    stickySideBar();
  });

  // Follow menu drop down
  $(".author__urls-wrapper button").on("click", function() {
    $(".author__urls").toggleClass("is--visible");
    $(".author__urls-wrapper button").toggleClass("open");
  });

  // Search toggle
  $(".search__toggle").on("click", function() {
    $(".search-content").toggleClass("is--visible");
    $(".initial-content").toggleClass("is--hidden");
    // set focus on input
    setTimeout(function() {
      $("#search").focus();
    }, 400);
  });

  // init smooth scroll
  $("a").smoothScroll({ offset: -20 });

  // add lightbox class to all image links
  $(
    "a[href$='.jpg'],a[href$='.jpeg'],a[href$='.JPG'],a[href$='.png'],a[href$='.gif']"
  ).addClass("image-popup");

  // Magnific-Popup options
  $(".image-popup").magnificPopup({
    // disableOn: function() {
    //   if( $(window).width() < 500 ) {
    //     return false;
    //   }
    //   return true;
    // },
    type: "image",
    tLoading: "Loading image #%curr%...",
    gallery: {
      enabled: true,
      navigateByImgClick: true,
      preload: [0, 1] // Will preload 0 - before current, and 1 after the current image
    },
    image: {
      tError: '<a href="%url%">Image #%curr%</a> could not be loaded.'
    },
    removalDelay: 500, // Delay in milliseconds before popup is removed
    // Class that is added to body when popup is open.
    // make it unique to apply your CSS animations just to this exact popup
    mainClass: "mfp-zoom-in",
    callbacks: {
      beforeOpen: function() {
        // just a hack that adds mfp-anim class to markup
        this.st.image.markup = this.st.image.markup.replace(
          "mfp-figure",
          "mfp-figure mfp-with-anim"
        );
      }
    },
    closeOnContentClick: true,
    midClick: true // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
  });
});
