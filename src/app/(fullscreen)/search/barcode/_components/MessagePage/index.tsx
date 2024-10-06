import MessageTako, { type MessageTakoProps } from "@/components/MessageTako";
import MobileHeader from "@/components/MobileHeader";

export default function MessagePage(props: MessageTakoProps) {
  return (
    <div className="flex h-svh items-center px-6">
      <MobileHeader className="fixed inset-0 z-10 h-fit text-accent" />
      <MessageTako {...props} />
    </div>
  );
}
