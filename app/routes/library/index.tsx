import { createRoute } from "honox/factory";
import LibraryLayout from "../../features/Library/components/Layout";
import { site } from "../../libs/constants";

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
