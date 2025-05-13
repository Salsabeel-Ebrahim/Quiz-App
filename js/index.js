// Get HTML elements
const myForm = document.querySelector("form")
const quizCategory = document.querySelector(".category")
const quizDifficulty = document.querySelector(".difficulty")
const numInput = document.querySelector(".number")
const btn = document.querySelector("button")
const myRow = document.querySelector('.questions .container .row')

let myquiz; 
let allQuestions
myForm.addEventListener('submit' , async function(e){
    e.preventDefault()
let Category = quizCategory.value
let Difficulty = quizDifficulty.value
let number = numInput.value
myquiz = new Quiz( Category , Difficulty , number )
allQuestions = await myquiz.getAllQuestions()
 console.log(allQuestions);

let  myquestion =new Question(0)
  console.log(myquestion);
  
  myForm.classList.replace('d-flex' , 'd-none')
  myquestion.displayQuestions()
 
})

class Quiz{
    constructor(Category , Difficulty , number){
        this.category = Category
        this.difficulty = Difficulty
        this.number =number
        this.score = 0    }

    getApi(){
    return `https://opentdb.com/api.php?amount=${this.number}&category=${this.category}&difficulty=${this.difficulty}`

    }
 async getAllQuestions(){
    let response = await fetch(this.getApi());
    let data = await response.json();
    return data.results; 
}

 showResult(){
    return `
      <div class="question shadow-lg col-lg-12  p-4 rounded-3 d-flex flex-column justify-content-center align-items-center gap-3">
        <h2 class="mb-0 text-white text-center"> ${this.score == this.number  ?   'Congratulations!♥️'   :   `your score is ${this.score}`}
        </h2>
        <button class="again btn btn-primary border-none "><i class="bi bi-arrow-repeat"></i> Try Again</button>
      </div>
    `


 }


}

class Question{

    constructor(index){
        this.index = index 
        this.category = allQuestions[index].category
        this.correct_answer =  allQuestions[index].correct_answer
        this.incorrect_answers = allQuestions[index].incorrect_answers
        this.question = allQuestions[index].question
        this.allAnswers = this.allAnswers()
        this.answered = false 

    }
allAnswers(){
let allAswers = [ ... this.incorrect_answers , this.correct_answer ]
allAswers.sort()
return allAswers
}

displayQuestions(){
 const questionMarkUP = `
      <div class="question shadow-lg col-lg-6 offset-lg-3  p-4 rounded-3 d-flex flex-column justify-content-center align-items-center gap-3 animate__animated animate__bounceIn">
        <div class="w-100 d-flex justify-content-between">
          <span class="btn btn-category">${this.category}</span>
          <span class="fs-6 btn btn-questions"> ${this.index + 1} of ${allQuestions.length} Questions</span>
        </div>
        <h2 class="text-capitalize h4 text-center">${this.question}</h2>  
        <ul class="choices w-100 list-unstyled m-0 d-flex flex-wrap text-center">
     ${this.allAnswers.map((li) => `<li>${li}</li>`).toString().replaceAll(',', '')}
         </ul>
        <h2 class="text-capitalize text-center score-color h3 fw-bold"><i class="bi bi-emoji-laughing"></i> Score: ${myquiz.score}</h2>        
      </div>
    
    `
    myRow.innerHTML = questionMarkUP

     let allChoices = document.querySelectorAll('.choices li')
      allChoices.forEach( (li) => {
        
        li.addEventListener('click', () => {
    this.checkAnswer(li)
    this.nextQuestion()
      
      })

    } 
     ) 
  }

  checkAnswer(li) {

  if (this.answered == false) {

      this.answered = true
      if (li.innerHTML === this.correct_answer) {
        li.classList.add('correct', 'animate__animated', 'animate__bounce')
      myquiz.score++;

      } else {
        li.classList.add('wrong', 'animate__animated', 'animate__shakeX')

      }
    }

  } 
  nextQuestion(){
    this.index++;
    setTimeout(()=> {
      if(this.index < allQuestions.length){
        let myNewQuestion =  new Question(this.index)
          myNewQuestion.displayQuestions()
 
      }
      else {
         let result =  myquiz.showResult();
myRow.innerHTML = result
document.querySelector(".again").addEventListener('click' , 
  () => {
    window.location.reload()
  }
)
      }
    }, 1500)
  }

  }


  
