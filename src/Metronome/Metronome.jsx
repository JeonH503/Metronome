import { useState,useRef,useEffect } from "react" 
import BeatCell from "./Component/BeatCell";

function Metronome() {
    const [bpm, setBpm] = useState(90);
    const [beat, setBeat] = useState(4);
    const [state, setState] = useState(false);
    const hh = useRef();
    const oh = useRef();

    const audioContext = new AudioContext();

    // test
    let beatCells

    const BeatElements = () => {
        let temp = Array(beat).fill(0)
        return temp.map((e,i) => <td key={i} className="beat"></td>);
    }

    const bpmChangeEvent = (e) => {
        setBpm(e.target.value);
    }

    const buttonClickEvent = () => {
        // setState(!state)


        // test code
        beatCells[0].playBeat();
        setTimeout(() => {
            beatCells[1].playBeat();
        }, 500);
    }

    const beatControl = (type) => {
        if(type && beat !== 7)
            setBeat(beat + 1)
        else if(!type && beat !== 1)
            setBeat(beat - 1)
    }

    const buildMainSound = () => {
        console.log("test")

        const compressor = new DynamicsCompressorNode(audioContext);
        const gain = new GainNode(audioContext, {gain: 0.25});

        compressor.connect(gain).connect(audioContext.destination);

        return compressor
    }

    const buildBeatCells = (outputNode) => {
        const beatCells = []
        const hhElement = hh.current;
        const ohElement = oh.current;

        beatCells[0] = new BeatCell(outputNode, hhElement);
        beatCells[1] = new BeatCell(outputNode, ohElement);
        
        return beatCells
    }

    useEffect(() => {
        console.log("test")
        const main = buildMainSound();
        beatCells = buildBeatCells(main);
    },[])

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
            
            <p>BEAT</p>
            <div className="beatWrap">
                <button onClick={()=>{beatControl(0)}}>&#60;</button>
                <p>{beat}</p>
                <button onClick={()=>{beatControl(1)}}>&#62;</button>
            </div>

            <audio ref={hh} src="/samples/drum-hh-01.mp3"></audio>
            <audio ref={oh} src="/samples/drum-oh-01.mp3"></audio>
        </div>
    )
}

export default Metronome
