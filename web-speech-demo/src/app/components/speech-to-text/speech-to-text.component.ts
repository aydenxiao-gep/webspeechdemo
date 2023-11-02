import { Component } from '@angular/core';

@Component({
  selector: 'speech-to-text',
  templateUrl: './speech-to-text.component.html',
  styleUrls: ['./speech-to-text.component.scss']
})
export class SpeechToTextComponent {
  recognition = new window.webkitSpeechRecognition() // 实例化语音识别对象
  record = false
  btnText: string = 'Press & hold to talk';
  transcript: string = '';
  constructor() { }

  ngOnInit(): void {
    this.recognition.continuous = true;
    this.recognition.lang = 'en-US';
    this.recognition.onend = this.onRecognitionEnd.bind(this);
    this.recognition.onerror = this.onRecognitionError.bind(this);
    this.recognition.onresult = this.onRecognitionResult.bind(this);
  }

  onMouseDown() {
    this.record = true;
    this.recognition.start(); // 开始语音识别
    console.log('Start recording');
    this.btnText = 'Listening...';
  }

  onMouseUp() {
    this.btnText = 'Press to talk';
    this.record = false;
    this.recognition.stop();
  }

  onRecognitionEnd() {
    console.log('Stop recording');
    this.btnText = 'Start';
    this.record = false;
  }

  onRecognitionError(event: any) {
    console.log(event.error);
  }

  onRecognitionResult(event: any) {
    console.log(event);
    let result = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      result += event.results[i][0].transcript;
    }
    console.log(result);
    const transcript = document.getElementById('transcription');
    const p = document.createElement('p');
    p.textContent = result;
    transcript?.appendChild(p); 
    this.requestOpenAI(result).then((res) => {
      const p = document.createElement('p');
      p.textContent = res;
      transcript?.appendChild(p);
      // this.synthesizeSpeech(res);
    })
  }

  async requestOpenAI(content: any) {
    const BASE_URL = ``
    const OPENAI_API_KEY = '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'
    const messages = [
      {
        role: 'system',
        content: 'You are a helpful assistant',
      },
      { role: 'user', content },
    ]
    const res = await fetch(`${BASE_URL || 'https://api.openai.com'}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages,
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      }),
    })
    const response = await res.json()

    const result = response.choices[0].message.content
    console.log(result)
    return result
  }

  download(result: any) {
    const blob = new Blob([result.audioData])
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'filename.mp3' // set the filename here
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // synthesizeSpeech(text: string) {
  //   const sdk = SpeechSDK
  //   const speechConfig = sdk.SpeechConfig.fromSubscription('TTS_KEY', 'TTS_REGION')
  //   const audioConfig = sdk.AudioConfig.fromDefaultSpeakerOutput()

  //   const speechSynthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig, audioConfig)
  //   // 可以更改 Ssml 来改变声音
  //   speechSynthesizer.speakSsmlAsync(
  //     `<speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xmlns:emo="http://www.w3.org/2009/10/emotionml" version="1.0" xml:lang="zh-CN"><voice name="zh-CN-XiaoxiaoNeural">${text}</voice></speak>`,
  //     (result) => {
  //       if (result) {
  //         speechSynthesizer.close()

  //         return result.audioData
  //       }
  //     },
  //     (error) => {
  //       console.log(error)
  //       speechSynthesizer.close()
  //     }
  //   )
  // }
}
