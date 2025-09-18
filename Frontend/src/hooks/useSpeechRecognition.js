import { useState, useEffect, useCallback, useRef } from "react";

// Language mapping for speech recognition
const SPEECH_LANG_MAP = {
  english: 'en-IN',
  malayalam: 'ml-IN',
  hindi: 'hi-IN',
  tamil: 'ta-IN',
  odia: 'or-IN'
};

export default function useSpeechRecognition() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState(null);
  
  const recognitionRef = useRef(null);
  const timeoutRef = useRef(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true);
      
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      // Get current language from localStorage
      const currentLang = localStorage.getItem('lang') || 'english';
      const speechLang = SPEECH_LANG_MAP[currentLang] || 'en-IN';
      
      // Configure recognition
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = speechLang;
      recognition.maxAlternatives = 1;
      
      // Handle results
      recognition.onresult = (event) => {
        let finalTranscript = "";
        let interimTranscript = "";
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
          } else {
            interimTranscript += result[0].transcript;
          }
        }
        
        setTranscript(finalTranscript || interimTranscript);
        
        // Auto-stop after getting final result
        if (finalTranscript) {
          setListening(false);
          setError(null);
        }
      };
      
      // Handle errors
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setListening(false);
        
        switch (event.error) {
          case 'no-speech':
            setError('No speech detected. Please try again.');
            break;
          case 'audio-capture':
            setError('Microphone access denied.');
            break;
          case 'not-allowed':
            setError('Microphone permission denied.');
            break;
          case 'network':
            setError('Network error. Check your connection.');
            break;
          default:
            setError('Speech recognition failed. Please try again.');
        }
      };
      
      // Handle end of recognition
      recognition.onend = () => {
        setListening(false);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
      
      // Handle start
      recognition.onstart = () => {
        setError(null);
        // Auto-stop after 10 seconds
        timeoutRef.current = setTimeout(() => {
          if (recognitionRef.current) {
            recognitionRef.current.stop();
          }
        }, 10000);
      };
      
      recognitionRef.current = recognition;
    } else {
      setIsSupported(false);
      console.warn('Speech recognition not supported in this browser');
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Update language when it changes
  useEffect(() => {
    if (recognitionRef.current) {
      const currentLang = localStorage.getItem('lang') || 'english';
      const speechLang = SPEECH_LANG_MAP[currentLang] || 'en-IN';
      recognitionRef.current.lang = speechLang;
    }
  }, []);

  const startListening = useCallback(() => {
    if (!isSupported || !recognitionRef.current) {
      setError('Speech recognition not supported');
      return;
    }
    
    if (listening) return;
    
    try {
      setError(null);
      setTranscript("");
      setListening(true);
      recognitionRef.current.start();
    } catch (err) {
      console.error('Error starting recognition:', err);
      setError('Failed to start speech recognition');
      setListening(false);
    }
  }, [isSupported, listening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && listening) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.error('Error stopping recognition:', err);
      }
    }
    setListening(false);
  }, [listening]);

  const toggleListening = useCallback(() => {
    if (listening) {
      stopListening();
    } else {
      startListening();
    }
  }, [listening, startListening, stopListening]);

  const resetTranscript = useCallback(() => {
    setTranscript("");
    setError(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current && listening) {
        try {
          recognitionRef.current.stop();
        } catch (err) {
          console.error('Cleanup error:', err);
        }
      }
    };
  }, [listening]);

  return {
    listening,
    transcript,
    isSupported,
    error,
    startListening,
    stopListening,
    toggleListening,
    resetTranscript
  };
}