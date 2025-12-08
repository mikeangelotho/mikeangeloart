import { onMount } from "solid-js";
import videojs from "video.js";
import 'video.js/dist/video-js.css';


interface VideoJSPlayerProps {
    url: string;
}

export default function VideoJSPlayer(props: VideoJSPlayerProps) {
    let playerRef!: HTMLDivElement;
    onMount(() => {
        const videoEle = document.createElement("video-js");
        videoEle.classList.add('vjs-big-play-centered');
        playerRef.appendChild(videoEle);
        const videoJsOptions = {
            autoplay: false,
            controls: true,
            responsive: true,
            fluid: true,
            sources: [{
                src: props.url,
            }]
        };
        videojs(videoEle, videoJsOptions);
    })
    return (
        <div data-vjs-player>
            <div
                ref={playerRef}
            ></div>
        </div>
    );
}