import IconAdjustments from "@/assets/icons/adjustments.svg";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { PATH_SEARCH } from "@/constants/path";
import { twMerge } from "tailwind-merge";
import SearchFilter from "../SearchFilter";
import type { SearchResultProps } from "../SearchResult";

type Props = Partial<Pick<SearchResultProps, "ndc" | "sensitive" | "query">>;

export default function SearchForm(props: Props) {
  const isFiltered = !!props.ndc || !!props.sensitive;

  return (
    <form className="m-0 flex w-full items-center gap-2" action={PATH_SEARCH}>
      <Input
        className="grow"
        name="q"
        defaultValue={props.query}
        placeholder="タイトル、著者名で検索"
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
            className={twMerge(
              "px-4 py-2",
              isFiltered && "bg-accent text-primary-background",
            )}
            style="noBorder"
          >
            <IconAdjustments className="h-5.5 w-5.5" />
          </Button>
        </SearchFilter>
      )}
    </form>
  );
}
