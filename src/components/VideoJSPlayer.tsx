import { onMount, onCleanup } from "solid-js";
import videojs from "video.js";
import 'video.js/dist/video-js.css';
import { Media } from "~/types";

export default function VideoJSPlayer(props: { video: Media }) {
    let playerRef!: HTMLDivElement;
    let player: ReturnType<typeof videojs> | null = null;

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
        player = videojs(videoEle, videoJsOptions);
        player.poster(props.video.thumbnail);

        onCleanup(() => {
            if (player) {
                player.dispose();
                player = null;
            }
        });
    });
    return (
        <div class="w-full overflow-hidden" data-vjs-player ref={playerRef}>
        </div>
    );
}