import { useState } from 'react'
import './App.css'
import LeaderLine from "react-leader-line";


const textData = {
  "0": {
    "text": "I",
    "pos": "pronoun",
    "relationships": [
      {
        "id": "1",
        "type": "subject"
      }
    ]
  },
  "1": {
    "text": "had",
    "pos": "verb",
    "relationships": [
      {
        "id": "0",
        "type": "subject"
      },
      {
        "id": "3",
        "type": "object"
      }
    ]
  },
  "2": {
    "text": "an",
    "pos": "article",
    "relationships": [
      {
        "id": "3",
        "type": "article"
      }
    ]
  },
  "3": {
    "text": "apple",
    "pos": "noun",
    "relationships": [
      {
        "id": "1",
        "type": "object"
      },
      {
        "id": "2",
        "type": "article"
      }
    ]
  },
}

const color_pallete = [
  "rgba(252, 186, 3, 0)",
  "rgba(247, 16, 0, 0)",
  "rgba(0, 247, 86, 0)",
  "rgba(0, 202, 247, 0)",
  "rgba(82, 0, 247, 0)",
  "rgba(247, 0, 235, 0)",
]

function App() {
  const [message, setMessage] = useState('');
  const [tags, setTags] = useState([]);

  const handleInputTextChange = event => {
    setMessage(event.target.value);
  };

  const changeBackgroundOver = event => {
    const [r, g, b, a] = event.target.style.backgroundColor.split(',');
    const newBackgroundColor = [r, g, b, 0.6].join(',') + ')';
    event.target.style.background = newBackgroundColor;
  };

  const changeBackgroundLeave = event => {
    const [r, g, b, a] = event.target.style.backgroundColor.split(',');
    const newBackgroundColor = [r, g, b, 0].join(',') + ')';
    event.target.style.background = newBackgroundColor;
  };

  const highlightRelatedWords = event => {
    const textObj = textData[event.target.getAttribute('index')];
    const relationships = textObj.relationships

    function myFunction(value) {
      const el = document.getElementById('span-tag-' + value.id);

      const [r, g, b, a] = el.style.backgroundColor.split(',');
      const newBackgroundColor = [r, g, b, 0.5].join(',') + ')';
      el.style.background = newBackgroundColor;

      const lineOptions = {
        path: "arc",
        startSocket: "top",
        endSocket: "top",
        size: 4,
        startSocketGravity: [-192, -172],
        endSocketGravity: [192, -172],
        // color: window.getComputedStyle(document.getElementById("bibliography")).color,
        // startPlug: "disc",
        // endPlug: "behind",
      };

      var line = new LeaderLine(
        event.target,
        el,
        lineOptions
      );
      line.id = "arrow-line-" + el.id
    }
    relationships.forEach(myFunction);
  }

  const handleButtonClick = event => {
    const myArray = message.split(" ");

    var indents = [];
    for (let i = 0; i < myArray.length; i++) {
      indents.push(
        <span
          className='indent'
          key={i}
          index={i}
          id={'span-tag-' + i}
          style={{
            backgroundColor: color_pallete[i],
            fontSize: "30px",
          }}
          onMouseOver={changeBackgroundOver}
          onMouseLeave={changeBackgroundLeave}
          onClick={highlightRelatedWords}
        >
          {myArray[i]}
        </span>
      );
      indents.push(<span style={{ marginLeft: "60px" }}></span>);
    }

    setTags(indents);
  };

  return (
    <div className="App">
      <h1>Interactive text component</h1>
      <div className="card">
        <form>
          <label>Text:</label>
          <input
            type="text"
            name="text"
            onChange={handleInputTextChange}
          />
        </form>
        <button onClick={handleButtonClick}>
          Click
        </button>
        <br></br>
        <br></br>
        <br></br>
        <div id='div-spans-content'>
          <p>
            {tags}
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
