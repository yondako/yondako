import CommonLayout from "@/components/layout/Common";
import { site } from "@/libs/constants";
import { createRoute } from "honox/factory";

export default createRoute((c) => {
  return c.render(
    <CommonLayout>
      <h1>Hello!</h1>
    </CommonLayout>,
    {
      title: `ライブラリ | ${site.name}`,
    },
  );
});
