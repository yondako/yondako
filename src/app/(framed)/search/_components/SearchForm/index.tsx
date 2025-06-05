import IconAdjustments from "@/assets/icons/adjustments.svg";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Select from "@/components/Select";
import { PATH_SEARCH } from "@/constants/path";
import { DEFAULT_SEARCH_TYPE, type SearchType } from "@/types/search";
import { twMerge } from "tailwind-merge";
import SearchFilter from "../SearchFilter";
import type { SearchResultProps } from "../SearchResult";

type Props = Partial<Pick<SearchResultProps, "ndc" | "sensitive" | "query">> & {
  searchType?: SearchType;
};

/**
 * 書籍検索用のフォームコンポーネント
 */
export default function SearchForm(props: Props) {
  const isFiltered = !!props.ndc || !!props.sensitive;
  const searchType = props.searchType || DEFAULT_SEARCH_TYPE;

  return (
    <form className="m-0 flex w-full flex-col items-center gap-2 md:flex-row" action={PATH_SEARCH}>
      <Select className="w-full shrink-0 md:w-auto" name="type" defaultValue={searchType}>
        <option value="title">タイトルから</option>
        <option value="creator">著者名から</option>
        <option value="any">すべてから</option>
      </Select>
      <div className="flex w-full gap-2">
        <Input
          className="grow"
          name="q"
          defaultValue={props.query}
          placeholder="キーワードをここに入力してね"
          autoFocus={!props.query}
          inputMode="search"
          search
        />
        {props.ndc && <input type="hidden" name="ndc" value={props.ndc} />}
        {props.sensitive && <input type="hidden" name="sensitive" value="true" />}
        {props.query && (
          <SearchFilter {...props}>
            <Button
              type="button"
              className={twMerge("px-4 py-2", isFiltered && "bg-accent text-primary-background")}
              style="noBorder"
            >
              <IconAdjustments className="h-5.5 w-5.5" />
            </Button>
          </SearchFilter>
        )}
      </div>
    </form>
  );
}
