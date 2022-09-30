import React, { useState, useEffect, useCallback } from 'react'
import LeaderLine from "react-leader-line";
import { IGrammarRelationshipData, ISelectedText } from '../../interfaces/grammar-relationship-interface'

interface Props {
    data?: IGrammarRelationshipData;
    /**
     * style
     * arrows
     * colors
     * onClick span callback (freeze) - not prop? clicked span
     * 
     */
}

const color_pallete = [
    "rgba(252, 186, 3, 0)",
    "rgba(247, 16, 0, 0)",
    "rgba(0, 247, 86, 0)",
    "rgba(0, 202, 247, 0)",
    "rgba(82, 0, 247, 0)",
    "rgba(247, 0, 235, 0)",
  ]


const GrammarRelationshipComponent = ({data}: Props) => {
  const [tags, setTags] = useState<any[]>([])
  const [selectedText, setSelectedText] = useState<ISelectedText>()
  const [lines, setLines] = useState<any[]>([])

  const handleSpanClick = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    setSelectedText({
      text: e.currentTarget.innerText,
      id: e.currentTarget.id
    })
    // @todo update background color style ?
    //e.target.style.setProperty('background-color', 'red')

  }, [tags])
  
  useEffect(() => {
    if (!data) return;

    var newTags: any[] = []
    Object.entries(data).forEach(([key, value], index) => {
      const tag = 
        <span
          className='indent'
          onClick={handleSpanClick}
          key={2*index}
          id={`span-tag-${index}`}
          style={{
            backgroundColor: color_pallete[index],
            fontSize: "35px",
            marginLeft: "25px",
            marginRight: "25px"
          }}
        > 
          {value['text']}
        </span>
      newTags.push(tag)
    })
    setTags(newTags);
  }, [data])

  useEffect(()=>{
    if (!data) return;
    removeLines()
    var auxLines: any = []
    for (let i=0; i<tags.length; i++) {
      const targetNode = document.getElementById(tags[i].props.id)
      const tokenObj = data[i.toString()];
      if (!tokenObj) continue;
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
        auxLines.push(line)
      }
    }
    setLines(auxLines)
  }, [tags, data])

  const removeLines = useCallback(()=>{
    for (var l of lines){
      if (l) {
        l.remove()
      }
    }
  }, [data, lines])

  return (
    <div>
      {tags}
    </div>
  )
}

export default GrammarRelationshipComponent;