import React, { useState, useCallback } from 'react'
import GrammarRelationshipComponent from '../../components/GrammarRelationship'
import '../../App.css'
import axios from 'axios';


const Home = () => {
  const [message, setMessage] = useState<String>('')
  const [grammarData, setGrammarData] = useState<any>({})

  
  const handleClick = useCallback(() => {
    // Request dependency parser
    const body = {
      text: message,
      language: 'en'
    };
    axios.post('http://localhost:8000/text/dependency-parser', body)
      .then(response => {
        setGrammarData(response.data)
    });
  }, [message])


  return (
    <div className="App">
      <h1>Interactive grammar</h1>
      <div className="card">
        <form>
          <label>Text:</label>
          <input
            type="text"
            name="text"
            onChange={(event) => setMessage(event.target.value)}
          />
        </form>
        <button onClick={handleClick}>
          Click
        </button>
        <br></br>
        <br></br>
        <div id='div-spans-content' style={{ border: '1px solid black', paddingTop: '150px', paddingBottom: '150px', paddingLeft: '50px', paddingRight: '50px' }} >
          <GrammarRelationshipComponent data={grammarData} />
        </div>
      </div>
    </div >
  )
}

export default Home;
