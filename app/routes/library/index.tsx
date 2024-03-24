import LibraryLayout from "@/components/layout/Library";
import { site } from "@/libs/constants";
import { createRoute } from "honox/factory";

export default createRoute((c) => {
  return c.render(
    <LibraryLayout current="読む本">
      <h1>Hello!</h1>
    </LibraryLayout>,
    {
      title: `読む本 | ${site.name}`,
    },
  );
});
