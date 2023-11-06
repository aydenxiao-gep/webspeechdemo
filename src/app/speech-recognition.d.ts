declare class SpeechRecognition {
    constructor();
    continuous : boolean;
    lang: string;
    interimResults: false;
    maxAlternatives: number;
    grammars: string;
    onresult: (event: any) => void;
    start(): void;
    stop(): void;
    onend(): void;
    onerror: (event: any) => void;
  }

declare interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
}

declare interface webkitSpeechRecognition {

}