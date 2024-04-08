import LibraryLayout from "@/components/library/Layout";
import { site } from "@/constants/site";
import { createRoute } from "honox/factory";

export default createRoute((c) => {
  return c.render(
    <LibraryLayout current="好きな本">
      <h1>Hello!</h1>
    </LibraryLayout>,
    {
      title: `好きな本 | ${site.name}`,
    },
  );
});
