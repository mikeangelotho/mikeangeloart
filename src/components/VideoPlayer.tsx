import VideoJSPlayer from "./VideoJSPlayer";

interface VideoPlayerProps {
    url: string;
}

export default function VideoPlayer(props: VideoPlayerProps) {
    if (props.url.includes("vimeo")) {
        return (
            <iframe
                src={props.url}
                class="aspect-video w-full"
                allow="fullscreen"
            ></iframe>
        )
    } else if (props.url.includes("gumlet")) {
        return (
            <VideoJSPlayer url={props.url} />
        )
    } else {
        return (
            <img
                src={props.url}
                class="object-cover w-full"
            />
        )
    }
}