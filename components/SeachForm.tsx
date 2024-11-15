import React from "react";
import Form from "next/form";
import SearchFormReset from "@/components/SeachFormReset";
import { Search } from "lucide-react";

const SeachForm = ({ query }: { query: string | undefined }) => {
  return (
    <Form action={`/`} scroll={false} className="search-form">
      <input
        name="query"
        defaultValue={query}
        className="search-input"
        placeholder="Search Startups"
      />
      <div className="flex gap-2">
        {query && <SearchFormReset />}{" "}
        <button type="submit" className="search-btn text-white">
          <Search className="size-5" />
        </button>
      </div>
    </Form>
  );
};

export default SeachForm;
