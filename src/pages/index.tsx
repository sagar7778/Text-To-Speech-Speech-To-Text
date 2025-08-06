"use client";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

// Extend Window type to include webkitSpeechRecognition
declare global {
  interface SpeechRecognition extends EventTarget {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    start(): void;
    stop(): void;
    abort(): void;
    onresult: ((event: any) => void) | null;
    onend: (() => void) | null;
  }
  interface Window {
    webkitSpeechRecognition: {
      new (): SpeechRecognition;
    };
    SpeechRecognition: {
      new (): SpeechRecognition;
    };
  }
}

export default function Home() {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("en-US");
  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  // 🔁 Setup recognition on mount
  useEffect(() => {
    const SpeechRecognition =
      typeof window !== "undefined" &&
      (window.SpeechRecognition || window.webkitSpeechRecognition);

    if (!SpeechRecognition) {
      console.warn("SpeechRecognition not supported in this browser.");
      return;
    }

    const recog = new SpeechRecognition();
    recog.continuous = false;
    recog.lang = language;
    recog.interimResults = false;

    recog.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setText((prev) => prev + " " + transcript);
      setListening(false);
    };

    recog.onend = () => setListening(false);

    setRecognition(recog);
  }, [language]);

  // 🎤 Start voice recognition
  const startListening = () => {
    if (recognition) {
      setListening(true);
      recognition.start();
    }
  };

  // 🔊 Speak the text
  const speak = () => {
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  return (
    <main className="min-h-screen bg-gradient-to-r from-sky-100 to-blue-200 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold text-blue-800">
            🗣️ Text ↔ Speech Generator
          </CardTitle>
          <CardDescription>
            Convert speech to text and text to speech easily.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="📝 Type or dictate your message..."
              rows={5}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-gray-800"
            />
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en-US">🇺🇸 English (US)</SelectItem>
                  <SelectItem value="hi-IN">🇮🇳 Hindi</SelectItem>
                  <SelectItem value="gu-IN">🇮🇳 Gujarati</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button
                  onClick={speak}
                  className="bg-blue-600 hover:bg-blue-700 transition"
                >
                  🔊 Speak
                </Button>
                <Button
                  onClick={startListening}
                  className="bg-green-600 hover:bg-green-700 transition"
                  disabled={listening}
                >
                  🎙️ {listening ? "Listening..." : "Start Listening"}
                </Button>
              </div>
            </div>
            <p className="text-center text-sm text-gray-500">
              Built with 💙 using Web Speech API (Text ↔ Speech)
            </p>
          </div>
          <p className="text-center text-xs text-gray-400 mt-2">
            Created by{" "}
            <span className="font-semibold text-gray-600">Sagar Koshti</span>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
