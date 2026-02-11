import { onMount } from "solid-js";
import videojs from "video.js";
import 'video.js/dist/video-js.css';
import { Media } from "./Collection";

export default function VideoJSPlayer(props: { video: Media }) {
    let playerRef!: HTMLDivElement;

    onMount(() => {
        const videoEle = document.createElement("video-js");
        videoEle.classList.add('vjs-big-play-centered');
        videoEle.setAttribute('playsinline', '');
        playerRef.appendChild(videoEle);
        const videoJsOptions = {
            autoplay: false,
            controls: true,
            responsive: true,
            fluid: true,
            sources: [{
                src: props.video.url,
            }]
        };
        if (!props.video.thumbnail) {
            const thumbUrl = props.video.url.split("/").map((val, idx) => {
                if (idx < 5) {
                    return val;
                }
            }).join("/") + "/thumbnail-1-0.png";
            props.video.thumbnail = thumbUrl
        }
        const player = videojs(videoEle, videoJsOptions);
        player.poster(props.video.thumbnail);
    });
    return (
        <div class="w-full rounded-lg overflow-hidden" data-vjs-player ref={playerRef}>
        </div>
    );
}