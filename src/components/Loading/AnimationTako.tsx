import animatedEmojiOctpus from "@/assets/animated-emoji/1f419/lottie.json";
import { Player } from "@lottiefiles/react-lottie-player";

export default function AnimationTako() {
  return (
    <Player className="h-24 w-24" autoplay loop src={animatedEmojiOctpus} />
  );
}
