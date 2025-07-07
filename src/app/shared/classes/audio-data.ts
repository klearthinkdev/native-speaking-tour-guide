export class AudioData {
  /**
   * 錄音文件長度
   */
  size: number = 0;
  /**
   * 錄音緩存
   */
  buffer: Float32Array[] = [];
  /**
   * 輸入採樣率
   */
  inputSampleRate: number;
  /**
   * 輸入採樣數位 8, 16
   */
  inputSampleBits: number = 16;
  /**
   * 輸出採樣率
   */
  outputSampleRate: number = 16000;
  /**
   * 輸出採樣數位 8, 16
   */
  outputSampleBits: number = 16;

  constructor(private context: AudioContext) {
    this.inputSampleRate = this.context.sampleRate;
  }

  input(data: Array<number>): void {
    this.buffer.push(new Float32Array(data));
    this.size += data.length;
  }

  clear(): void {
    this.buffer = [];
    this.size = 0;
  }

  shift(): void {
    this.size -= this.buffer.shift()?.length ?? 0;
  }

  async encodeHeaderlessWavData(): Promise<ArrayBuffer> {
    const bytes1 = new Float32Array(this.size);
    let offset1 = 0;

    this.buffer.forEach((bytes) => {
      bytes1.set(bytes, offset1);

      offset1 += bytes.length;
    });

    const source = this.context.createBuffer(1, bytes1.length, this.inputSampleRate);
    source.copyToChannel(bytes1, 0);

    const offlineContext = new OfflineAudioContext(
      source.numberOfChannels,
      source.duration * this.outputSampleRate,
      this.outputSampleRate,
    );

    const offlineSource = offlineContext.createBufferSource();
    offlineSource.buffer = source;
    offlineSource.connect(offlineContext.destination);
    offlineSource.start();

    const ab = await offlineContext.startRendering();
    const bytes2 = ab.getChannelData(0);
    let offset2 = 0;

    const byteLength = bytes2.length * (this.outputSampleBits / 8);
    const buffer = new ArrayBuffer(byteLength);
    const data = new DataView(buffer);

    switch (this.outputSampleBits) {
      case 8:
        bytes2.forEach((byte) => {
          const s = Math.max(-1, Math.min(1, byte));
          const value = 255 / (65535 / ((s < 0 ? s * 0x8000 : s * 0x7fff) + 32768));

          data.setInt8(offset2, value);

          offset2 += 1;
        });
        break;
      case 16:
        bytes2.forEach((byte) => {
          const s = Math.max(-1, Math.min(1, byte));
          const value = s < 0 ? s * 0x8000 : s * 0x7fff;

          data.setInt16(offset2, value, true);

          offset2 += 2;
        });
        break;
    }

    return buffer;
  }
}
