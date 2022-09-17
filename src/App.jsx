import { useState, useEffect } from 'react'
import './App.css'
import LeaderLine from "react-leader-line";
import axios from 'axios';


// const textData = {
//   "0": {
//     "text": "I",
//     "pos": "pronoun",
//     "relationships": [
//       {
//         "id": "1",
//         "type": "verb"
//       }
//     ]
//   },
//   "1": {
//     "text": "had",
//     "pos": "verb",
//     "relationships": [
//       {
//         "id": "0",
//         "type": "subject"
//       },
//       {
//         "id": "3",
//         "type": "object"
//       }
//     ]
//   },
//   "2": {
//     "text": "an",
//     "pos": "article",
//     "relationships": [
//       {
//         "id": "3",
//         "type": "article"
//       }
//     ]
//   },
//   "3": {
//     "text": "apple",
//     "pos": "noun",
//     "relationships": [
//       {
//         "id": "1",
//         "type": "object"
//       },
//       {
//         "id": "2",
//         "type": "article"
//       }
//     ]
//   },
// }

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
  const [dependencyParsed, setDependencyParsed] = useState({});

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

  const handleButtonClick = event => {
    // Request dependency parser
    const body = {
      text: message,
      language: 'en'
    };
    axios.post('http://localhost:8000/text/dependency-parser', body)
      .then(response => setDependencyParsed(response.data));

    // Loop through input words and create paragraph with spans
    const myArray = message.split(" ");
    var indents = [];
    for (let i = 0; i < myArray.length; i++) {
      indents.push(
        <span
          className='indent'
          key={2 * i}
          index={i}
          id={'span-tag-' + i}
          style={{
            backgroundColor: color_pallete[i],
            fontSize: "35px",
            marginLeft: "25px",
            marginRight: "25px"
          }}
        // onMouseOver={changeBackgroundOver}
        // onMouseLeave={changeBackgroundLeave}
        // onClick={highlightRelatedWords}
        >
          {myArray[i]}
        </span>
      );
    }
    setTags(indents);
  };

  // Draw Arrows at each update of the tags
  useEffect(() => {
    for (let i = 0; i < tags.length; i++) {
      const targetNode = document.getElementById(tags[i].props.id)
      const tokenObj = dependencyParsed[i.toString()];
      const tokenHead = tokenObj.head
      if (tokenHead != null) {
        const sourceNode = document.getElementById('span-tag-' + tokenHead.ind);
        if (i % 2 === 0) {
          var position = 'top';
          var gravity = -100;
        } else {
          var position = 'bottom';
          var gravity = 100;
        }
        const lineOptions = {
          path: "fluid",
          startSocket: position,
          endSocket: position,
          size: 4,
          dropShadow: true,
          startSocketGravity: [0, gravity],
          endSocketGravity: [0, gravity],
          middleLabel: LeaderLine.captionLabel(tokenHead.relationship, { color: 'black', fontSize: "25px" }),
          // color: window.getComputedStyle(document.getElementById("bibliography")).color,
          // startPlug: "disc",
          // endPlug: "behind",
        };
        var line = new LeaderLine(
          LeaderLine.mouseHoverAnchor(
            sourceNode,
            'draw',
            {
              animOptions: { duration: 800, timing: 'ease' },
              style: { backgroundColor: 'rgba(0,0,0,0)', backgroundImage: null, color: null },
              hoverStyle: { backgroundColor: 'rgba(0,0,0,0)', backgroundImage: null, color: null }
            }
          ),
          // targetNode,
          LeaderLine.mouseHoverAnchor(
            targetNode,
            'draw',
            {
              animOptions: { duration: 800, timing: 'ease' },
              style: { backgroundColor: 'rgba(0,0,0,0)', backgroundImage: null, color: null },
              hoverStyle: { backgroundColor: 'rgba(0,0,0,0)', backgroundImage: null, color: null }
            }
          ),
          lineOptions
        );
        line.id = "arrow-line-" + i.toString() + '-' + tokenHead.ind
      }
    }
  }, [dependencyParsed]);

  return (
    <div className="App">
      <h1>Interactive grammar</h1>
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
        <div id='div-spans-content' style={{ border: '1px solid black', paddingTop: '150px', paddingBottom: '150px', paddingLeft: '50px', paddingRight: '50px' }} >
          <p>
            {tags}
          </p>
        </div>
      </div>
    </div >
  )
}

export default App
