import { DATA_TABLE_PAGE_SIZES } from "@/constants";
import type { PaginatedResponseModel } from "@/models/examples/paged-result.model";
import type { UserModel } from "@/models/examples/user.model";
import { usersQueryOptions } from "@/services/examples/users.service";
import { Avatar } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "mantine-datatable";
import { useState } from "react";

interface Props {
  onUserSelected: (user: UserModel) => void;
}

function UsersList({ onUserSelected }: Props) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DATA_TABLE_PAGE_SIZES[0] ?? 10);
  const { data, isFetching } = useQuery<PaginatedResponseModel<UserModel>>(
    usersQueryOptions(page, pageSize),
  );

  return (
    <DataTable
      withTableBorder
      minHeight={350}
      columns={[
        { accessor: "id" },
        {
          accessor: "avatar",
          render: (record) => <Avatar src={record.avatar} />,
        },
        { accessor: "first_name" },
        { accessor: "last_name" },
        { accessor: "email" },
      ]}
      records={data?.data ?? []}
      totalRecords={data?.total}
      page={page}
      recordsPerPage={pageSize}
      recordsPerPageOptions={DATA_TABLE_PAGE_SIZES}
      onRecordsPerPageChange={setPageSize}
      onPageChange={(p) => setPage(p)}
      fetching={isFetching}
      loaderType="dots"
      onRowClick={(row) => onUserSelected(row.record)}
    />
  );
}

export default UsersList;
