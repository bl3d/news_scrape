
// main menu links
////////////////////////////////////////////////////////////////////


// 
$(document).on("click", "#home_link", function() {
  window.location.href = '/';
});



// 
$(document).on("click", "#saved_link", function() {
  window.location.href = '/saved';
});



// 
$(document).on("click", "#scrape_link", function() {

  //
  $.ajax({
    method: "GET",
    url: "/scrape"
  })
    // once scrape is done, load home page to show new contents
    .done(function(data) {
       // location.reload();
       window.location.href = '/';  
    });
});





// article button actions
////////////////////////////////////////////////////////////////////


// 
$(document).on("click", ".saveThis", function() {

  var thisArticle = $(this).closest('.article');
  var thisId = thisArticle.attr("id"); 

  $(this).addClass('savedAlready').removeClass('.saveThis').html('&#10004; Saved');
  thisArticle.addClass('saved');

  // Now make an ajax call for the Article
  $.ajax({
    method: "POST",
    url: "/save/" + thisId
  })
});



// 
$(document).on("click", ".removeSaved", function() {

  var thisArticle = $(this).closest('.article');
  var thisId = thisArticle.attr("id"); 

  thisArticle.stop().animate({ opacity: 0.0}, 750, function(){
    $(this).remove();
    if ($('#articlesHolder').find('.article').length === 0) {
      // alert('allGone');
      location.reload();
    };    
  });

  // Now make an ajax call for the Article
  $.ajax({
    method: "POST",
    url: "/unsave/" + thisId
  }) 
});



// launch notes modal for associated article
$(document).on("click", ".commentThis", function() {
  // alert('will launch comments modal');
  var thisArticle = $(this).closest('.article');
  var thisId = thisArticle.attr("id"); 

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/comments/" + thisId
  })
    .done(function(data) {
      // 
      var comms = "";
      for (var i = 0; i < data.comments.length; i++) {
        // console.log(data.comments[i]);   
        comms += "<li class='comment' data-id='"+data.comments[i]._id+"'><div class='copy'>"+
        "<h5>"+data.comments[i].title+"</h5>"+
        "<p>"+data.comments[i].body+"</p>"+
        "</span><div class='deleteComment button'>Delete ></div></li>";    
      }; 
      if (data.comments.length === 0) {
        comms = "<li class='noRecords'>There are currently no comments on this article.</li>";
      };

      $('#commentsHolder').html(comms);
      $('#savenote').attr('data-id', thisId);
      $('#commentsModal').css({ opacity: 0.0, display: 'block' }).stop()
      .animate({ opacity: 1.0 }, 1000);
    }); 
});



// save a note for the selected article
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/comments/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .done(function(data) {
      // Log the response
      // console.log(data); 
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});



// delete specific comment for an article
$(document).on("click", ".deleteComment", function() { 
  var thisArticle = $(this).closest('.comment');
  var thisId = thisArticle.attr("data-id"); 

  thisArticle.stop().animate({ opacity: 0.0}, 750, function(){
    $(this).remove();
    /*if ($('#articlesHolder').find('.article').length === 0) {
      // alert('allGone');
      location.reload();
    };*/    
  });  

  // Now make an ajax call for the Article
  $.ajax({
    method: "POST",
    url: "/uncomment/" + thisId
  })
    .done(function(data) {
      // 
      
    }); 
});



// close comments modal
$(document).on("click", "#closeModal", function() {
  $('#commentsModal').stop().animate({ opacity: 0.0 }, 500, function(){
    $(this).css({ display: 'none' }).find('#commentsHolder')
    .html('<li class="noRecords">There are currently no comments on this article.</li>');
  }); 
});




// app state
////////////////////////////////////////////////////////////////////

//check for what page we are on and let menu know
$(window).on('hashchange', function(e){
    // do something...
});