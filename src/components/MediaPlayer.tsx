import { useEffect, useRef, useState } from "react";
import { Play, Pause, SkipForward, SkipBack } from "lucide-react";

const shuffleTracks = (arr: any) => {
    const copy = [ ...arr ]

    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor( Math.random() * (i + 1) );

        [copy[i], copy[j]] = [copy[j], copy[i]]
    }

    return copy;
};

const MediaPlayer = () => {
    const audioRef = useRef<HTMLAudioElement>(null);

    const [playlist, setPlaylist] = useState<string[]>([]);
    const [index, setIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [urls, setUrls] = useState<string[]>([]);
    const [currentTime, setCurrentTime] = useState(0);
        const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem("volume");
    return saved !== null && !isNaN(parseFloat(saved))
        ? parseFloat(saved)
        : 1;
    });

    useEffect(() => {
        fetch("https://pub-6aca0336882a442fbeb8fd517884cb0f.r2.dev/tracks.json")
            .then(res => res.json())
            .then((files: string[]) => {
            const urls = files.map(name =>
                `https://pub-6aca0336882a442fbeb8fd517884cb0f.r2.dev/${encodeURIComponent(name)}`
            );

            setUrls(urls);
            setPlaylist(shuffleTracks(urls));
        });
    }, []);

    useEffect(() => {
        if (playlist.length > 0 && audioRef.current) {
            setCurrentTime(0);
            setProgress(0);

            audioRef.current.src = playlist[index];
            audioRef.current.play();
    }
    }, [playlist, index]);

    const getTrackName = (url: string) => {
        const file = url.split("/").pop()!;
        const noQuery = file.split("?")[0];
        return decodeURIComponent(noQuery).replace(".ogg", "");
    };

    useEffect(() => {
        const saved = localStorage.getItem("volume");
        if (saved !== null) {
            const vol = parseFloat(saved);
            if (!isNaN(vol)) setVolume(vol);
        }
    }, []);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
        localStorage.setItem("volume", volume.toString());
    }, [volume]);

    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio) return;

        isPlaying ? audio.pause() : audio.play();
    };

      // Skip track
    const skipTrack = () => {
        if (!playlist.length) return;

        const nextIndex =
            index + 1 < playlist.length ? index + 1 : 0;

        if (nextIndex === 0) {
            // reached the end → reshuffle
            setPlaylist(shuffleTracks(urls));
            // t t t :)
        }

        setIndex(nextIndex);
    };

    const formatTime = (sec: number) => {
        if (!sec || isNaN(sec)) return "0:00";

        const minutes = Math.floor(sec / 60);
        const seconds = Math.floor(sec % 60)
            .toString()
            .padStart(2, "0");

        return `${minutes}:${seconds}`;
    };

    const handleEnded = () => skipTrack();

    return (
        <div className="flex gap-1 flex-col items-center">
            {playlist.length > 0 && (
                <h1 className="text-3xl text-shadow-black text-[#ffff00]">{getTrackName(playlist[index])}</h1>
            )}

            <audio
                ref={audioRef}
                onEnded={handleEnded}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onLoadedMetadata={() => {
                    if (audioRef.current) {
                        setDuration(audioRef.current.duration);
                    }
                }}
                onTimeUpdate={() => {
                    if (!audioRef.current) return;

                    const a = audioRef.current;
                    setCurrentTime(a.currentTime);

                    const dur = a.duration;
                    if (dur > 0) {
                        setProgress((a.currentTime / dur) * 100);
                    }
                }}
                className="hidden"
            />

            {/* TIMELINE */}
            <div className="w-96 flex flex-col items-center">
                <label className="text-[#ffff00] text-xl text-shadow-black">
                    {formatTime(currentTime)} / {formatTime(duration)}
                </label>
                <input
                    type="range"
                    min={0}
                    max={100}
                    step={0.1}
                    value={progress}
                    onChange={(e) => {
                    const pct = parseFloat(e.target.value);
                    setProgress(pct);

                    if (audioRef.current && duration > 0) {
                        audioRef.current.currentTime = (pct / 100) * duration;
                    }
                    }}
                    className="slider w-full"
                    style={{ ["--value" as any]: `${progress}%` }}
                />
            </div>

            {/* VOLUME */}
            <div className="w-64 flex flex-col items-center">
                <label className="text-[#ffff00] text-shadow-black">Volume</label>
                <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="slider w-full"
                    style={{ ["--value" as any]: `${volume * 100}%` }}
                />
            </div>

            {/* CONTROLS */}
            <div className="flex items-center gap-6">
                {/* GO BACK */}
                <button
                    onClick={() => setIndex(index > 0 ? index - 1 : playlist.length - 1)}
                    className="rounded-lg transition text-[#ffff00] icon-fill-transition text-shadow-black"
                >
                    <SkipBack size={28} />
                </button>

                {/* PLAY / PAUSE */}
                <button
                    onClick={togglePlay}
                    className="rounded-lg transition text-[#ffff00] icon-fill-transition text-shadow-black"
                >
                    {isPlaying ? <Pause size={28} /> : <Play size={28} />}
                </button>

                {/* SKIP */}
                <button
                    onClick={skipTrack}
                    className="rounded-lg transition text-[#ffff00] icon-fill-transition text-shadow-black"
                >
                    <SkipForward size={28} />
                </button>
            </div>
        </div>
    )
};

export default MediaPlayer;