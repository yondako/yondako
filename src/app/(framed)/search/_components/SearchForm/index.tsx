import Input from "@/components/Input";
import { NDCList } from "@/types/ndc";
import type { SearchResultProps } from "../SearchResult";

type Props = Partial<Pick<SearchResultProps, "ndc" | "query">>;

export default function SearchForm({ ndc, query }: Props) {
  return (
    <form className="m-0 flex w-full items-center gap-2" action="/search">
      <div className="before:-translate-y-1/2 relative before:pointer-events-none before:absolute before:top-1/2 before:right-3 before:h-4 before:w-4 before:transform before:bg-chevron-down before:content-['']">
        <select
          className="appearance-none rounded-full bg-tertiary-background py-2 pr-10 pl-4 text-sm focus:outline focus:outline-2 focus:outline-accent"
          name="ndc"
          defaultValue={ndc}
        >
          <option value="">すべて</option>
          {NDCList.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <Input
        className="grow"
        name="q"
        defaultValue={query}
        placeholder="タイトル、著者名で検索"
        autoFocus={!query}
        inputMode="search"
        search
      />
    </form>
  );
}
