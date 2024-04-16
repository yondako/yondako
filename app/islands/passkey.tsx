import Button from "@/components/common/Button";

export default function PasskeyOpenButton() {
  const loginHandler = async () => {
    try {
      const result = await navigator.credentials.get({
        publicKey: options,
      });
      console.log(result);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Button className="block mx-auto mt-10 text-base" onClick={loginHandler}>
      <span className="font-noto-emoji">🐙</span>
      <span className="ml-2">新規登録 or ログイン</span>
    </Button>
  );
}

// DEMO
const options: PublicKeyCredentialCreationOptions = {
  rp: {
    id: "dev.yondako.com",
    name: "yondako passkey demo",
  },
  challenge: new Uint8Array(16),
  user: {
    displayName: "yondako",
    id: new Uint8Array(16),
    name: "dev@dev.yondako.com",
  },
  pubKeyCredParams: [
    {
      alg: -7,
      type: "public-key",
    },
    {
      alg: -257,
      type: "public-key",
    },
  ],
};
