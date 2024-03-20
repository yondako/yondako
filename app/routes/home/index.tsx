import { createRoute } from "honox/factory";
import CommonLayout from "../../components/layout/Common";
import { site } from "../../libs/constants";

export default createRoute((c) => {
  return c.render(
    <CommonLayout>
      <h1>Hello!</h1>
    </CommonLayout>,
    {
      title: `ホーム | ${site.name}`,
    },
  );
});
