import { useState,useRef,useEffect } from "react" 
import BeatCell from "./Component/BeatCell";

function Metronome() {
    const [bpm, setBpm] = useState(90);
    const [beat, setBeat] = useState(4);
    const [state, setState] = useState(false);
    const [beatCells, setBeatCells] = useState([]);
    // let nextNoteTime = 0;
    const displayBpm = useRef();

    const audioContext = new AudioContext();

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

    const buildMainSound = () => {
        const compressor = new DynamicsCompressorNode(audioContext);
        const gain = new GainNode(audioContext, {gain: 0.25});

        compressor.connect(gain).connect(audioContext.destination);

        return compressor
    }

    const buildBeatCells = async (outputNode) => {
        const beatCells = []
        let response

        response = await fetch('/samples/drum-hh-01.mp3')
        let firstBuffer = await response.arrayBuffer()
        response = await fetch('/samples/drum-oh-01.mp3')
        let secondBuffer = await response.arrayBuffer()
    
        beatCells[0] = new BeatCell(outputNode, await audioContext.decodeAudioData(firstBuffer));
        beatCells[1] = new BeatCell(outputNode, await audioContext.decodeAudioData(secondBuffer));
        setBeatCells(beatCells)
    }

    const changeDisplayedBpm = (e) => {
        displayBpm.current.innerHTML = e.target.value + ' BPM'
    }

    useEffect(() => {
        const main = buildMainSound();
        buildBeatCells(main);
    },[])


    const beatInterval = () => {
        let interval = 100;
        return setInterval(() => {
            // while(nextNoteTime < )
        },interval) 
    }

    useEffect(() => {
        let interval = null;
        
        if(state) {
            interval = beatInterval()
        }
        
        return () => clearInterval(interval)
    },[bpm,beat,state])

    return(
        <div className="metrnome">
            <h3 className="bpmDisplay" ref={displayBpm}>{bpm} BPM</h3>
            <table className="beatDisplay">
                <tbody>
                    <tr>
                        <BeatElements/>
                    </tr>
                </tbody>
            </table>
            <div className="bpmSliderWrap">
                <input name="bpm" onMouseUp={bpmChangeEvent} onChange={changeDisplayedBpm} type="range" min="20" max="300" defaultValue={bpm}/>
            </div>
            <button onClick={buttonClickEvent} className="metronomeButton" >{state ? 'STOP' : 'START'}</button>
            
            <p>BEAT</p>
            <div className="beatWrap">
                <button onClick={()=>{beatControl(0)}}>&#60;</button>
                <p>{beat}</p>
                <button onClick={()=>{beatControl(1)}}>&#62;</button>
            </div>
        </div>
    )
}

export default Metronome
