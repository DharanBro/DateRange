import { Column } from "@tanstack/react-table";
import { SearchIcon } from "lucide-react";
import { Input } from "../Input/Input";

interface ColumnFilterProps<T> {
  readonly column: Column<T>;
  readonly columnFilterValue: string;
  readonly setFilterValue: (value: string) => void;
}

export function ColumnFilter<T>({
  column,
  columnFilterValue,
  setFilterValue,
}: ColumnFilterProps<T>) {
  const isNumericFilter = String(column.columnDef.filterFn) === "numeric";

  return (
    <Input
      value={columnFilterValue ?? ""}
      onChange={(e) => setFilterValue(e.target.value)}
      placeholder={`Filter ${isNumericFilter ? "number" : "text"}...`}
      type={isNumericFilter ? "number" : "text"}
      icon={<SearchIcon className="h-4 w-4" />}
      clearable
    />
  );
} 