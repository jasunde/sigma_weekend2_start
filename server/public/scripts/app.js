var sigmanauts = [],
    $peopleContainer;

$(document).ready(function(){
    $.ajax({
      type: "GET",
      url: "/data",
      success: function(data){
        sigmanauts = data.sigmanauts;
        init();
      }
    });


});

function init() {
  $peopleContainer = $('#peopleContainer');

  peopleToDom();
}

function peopleToDom() {
  sigmanauts.forEach(function (person) {
    var $el = $('<div class="person"></div>');

    $el.append('<h2>' + person.name + '</h2>');
    $el.append('<p>' + person.git_username + '</p>');
    $el.append('<p>' + person.shoutout + '</p>');

    $peopleContainer.append($el);
  })
}
