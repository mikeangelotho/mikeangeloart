import { Media } from "~/types";
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
            return (
                <video src={props.video.url} autoplay muted loop playsinline class="min-h-24 min-w-24 w-full object-cover"
                    title={props.video.altText}
                    aria-label={props.video.altText} />
            )
    }
}