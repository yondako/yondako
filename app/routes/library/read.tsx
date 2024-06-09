import LibraryLayout from "@/components/library/Layout";
import { createRoute } from "honox/factory";

export default createRoute((c) => {
  return c.render(
    <LibraryLayout current="よんだ">
      <h1>Hello!</h1>
    </LibraryLayout>,
    {
      title: "よんだ",
    },
  );
});
