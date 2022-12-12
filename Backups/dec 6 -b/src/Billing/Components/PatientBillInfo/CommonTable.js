import * as React from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Paper from "@mui/material/Paper";
import { visuallyHidden } from "@mui/utils";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Modal, { Button } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
// import useFileUpload from "../../Common Components/hooks/useFileUpload";
//set descending sort order
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

//set sort desc
function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export default function CommonTable(props) {
  //state varibale for the table
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState();
  const [page, setPage] = React.useState(0);
  const [open, setOpen] = React.useState();
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  //actions
  const [deleteAction, setDeleteAction] = React.useState(false);
  const [editAction, setEditAction] = React.useState(false);
  const [confirmAction, setconfirmAction] = React.useState(false);
  const [rescheduleAction, setrescheduleAction] = React.useState(false);
  const [cancelAction, setcancelAction] = React.useState(false);
  const [reportPic, setReportPic] = React.useState();
  const [reportName, setReportName] = React.useState(null);

  //   const investigationReport = useFileUpload();
  //by default asc order
  const handleSortRequest = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const createSortHandler = (property) => (event) => {
    handleSortRequest(event, property);
  };
  const removeHeaders = (headers, fieldToRemove) => {
    return headers.filter((v) => {
      return !fieldToRemove.includes(v);
    });
  };

  //set rows object to table
  const allHeaders = Object.keys(props.tableData.result[0]);

  const headers = removeHeaders(allHeaders, [
    "id",
    "totalAmount",
  ]);
  // headers.unshift("#");
  // headers[0] = "#";

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  //5,10.25 change as per the selection
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // React.useEffect(() => {
  //   props.tableData.actions.forEach((action) => {
  //     if (action === "Edit") {
  //       setEditAction(true);
  //     }
  //     if (action === "Delete") {
  //       setDeleteAction(true);
  //     }
  //     if (action === "Confirm") {
  //       setconfirmAction(true);
  //     }
  //     if (action === "Reschedule") {
  //       setrescheduleAction(true);
  //     }
  //     if (action === "Cancel") {
  //       setcancelAction(true);
  //     }
  //   });
  // }, []);


  //table start
  return (
    <div className="w-full h-[100%]  ">

      <Table stickyHeader sx={props.tableData.result.length<6 ?{ overflow: "scroll" }:{ overflow: "scroll" }}>
        <TableHead>
          <TableRow
          sx={{
            "& th": {
              paddingY: 0.5,
              backgroundColor: "#F1F1F1",
            },
          }}
          >
            {headers.map((header, index) => (
              <TableCell
                sortDirection={orderBy === header ? order : false}
                className="whitespace-nowrap"
                key={index}
              >
                <TableSortLabel
                  active={false} //arrow for sorting
                  direction={orderBy === header ? order : "asc"}
                  onClick={createSortHandler(header)}
                >
                  <span className="text-gray-600 font-bold">{header}</span>
                  {orderBy === header ? (
                    <Box component="span" sx={visuallyHidden}>
                      {order === "desc"
                        ? "sorted descending"
                        : "sorted ascending"}
                    </Box>
                  ) : null}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        {
          props.trimData ? (
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                     rows.slice().sort(getComparator(order, orderBy)) */}
              {stableSort(props.tableData.result, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) //splice use for show rows upto 5 when splice is not use that time show all rows
                .map((row, index) => {
                  return (
                    <TableRow
                      key={index}
    
                      sx={{
                        "& td": {
                          paddingY: 1,
                        },
                      }}
                    >
                      {headers &&
                        headers.map((header, i) => (
                          <TableCell className="whitespace-nowrap" key={i}>
                            {row[header]}
                          </TableCell>
                        ))}
                    </TableRow>
                  );
                })}
            </TableBody>

          ):(
            <TableBody>
                {props.tableData.result.map((row, index) => {
                  return (
                    <TableRow
                      key={index}
    
                      sx={{
                        "& td": {
                          paddingY: 1,
                        },
                      }}
                    >
                      {headers &&
                        headers.map((header, i) => (
                          <TableCell className="whitespace-nowrap" key={i}>
                            {row[header]}
                          </TableCell>
                        ))}
                    </TableRow>
                  );
                })}
            </TableBody>

          )
        }
      </Table>
    </div>
  );
}
