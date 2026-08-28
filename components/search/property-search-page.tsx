import { OperationType } from "@prisma/client";
import { FilterPanel } from "@/components/search/filter-panel";
import { SearchResults } from "@/components/search/search-results";
import { searchProperties, PropertySearchInput } from "@/lib/search";

export interface PropertySearchPageProps {
  title: string;
  basePath: string;
  fixedOperation?: OperationType;
  searchParams: Promise<PropertySearchInput>;
}

export async function PropertySearchPage({ title, basePath, fixedOperation, searchParams }: PropertySearchPageProps) {
  const params = await searchParams;
  const { results, isFallback } = await searchProperties(params, fixedOperation);

  return (
    <main className="mx-auto max-w-[1240px] px-6 py-10 sm:px-8">
      <h1 className="mb-6 text-[clamp(26px,3vw,36px)]">{title}</h1>
      <FilterPanel basePath={basePath} showOperacion={!fixedOperation} values={params} />
      <SearchResults results={results} isFallback={isFallback} />
    </main>
  );
}
