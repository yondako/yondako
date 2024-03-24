import CommonLayout from "@/components/layout/Common";
import { site } from "@/libs/constants";
import { createRoute } from "honox/factory";

const title = "ライブラリ";

export default createRoute((c) => {
  return c.render(
    <CommonLayout current={title}>
      <h1>Hello!</h1>
    </CommonLayout>,
    {
      title: `${title} | ${site.name}`,
    },
  );
});
