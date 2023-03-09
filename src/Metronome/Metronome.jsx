import { useState,useRef,useEffect } from "react" 
import BeatCell from "./Component/BeatCell";

let audioContext = new AudioContext();

function Metronome() {
    const [bpm, setBpm] = useState(90);
    const [beat, setBeat] = useState(4);
    const [state, setState] = useState(false);
    const [buffers, SetBuffers] = useState([]);
    const displayBpm = useRef();
    const beats = useRef([]);

    let nextNoteTime = 0;


    const BeatElements = () => {
        console.log("test")
        let temp = Array(beat).fill(0)
        return temp.map((e,i) => <td key={i} ref={(el) => beats.current[i] = el} className={"beat " + i}></td>);
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
        const gain = new GainNode(audioContext, {gain: 0.75});

        gain.connect(audioContext.destination);

        return gain
    }

    const buildBeatCells = (outputNode) => {
        const beatCells = []

        beatCells[0] = new BeatCell(outputNode, buffers[0]);
        beatCells[1] = new BeatCell(outputNode, buffers[1]);
        
        return beatCells
    }

    const decodeAudioFiles = async () => {
        let response
        let buffers = []

        response = await fetch('/samples/drum-hh-01.mp3')
        let firstBuffer = await response.arrayBuffer()
        response = await fetch('/samples/drum-oh-01.mp3')
        let secondBuffer = await response.arrayBuffer()

        buffers[0] = await audioContext.decodeAudioData(firstBuffer)
        buffers[1] = await audioContext.decodeAudioData(secondBuffer)

        SetBuffers(buffers)
    }
    const changeDisplayedBpm = (e) => {
        displayBpm.current.innerHTML = e.target.value + ' BPM'
    }

    const addNewSchedule = (index, beatCells) => {
        // 높은음일지 낮은음일지 고르기
         
        // 스케줄 추가
        let beatPerSec = 60 / bpm;
        
        if(index)
            beatCells[0].addSchedule(nextNoteTime);
        else 
            beatCells[0].addSchedule(nextNoteTime);

        nextNoteTime += beatPerSec;
    }

    useEffect(() => {
        decodeAudioFiles()

        audioContext = new AudioContext
    },[])


    const beatInterval = (beatCells) => {
        let interval = 100;
        let index = 0;

        return setInterval(() => {
            if(!nextNoteTime) //start할 시 currentTime이 
                              //자동 업데이트 되어 같은값으로 업데이트 필요
                nextNoteTime = audioContext.currentTime;
            
            while(nextNoteTime < audioContext.currentTime + 0.1) {
                addNewSchedule(index, beatCells);
                index = (index + 1) % beat;
            }
        },interval) 
    }

    useEffect(() => {
        let interval = null;
        
        if(state) {
            audioContext = new AudioContext
            const main = buildMainSound();
            const beatCells = buildBeatCells(main);
            interval = beatInterval(beatCells)
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
