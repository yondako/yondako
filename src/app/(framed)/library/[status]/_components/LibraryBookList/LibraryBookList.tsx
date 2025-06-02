import { getCloudflareContext } from "@opennextjs/cloudflare";
import { headers } from "next/headers";
import BookList from "#src/components/BookList/index.jsx";
import Pagination from "#src/components/Pagination/index.jsx";
import SayTako from "#src/components/SayTako/index.jsx";
import {
  type SearchBooksFromLibraryOptions,
  searchBooksFromLibrary,
} from "#src/db/queries/status.js";
import { getAuth } from "#src/lib/auth.js";
import { getEmptyMessage, pageSize } from ".";
import Filter from "./Filter";

export async function LibraryBookList(
  props: Omit<SearchBooksFromLibraryOptions, "userId" | "pageSize">,
) {
  const { env } = getCloudflareContext();
  const auth = getAuth(env.DB);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return null;
  }

  const { books, total } = await searchBooksFromLibrary(env.DB, {
    userId: session.user.id,
    pageSize,
    ...props,
  });

  const totalPage = Math.ceil(total / pageSize);

  return (
    <>
      <div className="mt-10 flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 ">
        <h1 className="flex w-full grow-0 items-end font-bold sm:w-auto">
          <span className="text-4xl">{total}</span>
          <span className="text-base">冊</span>
        </h1>
        <Filter isOrderAsc={props.order === "asc"} />
      </div>
      {books.length === 0 ? (
        <SayTako message={getEmptyMessage(props.status)} />
      ) : (
        <>
          <BookList className="mt-2" items={books} />
          {totalPage !== 1 && (
            <Pagination
              className="mt-auto pt-10"
              currentPage={props.page}
              totalPage={totalPage}
            />
          )}
        </>
      )}
    </>
  );
}
