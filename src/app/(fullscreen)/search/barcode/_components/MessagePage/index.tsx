import MessageTako, {
  type MessageTakoProps,
} from "#src/components/MessageTako/index";
import MobileHeader from "#src/components/MobileHeader/index";

export default function MessagePage(props: MessageTakoProps) {
  return (
    <div className="flex h-svh items-center px-6">
      <MobileHeader className="fixed inset-0 z-10 h-fit text-accent" />
      <MessageTako {...props} />
    </div>
  );
}
