import { Media } from "./Collection";
import VideoJSPlayer from "./VideoJSPlayer";

export default function VideoPlayer(props: { video: Media }) {
    if (props.video.url.includes("vimeo")) {
        return (
            <iframe
                src={props.video.url}
                class="aspect-video w-full"
                allow="fullscreen"
            ></iframe>
        )
    } else if (props.video.url.includes("gumlet")) {
        return (
            <VideoJSPlayer video={props.video} />
        )
    } else {
        if (props.video.url.includes("mp4")) {
            return (
                <video src={props.video.url} autoplay muted loop playsinline class="min-h-24 min-w-24 w-full object-cover"
                    title={props.video.altText}
                    aria-label={props.video.altText} />
            )
        } else {
            return (
                <img
                    src={props.video.url}
                    class="object-cover w-full"
                    alt={props.video.altText}
                />
            )
        }
    }
}