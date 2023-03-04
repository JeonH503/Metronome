import { useState } from "react" 

function Metronome() {
    const [bpm, setBpm] = useState(90);
    const [beat, setBeat] = useState(4);
    const [state, setState] = useState(false);

    const BeatElements = () => {
        let temp = Array(beat).fill(0)
        return temp.map((e,i) => <td key={i} className="beat"></td>);
    }

    const bpmChangeEvent = (e) => {
        setBpm(e.target.value);
    }

    const buttonClickEvent = () => {
        setState(!state)
    }

    const beatControl = (type) => {
        if(type && beat !== 7)
            setBeat(beat + 1)
        else if(!type && beat !== 1)
            setBeat(beat - 1)
    }

    return(
        <div className="metrnome">
            <h3 className="bpmDisplay">{bpm} BPM</h3>
            <table className="beatDisplay">
                <tbody>
                    <tr>
                        <BeatElements/>
                    </tr>
                </tbody>
            </table>
            <div className="bpmSliderWrap">
                <input name="bpm" onChange={bpmChangeEvent} type="range" min="20" max="300" value={bpm}/>
            </div>
            <button onClick={buttonClickEvent} className="metronomeButton" >{state ? 'STOP' : 'START'}</button>
            <div className="beatWrap">
                <button onClick={()=>{beatControl(0)}}>&#60;</button>
                <p>{beat}</p>
                <button onClick={()=>{beatControl(1)}}>&#62;</button>
            </div>
            <p>Beat</p>
        </div>
    )
}

export default Metronome
