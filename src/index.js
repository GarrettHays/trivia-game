import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';
import TriviaGame from './TriviaGame.js' 

//UI Logic
$(document).ready(function() {
  const numberOfQuestions = 10;
  let currentQuestion = 0;
  let feedback;
  let score = 0;
  let questions = [];
  let cAnswers = [];

  $('#tryAgain').click(function() {
    window.location.reload();
  });

  $('#triviaStart').click(function() {
    const difficulty = $('input[name="difficulty"]:checked').val();
    const category = $('input[name="category"]:checked').val();
    let promise = TriviaGame.getTrivia(numberOfQuestions, category, difficulty);
    promise.then(function(response) {
      feedback = JSON.parse(response);
      $('#gameSetup').hide();
      $('#gameplay').show();
      getElements(feedback.results[0]);
    });

    $('#nextQuestion').click(function() {
      $('input[name="answers"]:checked').prop("checked", false);
      $('#gameAnswer').hide();
      $('#gameplay').show();
      if (currentQuestion < numberOfQuestions) {
        currentQuestion++;
        getElements(feedback.results[currentQuestion]);
      }
    });

    function getElements(feedback) {
      const correctAnswer = utilityF(feedback);

      $('#triviaAnswer').click(function() {
        const answer = $('input[name="answers"]:checked').val();
        $('#gameplay').hide();
        $('#gameAnswer').show();
        let result;
        if (answer === correctAnswer) {
          result = "That is correct!";
          score++;
        } else {
          result = `Sorry, the correct answer is ${correctAnswer}`;
        }
        $('.showResult').text(result);
        if (currentQuestion === numberOfQuestions - 1) {
          $('#gameAnswer').hide();
          $('.showResult').show();
          $('#finalScore').text(`CONGRATULATIONS, YOUR SCORE IS ${score} OUT OF ${numberOfQuestions} QUESTIONS!`);
          // showQsAs();
          $('#finalResults').show();
        }
      });
    }

    // response = response.results[index]
    function utilityF(feedback) {
      let resultsArry = [];
      resultsArry.push(feedback.question);
      resultsArry.push(feedback.incorrect_answers[0]);
      resultsArry.push(feedback.incorrect_answers[1]);
      resultsArry.push(feedback.incorrect_answers[2]);
      resultsArry.push(feedback.correct_answer);

      questions.push(feedback.question);
      cAnswers.push(feedback.correct_answer);

      for (let i = 0; i < resultsArry.length; i++) {
        resultsArry[i] = resultsArry[i].replaceAll('&rsquo;', '\'');
        resultsArry[i] = resultsArry[i].replaceAll('&#039;', '\'');
        resultsArry[i] = resultsArry[i].replaceAll('&quot;', '"');
      }

      let qOrder = [1, 2, 3, 4];
      shuffle(qOrder);
      $('.showQuestion').text(resultsArry[0]);
      $('#q1Label').text(resultsArry[qOrder[0]]);
      $('#q1').val(resultsArry[qOrder[0]]);
      $('#q2Label').text(resultsArry[qOrder[1]]);
      $('#q2').val(resultsArry[qOrder[1]]);
      $('#q3Label').text(resultsArry[qOrder[2]]);
      $('#q3').val(resultsArry[qOrder[2]]);
      $('#q4Label').text(resultsArry[qOrder[3]]);
      $('#q4').val(resultsArry[qOrder[3]]);

      return resultsArry[4];
    }
  });
  function showQsAs() {
    for (let i = 0; i < questions.length; i++) {
      $('#questionsList').append(questions[i]);
      $('#answers').append(cAnswers[i]);
    }
    console.log(questions);
    console.log(cAnswers);
  }



// from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array; 
// });
  }
})
