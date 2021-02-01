import React, { Component } from 'react';
// import './App.css';
// import Person from './Person/Person';

class App extends Component {
  state = {
    showForm: true,
    showError: false,
    enableButton: [false, false],
    chordLetters: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    chordTypes: [],
    currentChord: ['',''],
    qnum: null,
    currentQuestion: null,
    correct: null,
  };

  startQuiz = () => {
    let qnum = document.getElementById('qnum').value;
    // const majChecked = document.getElementById('check-maj');
    let chordTypes = ['maj'];
    const minChecked = document.getElementById('check-min').checked;
    if (minChecked) {
      chordTypes.push('min');
    }

    if (qnum % 1 || qnum < 0) {
      this.setState({showError: true});
    } else {
      if(qnum === ""){
        qnum = 0;
      }
      if(qnum === 0) {
        qnum = 2;
      }
      this.setState({
        showError: false,
        showForm: false,
        qnum: parseInt(qnum, 10),
        chordTypes: chordTypes,
        currentQuestion: 1,
        correct: 0
      }, () => {
        this.setState({currentChord: this.getRandomChord()});
      });
    }
  };

  playChord = () => {
    const currentChord = this.state.currentChord;
    const chordAudio = new Audio(`${process.env.PUBLIC_URL}/assets/${currentChord}.mp3`);
    console.log(chordAudio);
    chordAudio.play();
  };

  getRandomChord = () => {
    const chordLetters = this.state.chordLetters;
    const chordTypes = this.state.chordTypes;
    const randomChord = [
      chordLetters[Math.floor(Math.random() * chordLetters.length)],
      chordTypes[Math.floor(Math.random() * chordTypes.length)]
    ].join('');

    return randomChord;
  };

  nextQuestion = () => {
    // const currentQuestion = this.state.currentQuestion;
    this.setState({ 
      currentChord: this.getRandomChord(), 
      currentQuestion: this.state.currentQuestion + 1
    });
  }

  checkAnswer = () => {
    const currentChord = this.state.currentChord;

    const answer = [
      document.querySelector("input[name=chordLetter]:checked").id,
      document.querySelector("input[name=chordType]:checked").id
    ].join('');
    console.log(answer);

    if (answer === currentChord) {
      console.log('correct!');
      this.setState({correct: this.state.correct + 1});
      this.nextQuestion();
    } else {
      console.log('wrong! try again :)');
      this.setState({correct: this.state.correct - 1});
    }
  };

  restartChordQuiz = () => {
    this.setState({ showForm: true });
  }
  
  letterClicked = () => { this.setState({ enableButton: [true, this.state.enableButton[1]] }); }

  typeClicked = () => { this.setState({ enableButton: [this.state.enableButton[0], true] }); }

  render() {
    let body = null;
    let err = null;

    if(this.state.showError) {
      err = (<div className="alert alert-warning">Number must be an integer greater than or equal to 0!</div>);
    }
  
    // show form
    if (this.state.showForm) {
      body = (
        <div className="p-3">
          
          <div className="form-check form-check-inline">
            <label className="form-check-label pr-2">Include:</label>
            <input className="form-check-input" type="checkbox" id="check-min"></input>
            <label className="form-check-label" htmlFor="check-min">min</label>
          </div>

          <div className="form-group pt-2">
            <label className="pr-2" htmlFor="qnum">Number of questions:</label>
            <input type="number" id="qnum" name="qnum"></input>
          </div>
          {err}
          <div className="text-center">
            <button className="btn btn-dark btn-lg" id="startButton" onClick={this.startQuiz}>Start</button>
          </div>
          
        </div>
      )
    } 
    //show end card
    else if (this.state.qnum === this.state.currentQuestion - 1){
      body = (
        <div className="card text-center">
          <div className="card-header"> Results </div>
          <div className="card-body">
            <p className="card-text">You answered {this.state.correct} out of {this.state.qnum} correctly!</p>
            <a className="btn btn-dark btn-lg" onClick={this.restartChordQuiz}>Restart</a>
          </div>
        </div>
      );
    }
    // show quiz
    else { 
      body = (
        <div>
          <div className="p-3">
            <button onClick={this.playChord} className="btn btn-primary btn-block btn-lg">Play Chord</button>
          </div>

          <div className="btn-group btn-group-toggle btn-group-lg d-flex p-3" data-toggle="buttons">
            {this.state.chordTypes.map( chordType => {
              return (
              <label className="btn btn-dark active" key={chordType} >
                <input type="radio" name="chordType" id={chordType} autoComplete="off" onClick={this.typeClicked}></input> {chordType}
              </label>
              );
            })}
          </div>

          <div className="btn-group btn-group-toggle btn-group-lg d-flex p-3" data-toggle="buttons" id="chordLetter">
            {this.state.chordLetters.map((letter, idx) => {
              return (
                <label className="btn btn-dark active" key={idx}>
                  <input type="radio" name="chordLetter" id={letter} autoComplete="off" onClick={this.letterClicked}></input> {letter}
                </label>
              );
            })}
          </div>

          <div className="p-3 text-center">
            {(this.state.enableButton.every(el => el === true)) ?
              <button onClick={this.checkAnswer} className="btn btn-dark btn-lg">Answer</button>
              : <button onClick={this.checkAnswer} className="btn btn-dark btn-lg" disabled>Answer</button>}
          </div>

          <div className="p-3">
            <div className="progress">
              <div className="progress-bar" role="progressbar" style={{ width: `${100 * (this.state.currentQuestion - 1) / this.state.qnum}%` }} aria-valuenow={this.state.currentQuestion} aria-valuemin="0" aria-valuemax={this.state.qnum}></div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="App">
        <div className="jumbotron mb-0 text-center">
          <h1>Guitar Chord Quiz</h1>
          <p>Can you recognize these chords? Press start to begin!</p>
        </div>

        {body}

      </div>
    );
  }
}

export default App;