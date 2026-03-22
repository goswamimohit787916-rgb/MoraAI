import { useState, useRef, useEffect } from 'react';
import { Play, Download, Mic, User, Settings, History } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'https://backend.goswamimohit787916.workers.dev/';

interface Voice {
  voice_id: string;
  name: string;
  category: string;
  preview_url?: string;
  voice_type?: string;
}

interface HistoryItem {
  id: string;
  text: string;
  voiceName: string;
  audioUrl: string;
  timestamp: Date;
}

export default function App() {
  const [apiKey, setApiKey] = useState(localStorage.getItem('elevenlabs_key') || '');
  const [voices, setVoices] = useState<Voice[]>([]);
  const [loadingVoices, setLoadingVoices] = useState(false);

  const [tab, setTab] = useState<'tts' | 'clone' | 'library'>('tts');
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // TTS State
  const [text, setText] = useState('Hello, this is my cloned voice speaking!');
  const [selectedVoiceId, setSelectedVoiceId] = useState('');
  const [stability, setStability] = useState(0.5);
  const [similarity, setSimilarity] = useState(0.75);
  const [style, setStyle] = useState(0);
  const [generating, setGenerating] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Cloning State
  const [cloneName, setCloneName] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [removeNoise, setRemoveNoise] = useState(false);
  const [cloning, setCloning] = useState(false);

  const saveKey = () => {
    localStorage.setItem('elevenlabs_key', apiKey);
    alert('API key saved! (For demo only – never commit to GitHub)');
  };

  const fetchVoices = async () => {
    if (!apiKey) return;
    setLoadingVoices(true);
    try {
      const res = await axios.get(`${API_BASE}/v2/voices`, {
        headers: { 'xi-api-key': apiKey },
      });
      setVoices(res.data.voices || []);
      if (res.data.voices?.length > 0 && !selectedVoiceId) {
        setSelectedVoiceId(res.data.voices[0].voice_id);
      }
    } catch (err) {
      alert('Failed to load voices. Check your API key.');
    }
    setLoadingVoices(false);
  };

  useEffect(() => {
    if (apiKey) fetchVoices();
  }, [apiKey]);

  const generateTTS = async () => {
    if (!selectedVoiceId || !text) return;
    setGenerating(true);

    const response = await axios.post(
      `\( {API_BASE}/v1/text-to-speech/ \){selectedVoiceId}`,
      {
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability,
          similarity_boost: similarity,
          style,
        },
      },
      {
        headers: { 'xi-api-key': apiKey, Accept: 'audio/mpeg' },
        responseType: 'blob',
      }
    );

    const audioUrl = URL.createObjectURL(response.data);
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      text,
      voiceName: voices.find(v => v.voice_id === selectedVoiceId)?.name || 'Unknown',
      audioUrl,
      timestamp: new Date(),
    };
    setHistory([newItem, ...history]);
    setGenerating(false);

    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play();
    }
  };

  const cloneVoice = async () => {
    if (!cloneName || files.length === 0) return;
    setCloning(true);

    const formData = new FormData();
    formData.append('name', cloneName);
    files.forEach(file => formData.append('files', file));
    if (removeNoise) formData.append('remove_background_noise', 'true');

    try {
      const res = await axios.post(`${API_BASE}/v1/voices/add`, formData, {
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert(`Voice cloned! ID: ${res.data.voice_id}`);
      setCloneName('');
      setFiles([]);
      fetchVoices(); // Refresh list
    } catch (err: any) {
      alert('Cloning failed: ' + (err.response?.data?.detail || err.message));
    }
    setCloning(false);
  };

  const downloadAudio = (url: string, filename: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  };

  const playPreview = (url?: string) => {
    if (!url) return alert('No preview available');
    const audio = new Audio(url);
    audio.play();
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      {/* Sidebar */}
      <div className="w-72 bg-zinc-900 border-r border-zinc-800 p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center">
            <Mic className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold">VoiceAI</h1>
        </div>

        <div className="mb-8">
          <p className="text-xs text-zinc-500 mb-2">ELEVENLABS API KEY</p>
          <div className="flex gap-2">
            <input
              type="password"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="sk_..."
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-sm"
            />
            <button onClick={saveKey} className="bg-violet-600 px-4 rounded-lg">Save</button>
          </div>
        </div>

        <nav className="space-y-2">
          {[
            { id: 'tts', label: 'Text to Speech', icon: Play },
            { id: 'clone', label: 'Voice Clone', icon: User },
            { id: 'library', label: 'My Voices', icon: Settings },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                tab === item.id ? 'bg-violet-600 text-white' : 'hover:bg-zinc-800'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-8 border-t border-zinc-800">
          <p className="text-xs text-zinc-500">History ({history.length})</p>
          <div className="max-h-64 overflow-auto mt-3 space-y-2 text-xs">
            {history.slice(0, 5).map(item => (
              <div key={item.id} className="bg-zinc-800 p-3 rounded-lg flex justify-between">
                <div className="truncate">{item.text.slice(0, 40)}...</div>
                <button onClick={() => downloadAudio(item.audioUrl, `voice-${item.id}.mp3`)} className="text-violet-400">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 overflow-auto">
        {tab === 'tts' && (
          <div>
            <h2 className="text-4xl font-bold mb-2">Text to Speech</h2>
            <p className="text-zinc-400 mb-8">Realistic AI voices • Instant voice clones</p>

            <div className="max-w-2xl">
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                className="w-full h-40 bg-zinc-900 border border-zinc-700 rounded-2xl p-6 text-lg resize-y"
                placeholder="Type or paste your text here..."
              />

              <div className="mt-6 grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Voice</label>
                  <select
                    value={selectedVoiceId}
                    onChange={e => setSelectedVoiceId(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-4"
                  >
                    {voices.map(v => (
                      <option key={v.voice_id} value={v.voice_id}>
                        {v.name} {v.category === 'cloned' ? '(Cloned)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Model</label>
                  <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 text-sm">eleven_multilingual_v2 (best)</div>
                </div>
              </div>

              {/* Voice Settings */}
              <div className="mt-8 space-y-8">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Stability</span>
                    <span>{stability}</span>
                  </div>
                  <input type="range" min="0" max="1" step="0.01" value={stability} onChange={e => setStability(+e.target.value)} className="w-full accent-violet-500" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Similarity Boost</span>
                    <span>{similarity}</span>
                  </div>
                  <input type="range" min="0" max="1" step="0.01" value={similarity} onChange={e => setSimilarity(+e.target.value)} className="w-full accent-violet-500" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Style</span>
                    <span>{style}</span>
                  </div>
                  <input type="range" min="0" max="1" step="0.01" value={style} onChange={e => setStyle(+e.target.value)} className="w-full accent-violet-500" />
                </div>
              </div>

              <button
                onClick={generateTTS}
                disabled={generating || !apiKey}
                className="mt-10 w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-50 py-5 rounded-2xl font-semibold text-lg flex items-center justify-center gap-3"
              >
                {generating ? 'Generating speech...' : 'Generate Speech'}
              </button>
            </div>

            {/* Audio Player */}
            <audio ref={audioRef} controls className="mt-10 w-full max-w-2xl" />
          </div>
        )}

        {tab === 'clone' && (
          <div className="max-w-xl">
            <h2 className="text-4xl font-bold mb-2">Instant Voice Cloning</h2>
            <p className="text-zinc-400">Upload 30-60 seconds of clear voice sample</p>

            <div className="mt-10 space-y-6">
              <input
                type="text"
                placeholder="Voice name (e.g. My Indian Accent)"
                value={cloneName}
                onChange={e => setCloneName(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-6 py-4 text-lg"
              />

              <label className="block">
                <span className="text-sm text-zinc-400 block mb-2">Voice Samples (MP3/WAV, multiple OK)</span>
                <input
                  type="file"
                  multiple
                  accept="audio/*"
                  onChange={e => setFiles(Array.from(e.target.files || []))}
                  className="block w-full text-sm text-zinc-400 file:mr-4 file:py-4 file:px-6 file:rounded-2xl file:border-0 file:bg-zinc-800 file:text-white hover:file:bg-zinc-700"
                />
                {files.length > 0 && <p className="mt-2 text-emerald-400">{files.length} file(s) selected</p>}
              </label>

              <label className="flex items-center gap-3">
                <input type="checkbox" checked={removeNoise} onChange={e => setRemoveNoise(e.target.checked)} className="w-5 h-5 accent-violet-600" />
                <span>Remove background noise (recommended for clean samples)</span>
              </label>

              <button
                onClick={cloneVoice}
                disabled={cloning || !cloneName || files.length === 0 || !apiKey}
                className="w-full bg-emerald-600 hover:bg-emerald-700 py-6 rounded-2xl font-bold text-xl disabled:opacity-50"
              >
                {cloning ? 'Cloning voice...' : 'Create Instant Clone'}
              </button>
            </div>
          </div>
        )}

        {tab === 'library' && (
          <div>
            <h2 className="text-4xl font-bold mb-8">Voice Library ({voices.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {voices.map(voice => (
                <div key={voice.voice_id} className="bg-zinc-900 border border-zinc-700 rounded-3xl p-6 hover:border-violet-500 transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-xl">{voice.name}</div>
                      <div className="text-xs text-zinc-500 uppercase tracking-widest mt-1">
                        {voice.category || voice.voice_type}
                      </div>
                    </div>
                    <button
                      onClick={() => playPreview(voice.preview_url)}
                      className="bg-zinc-800 hover:bg-zinc-700 p-3 rounded-2xl"
                    >
                      <Play className="w-5 h-5" />
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedVoiceId(voice.voice_id);
                      setTab('tts');
                    }}
                    className="mt-6 w-full bg-zinc-800 hover:bg-violet-600 py-4 rounded-2xl text-sm font-medium"
                  >
                    Use this voice in TTS →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
                  }
