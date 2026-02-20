import { Picture } from "./Picture";

export const MediaCluster = (props: { class?: string; src: string }) => {
    if (props.src.endsWith(".mp4")) {
      return (
        <video
          class={props.class}
          autoplay
          muted
          loop
          playsinline
          src={props.src}
        ></video>
      );
    } else {
      return <Picture alt="" class={props.class} loading="lazy" src={props.src} />;
    }
  };

  export default MediaCluster;