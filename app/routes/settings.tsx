import CommonLayout from "@/components/common/Layout";
import LogoutButton from "@/islands/LogoutButton";
import { createRoute } from "honox/factory";

const title = "設定";

export default createRoute((c) => {
  return c.render(
    <CommonLayout current={title}>
      <LogoutButton />
    </CommonLayout>,
    {
      title,
    },
  );
});
