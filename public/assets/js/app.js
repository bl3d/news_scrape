
// main menu links
////////////////////////////////////////////////////////////////////


// save a note for the selected article
$(document).on("click", "#home_link", function() {
  window.location.href = '/';
});



// save a note for the selected article
$(document).on("click", "#saved_link", function() {
  window.location.href = '/saved';
});



// save a note for the selected article
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


// Whenever someone clicks a p tag
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



// Whenever someone clicks a p tag
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
  alert('will launch comments modal');
});



// save a note for the selected article
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
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
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});






// app state
////////////////////////////////////////////////////////////////////

//check for what page we are on and let menu know
$(window).on('hashchange', function(e){
    // do something...
});