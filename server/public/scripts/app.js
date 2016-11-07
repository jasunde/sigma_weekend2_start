var sigmanauts = [],
    $peopleContainer,
    $peopleButtons,
    intervalID,
    animating = false;

var INTERVAL_TIME = 10000; // 10 seconds
var BTN_ACTIVE_CLASS = 'active btn-primary';
var PERSON_ACTIVE_CLASS = 'active';

$(document).ready(function(){
  $.ajax({
    type: "GET",
    url: "/data",
    success: function(data){
      // Array of person objects
      sigmanauts = data.sigmanauts;
      init();
    }
  });
});

// calls functions after data loads from AJAX call
function init() {
  $peopleContainer = $('#peopleContainer'),
  $peopleButtons = $('#peopleButtons');

  // Add all people to DOM
  peopleToDom();

  // Give first person and button the active class
  changeHighlight(sigmanauts[0]);

  // Handle click on person-button
  // $peopleButtons.on('click', '.person-button', goToPerson);
  $peopleButtons.on('click', '.person-button', handleClick);

  // Handle click on next button
  $('#next').on('click', handleClick);
  // Handle click on previous button
  $('#previous').on('click', handleClick);

  startInterval();
}

function peopleToDom() {
  // Create div and button on DOM for each person
  sigmanauts.forEach(function (person, i) {
    var $el = $('<div class="person panel panel-default"></div>');
    var $body = $('<div class="panel-body"></div>')

    $el.append('<div class="panel-heading"><h2>' + person.name + '</h2></div>');
    $body.append('<p class="github"><span class="devicons devicons-github_badge"></span><a href="https://github.com/' + person.git_username + '" target="_blank">' + person.git_username + '</a></p>');
    $body.append('<p class="lead">' + person.shoutout + '</p>');
    $el.append($body);
    $el.data('index', i);

    person.container = $el;
    $peopleContainer.append($el);

    $el = $('<button class="person-button">' + person.name + '</button>');
    $el.addClass('btn btn-default btn-block');
    person.button = ($el);
    $el.data(person);
    $peopleButtons.append($el);
  });
}

// Change highlighting of person and their button
function changeHighlight(person) {
  animating = true;

  // Find active person
  var $activePerson = $peopleContainer.find('.active').removeClass(PERSON_ACTIVE_CLASS);

  // Animate transition to new person
  if($activePerson.length > 0) {
    $activePerson.fadeOut({
      complete: function () {
        $peopleButtons.find('.active').removeClass(BTN_ACTIVE_CLASS);
        person.button.addClass(BTN_ACTIVE_CLASS).blur();
        person.container.fadeIn();
        person.container.addClass(PERSON_ACTIVE_CLASS);
        animating = false
      }
    });
  } else {
    person.button.addClass(BTN_ACTIVE_CLASS).blur();
    person.container.fadeIn();
    person.container.addClass(PERSON_ACTIVE_CLASS);
    animating = false
  }

}

// Handle click
function handleClick() {
  // Stop automatically changing to next person
  clearInterval(intervalID);

  var $this = $(this);
  if(!animating) {
    if($this.hasClass('person-button')) {
      goToPerson.call(this);
    } else if ($this.attr('id') === 'next') {
      nextPerson.call(this);
    } else if ($this.attr('id') === 'previous') {
      previousPerson.call(this);
    }
  }

  // Start automatically chaning to next person
  startInterval();
}

// Go to person whose button was clicked
function goToPerson() {
  var person = $(this).data();
  changeHighlight(person);
}

// Change highlighting to the next person
function nextPerson() {
  var i = $peopleContainer.find('.active').data('index');
  i = (i + 1) % (sigmanauts.length);
  changeHighlight(sigmanauts[i]);
  $(this).blur();
}

// Change highlighting to the previous person
function previousPerson() {
  var i = $peopleContainer.find('.active').data('index');
  i = i || sigmanauts.length;
  i--;
  changeHighlight(sigmanauts[i]);
  $(this).blur();
}

function startInterval() {
  intervalID = setInterval(nextPerson, INTERVAL_TIME);
}
