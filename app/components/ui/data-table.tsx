import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";

interface DataTableProps {
  columns: {
    header: string;
    accessorKey: string;
    cell?: (props: any) => React.ReactNode;
  }[];
  data: any[];
}

export function DataTable({ columns, data }: DataTableProps) {
  return (
    <Table aria-label="Data table">
      <TableHeader>
        {columns.map((column) => (
          <TableColumn key={column.accessorKey}>{column.header}</TableColumn>
        ))}
      </TableHeader>
      <TableBody>
        {data.map((row, i) => (
          <TableRow key={i}>
            {columns.map((column) => (
              <TableCell key={column.accessorKey}>
                {column.cell ? column.cell({ row }) : row[column.accessorKey]}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
