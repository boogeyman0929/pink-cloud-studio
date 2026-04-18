import { useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Send } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kl - Party" },
      { name: "description", content: "Defaced by Lost.sh X Empty.lol" },
      { property: "og:title", content: "Kl - Party" },
      { property: "og:description", content: "Defaced by Lost.sh X Empty.lol" },
    ],
  }),
  component: Index,
});

const VIDEO_DURATION = 12.9;
const LOOP_WINDOW = 3;

function Index() {
  const [entered, setEntered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const loopingRef = useRef(false);

  const getLoopStart = (video: HTMLVideoElement) => {
    const duration =
      Number.isFinite(video.duration) && video.duration > 0 ? video.duration : VIDEO_DURATION;
    return Math.max(0, duration - LOOP_WINDOW);
  };

  const handleEnter = () => {
    setEntered(true);

    const v = videoRef.current;
    if (v) {
      v.muted = true;
      const playFromStart = () => {
        try {
          v.currentTime = 0;
        } catch {
          /* noop */
        }
        v.play().catch(() => {});
      };

      if (v.readyState >= 1 && Number.isFinite(v.duration) && v.duration > 0) {
        playFromStart();
      } else {
        const onReady = () => {
          v.removeEventListener("loadedmetadata", onReady);
          v.removeEventListener("canplay", onReady);
          playFromStart();
        };
        v.addEventListener("loadedmetadata", onReady);
        v.addEventListener("canplay", onReady);
        v.load();
      }
    }

    const a = audioRef.current;
    if (a) {
      const playAudio = () => {
        a.muted = false;
        a.volume = 1;
        try {
          a.currentTime = 0;
        } catch {
          /* noop */
        }
        a.play().catch(() => {});
      };

      if (a.readyState >= 2) {
        playAudio();
      } else {
        const onReady = () => {
          a.removeEventListener("loadeddata", onReady);
          a.removeEventListener("canplay", onReady);
          playAudio();
        };
        a.addEventListener("loadeddata", onReady);
        a.addEventListener("canplay", onReady);
        a.load();
      }
    }
  };

  const handleVideoEnded = () => {
    const v = videoRef.current;
    if (!v || loopingRef.current) return;

    loopingRef.current = true;

    const playFromLoopStart = () => {
      const loopStart = getLoopStart(v);
      const resumePlayback = () => {
        v.removeEventListener("seeked", resumePlayback);
        v.play().catch(() => {});
        loopingRef.current = false;
      };

      v.addEventListener("seeked", resumePlayback, { once: true });

      try {
        v.currentTime = loopStart;
      } catch {
        /* noop */
      }

      if (Math.abs(v.currentTime - loopStart) < 0.05) {
        v.removeEventListener("seeked", resumePlayback);
        v.play().catch(() => {});
        loopingRef.current = false;
      }
    };

    if (v.readyState >= 1 && Number.isFinite(v.duration) && v.duration > 0) {
      playFromLoopStart();
    } else {
      const onReady = () => {
        v.removeEventListener("loadedmetadata", onReady);
        v.removeEventListener("canplay", onReady);
        playFromLoopStart();
      };
      v.addEventListener("loadedmetadata", onReady);
      v.addEventListener("canplay", onReady);
      v.load();
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-black text-white">
      <style>{`
        @font-face {
          font-family: 'MinecraftDeface';
          src: url('/fonts/minecraft.ttf') format('truetype');
          font-display: block;
        }
      `}</style>

      <video
        ref={videoRef}
        src="/deface/video.mp4"
        muted
        playsInline
        onEnded={handleVideoEnded}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
          entered ? "opacity-40" : "opacity-0"
        }`}
      />
      <audio ref={audioRef} src="/deface/song-start.mp3" preload="auto" />

      <div className="absolute inset-0 bg-black/60" />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {!entered ? (
        <button
          onClick={handleEnter}
          className="absolute inset-0 flex items-center justify-center text-2xl tracking-[0.3em] text-white/90 transition-all duration-300 hover:tracking-[0.5em] hover:text-white md:text-3xl"
          style={{ fontFamily: "'MinecraftDeface', monospace" }}
        >
          [ click to enter ]
        </button>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-start gap-6 px-4 pt-10 text-center md:pt-16">
          <img
            src="/deface/mascot.gif"
            alt=""
            className="h-40 w-40 object-contain md:h-56 md:w-56"
            style={{ filter: "grayscale(1) contrast(1.1) brightness(1.1) invert(1)" }}
          />

          <div className="flex flex-1 flex-col items-center justify-center gap-5">
            <h1
              className="text-3xl tracking-[0.15em] text-white md:text-5xl"
              style={{
                fontFamily: "'MinecraftDeface', monospace",
                textShadow: "0 0 12px rgba(255, 61, 248, 0.55), 0 0 28px rgba(255, 61, 248, 0.3)",
              }}
            >
              Kl - Party
            </h1>
            <p
              className="text-base tracking-[0.2em] text-white/80 md:text-xl"
              style={{ fontFamily: "'MinecraftDeface', monospace" }}
            >
              Defaced by Lost.sh X Empty.lol
            </p>
            <a
              href="https://t.me/lostcyb"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 text-white/70 transition-colors hover:text-white"
              aria-label="Telegram"
            >
              <Send className="h-8 w-8 md:h-10 md:w-10" strokeWidth={1.5} />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
