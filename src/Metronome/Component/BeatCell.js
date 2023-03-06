class BeatCell {
    constructor(outputNode, audioElement) {
        this._context = outputNode.context;
        // this._buffer = audioBuffer;
        this._element = audioElement
        this._outputNode = outputNode
        
        this._bufferSource = this._context.createMediaElementSource(this._element)
        const amp = new GainNode(this._context);
        this._bufferSource.connect(amp).connect(this._outputNode);
    }

    // sourceConnect() {
    //     this._bufferSource = this._context.createMediaElementSource(this._element)
    //     const amp = new GainNode(this._context);
    //     this._bufferSource.connect(amp).connect(this._outputNode);
    // }

    playBeat() {
        if (this._context.state === 'suspended') {
            this._context.resume();
        }

        this._element.play();
    }
}

export default BeatCell;