class OutputProcessor extends AudioWorkletProcessor {
  // eslint-disable-next-line class-methods-use-this
  process(_inputs, outputs, _parameters) {
    const output = outputs[0];
    output.forEach(channel => {
      for (let i = 0; i < channel.length; i += 1) {
        // eslint-disable-next-line no-param-reassign
        channel[i] = Math.random() * 2 - 1;
      }
    });
    return true;
  }
}

registerProcessor("output-processor", OutputProcessor);
