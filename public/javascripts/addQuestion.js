var addQuestionButton= document.getElementById('addquestion');
addQuestionButton.addEventListener('click', addQuestion);
var questionNumber={'i': 2};

function addQuestion(){
  function insertAfter(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
  }

  let number= ""+ questionNumber.i;
  let newQuestionLabel= document.createElement('label');
  let newQuestionInput= document.createElement('input');
  let optionALabel= document.createElement('label');
  let optionBLabel= document.createElement('label');
  let optionCLabel= document.createElement('label');
  let optionDLabel= document.createElement('label');
  let optionAInput= document.createElement('input');
  let optionBInput= document.createElement('input');
  let optionCInput= document.createElement('input');
  let optionDInput= document.createElement('input');
  let correctAnswerLabel=document.createElement('label');
  let correctAnswerSelect=document.createElement('input');

  newQuestionLabel.innerHTML= `Question ${number} `;
  newQuestionInput.setAttribute('name','questions');

  optionALabel.innerHTML= "Option A ";
  optionBLabel.innerHTML= "Option B ";
  optionCLabel.innerHTML= "Option C ";
  optionDLabel.innerHTML= "Option D ";

  optionALabel.classList.add('options');
  optionBLabel.classList.add('options');
  optionCLabel.classList.add('options');
  optionDLabel.classList.add('options');

  optionAInput.setAttribute('name', `options`);
  optionBInput.setAttribute('name', `options`);
  optionCInput.setAttribute('name', `options`);
  optionDInput.setAttribute('name', `options`);

  correctAnswerLabel.innerHTML='Correct Answer (A,B,C, or D)';
  correctAnswerSelect.setAttribute('name', `correctanswer`);
  correctAnswerSelect.setAttribute('pattern', "[A-Da-d]{1}")

  let linebreak5= document.createElement('br');
  addQuestionButton.parentNode.insertBefore(linebreak5, addQuestionButton);
  addQuestionButton.parentNode.insertBefore(newQuestionLabel, addQuestionButton);
  insertAfter(newQuestionInput, newQuestionLabel);
  let linebreak=document.createElement('br');
  insertAfter(linebreak, newQuestionInput);
  insertAfter(optionALabel, linebreak);
  insertAfter(optionAInput, optionALabel)
  let linebreak1=document.createElement('br');
  insertAfter(linebreak1, optionAInput);
  insertAfter(optionBLabel, linebreak1);
  insertAfter(optionBInput, optionBLabel)
  let linebreak2=document.createElement('br');
  insertAfter(linebreak2, optionBInput);
  insertAfter(optionCLabel, linebreak2);
  insertAfter(optionCInput, optionCLabel)
  let linebreak3=document.createElement('br');
  insertAfter(linebreak3, optionCInput);
  insertAfter(optionDLabel, linebreak3);
  insertAfter(optionDInput, optionDLabel)
  let linebreak4=document.createElement('br');
  insertAfter(linebreak4, optionDInput);
  insertAfter(correctAnswerLabel, linebreak4);
  insertAfter(correctAnswerSelect, correctAnswerLabel);
  let linebreak6= document.createElement('br');
  addQuestionButton.parentNode.insertBefore(linebreak6, addQuestionButton);


  questionNumber.i++;
}
