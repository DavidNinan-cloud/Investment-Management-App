import * as React from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableSortLabel from "@mui/material/TableSortLabel";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import { visuallyHidden } from "@mui/utils";
import Tooltip from "@mui/material/Tooltip";
import LoadingSpinner from "../../../../Common Components/loadingspinner/loadingSpinner";
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

export default function RouteTable(props) {
  console.log("Department table props are " + JSON.stringify(props));
  const {
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    count,
    dataResult,
    setDataResult,
    searchString,
    tableApiFunc,
    unitId,
  } = props;

  console.log("You have entered the RouteTable Component ");
  console.log(JSON.stringify(props));
  console.log("dataResult inside the table is " + JSON.stringify(dataResult));

  //state varibale for the table
  const [spinner, showSpinner] = React.useState(false);
  console.log("result", props.data.result);
  //state varibale for the table
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState();

  const [open, setOpen] = React.useState();

  //actions
  const [editAction, setEditAction] = React.useState(false);
  const [deleteAction, setDeleteAction] = React.useState(false);
  const [confirmAction, setconfirmAction] = React.useState(false);
  const [rescheduleAction, setrescheduleAction] = React.useState(false);
  const [cancelAction, setcancelAction] = React.useState(false);

  const [oldCount, setOldCount] = React.useState();

  //by default asc order
  const handleSortRequest = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const createSortHandler = (property) => (event) => {
    handleSortRequest(event, property);
  };

  // const removeHeaders = (headers, fieldToRemove) => {
  //   return headers.filter((v) => {
  //     return !fieldToRemove.includes(v);
  //   });
  // };

  //set rows object to table
  // const allHeaders = Object.keys(props.data.result[0]);

  // removeHeaders(allHeaders, ["Id"]);
  // headers.unshift("#");
  // headers[0] = "#";
  const handlePageChange = (event, newPage) => {
    console.log("newPage", newPage);
    setOldCount((page + 1) * rowsPerPage);
    setPage(parseInt(newPage));
  };

  //5,10.25 change as per the selection
  const handleChangeRowsPerPage = (event) => {
    setOldCount((page + 1) * rowsPerPage);
    let newRows = parseInt(event.target.value, 10);
    let newTotal = (page + 1) * newRows;
    let additionalRecord = newTotal - count;
    if (additionalRecord > newRows) {
      setPage(page - 1);
    }
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const defaultParams = {
    page: page,
    size: rowsPerPage,
    searchString: searchString,
    unit: unitId,
  };

  React.useEffect(() => {
    console.log("checkCallApi has been called");
    checkCallApi(page, rowsPerPage, oldCount);
  }, [page, rowsPerPage, oldCount]);

  const checkCallApi = (pageNo, rowsPerPageNo, oldTotal) => {
    pageNo = pageNo + 1;
    let newTotal = pageNo * rowsPerPageNo;
    console.log("oldTotal", oldTotal);
    console.log("newTotal", newTotal);
    let arr = [...dataResult];
    let totalDataLength = count;
    let availableDataLength = arr.length;
    if (totalDataLength > availableDataLength) {
      // page has moved forward
      console.log("page", pageNo);
      console.log("rowsPerPage", rowsPerPageNo);
      console.log("totalDataLength", totalDataLength);
      console.log("availableDataLength", availableDataLength);

      // if i dont have total record to show
      if (newTotal > availableDataLength) {
        //
        let require = newTotal - availableDataLength;
        let toShow = availableDataLength + require;

        // check available vs needed
        // needed is less than count
        let needed;
        if (toShow < totalDataLength) {
          needed = newTotal - oldTotal;
          callAgainTableApi(needed);
        } else if (toShow > totalDataLength) {
          needed = toShow - totalDataLength;
          callAgainTableApi(needed);
        } else {
          needed = rowsPerPageNo;
          callAgainTableApi(needed);
        }
      }
    }
  };
  const callAgainTableApi = (recordsNeeded) => {
    console.log("defaultParams", defaultParams);
    showSpinner(true);
    tableApiFunc(defaultParams)
      .then((response) => response.data)
      .then((res) => {
        let routeList = [];
        res.result.forEach((jsonString) => {
          let jsonObject = JSON.parse(jsonString);
          routeListT.push(jsonObject);
        });

        let incomingData = routeList;
        let onlyNeededData = incomingData.slice(-Math.abs(recordsNeeded));

        // append needed data
        let existData = [...dataResult];
        for (let value of onlyNeededData) {
          existData.push(value);
        }
        setDataResult(existData);
      })
      .catch(() => {
        showSpinner(false);
      });
  };
  React.useEffect(() => {
    props.data.actions.forEach((action) => {
      if (action === "Edit") {
        setEditAction(true);
      }
      if (action === "Delete") {
        setDeleteAction(true);
      }
      if (action === "Confirm") {
        setconfirmAction(true);
      }
      if (action === "Reschedule") {
        setrescheduleAction(true);
      }
      if (action === "Cancel") {
        setcancelAction(true);
      }
    });
  }, []);

  //table start
  return (
    <>
      <div className="grid w-auto">
        <Box sx={{ width: "100%", overflow: "hidden" }}>
          <Paper sx={{ width: "100%", my: 2 }}>
            <TablePagination
              rowsPerPageOptions={[10, 15, 25]}
              component="div"
              count={count}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <TableContainer
              sx={{
                "&::-webkit-scrollbar": {
                  width: 7,
                  height: 5,
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: "#7393B3",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "lightBlue",
                },
              }}
              className="rounded "
            >
              <Table>
                <TableHead>
                  <TableRow
                    sx={{
                      "& th": {
                        paddingY: 1,
                        backgroundColor: "#F1F1F1",
                      },
                    }}
                  >
                    <TableCell
                      sortDirection={orderBy === "Id" ? order : false}
                      className="whitespace-nowrap"
                    >
                      <TableSortLabel
                        active={false} //arrow for sorting
                        direction={orderBy === "srNo" ? order : "asc"}
                        onClick={createSortHandler("srNo")}
                      >
                        <span className="text-gray-600 font-bold">Sr No.</span>
                        {orderBy === "srNo" ? (
                          <Box component="span" sx={visuallyHidden}>
                            {order === "desc"
                              ? "sorted descending"
                              : "sorted ascending"}
                          </Box>
                        ) : null}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell
                      sortDirection={orderBy === "routeCode" ? order : false}
                      className="whitespace-nowrap"
                    >
                      <TableSortLabel
                        active={false} //arrow for sorting
                        direction={orderBy === "routeCode" ? order : "asc"}
                        onClick={createSortHandler("routeCode")}
                      >
                        <span className="text-gray-600 font-bold">
                          Route Code
                        </span>
                        {orderBy === "routeCode" ? (
                          <Box component="span" sx={visuallyHidden}>
                            {order === "desc"
                              ? "sorted descending"
                              : "sorted ascending"}
                          </Box>
                        ) : null}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell
                      sortDirection={orderBy === "route" ? order : false}
                      className="whitespace-nowrap"
                    >
                      <TableSortLabel
                        active={false} //arrow for sorting
                        direction={orderBy === "route" ? order : "asc"}
                        onClick={createSortHandler("route")}
                      >
                        <span className="text-gray-600 font-bold">Route</span>
                        {orderBy === "route" ? (
                          <Box component="span" sx={visuallyHidden}>
                            {order === "desc"
                              ? "sorted descending"
                              : "sorted ascending"}
                          </Box>
                        ) : null}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell
                      sortDirection={orderBy === "routeLocal" ? order : false}
                      className="whitespace-nowrap"
                    >
                      <TableSortLabel
                        active={false} //arrow for sorting
                        direction={orderBy === "routeLocal" ? order : "asc"}
                        onClick={createSortHandler("routeLocal")}
                      >
                        <span className="text-gray-600 font-bold">
                          Route (Local)
                        </span>
                        {orderBy === "routeLocal" ? (
                          <Box component="span" sx={visuallyHidden}>
                            {order === "desc"
                              ? "sorted descending"
                              : "sorted ascending"}
                          </Box>
                        ) : null}
                      </TableSortLabel>
                    </TableCell>

                    <TableCell
                      sortDirection={orderBy === "units" ? order : false}
                      className="whitespace-nowrap w-full"
                    >
                      <TableSortLabel
                        active={false} //arrow for sorting
                        direction={orderBy === "units" ? order : "asc"}
                        onClick={createSortHandler("units")}
                      >
                        <span className="text-gray-600 font-bold">Units</span>
                        {orderBy === "units" ? (
                          <Box component="span" sx={visuallyHidden}>
                            {order === "desc"
                              ? "sorted descending"
                              : "sorted ascending"}
                          </Box>
                        ) : null}
                      </TableSortLabel>
                    </TableCell>

                    <TableCell
                      sortDirection={orderBy === "active" ? order : false}
                      className="whitespace-nowrap"
                    >
                      <TableSortLabel
                        active={false} //arrow for sorting
                        direction={orderBy === "active" ? order : "asc"}
                        onClick={createSortHandler("active")}
                      >
                        <span className="text-gray-600 font-bold">Status</span>
                        {orderBy === "active" ? (
                          <Box component="span" sx={visuallyHidden}>
                            {order === "desc"
                              ? "sorted descending"
                              : "sorted ascending"}
                          </Box>
                        ) : null}
                      </TableSortLabel>
                    </TableCell>

                    <TableCell
                      sortDirection={orderBy === "createdBy" ? order : false}
                      className="whitespace-nowrap"
                    >
                      <TableSortLabel
                        active={false} //arrow for sorting
                        direction={orderBy === "createdBy" ? order : "asc"}
                        onClick={createSortHandler("createdBy")}
                      >
                        <span className="text-gray-600 font-bold">
                          Created By
                        </span>
                        {orderBy === "createdBy" ? (
                          <Box component="span" sx={visuallyHidden}>
                            {order === "desc"
                              ? "sorted descending"
                              : "sorted ascending"}
                          </Box>
                        ) : null}
                      </TableSortLabel>
                    </TableCell>

                    <TableCell
                      sortDirection={orderBy === "createdDate" ? order : false}
                      className="whitespace-nowrap"
                    >
                      <TableSortLabel
                        active={false} //arrow for sorting
                        direction={orderBy === "createdDate" ? order : "asc"}
                        onClick={createSortHandler("createdDate")}
                      >
                        <span className="text-gray-600 font-bold">
                          Created Date
                        </span>
                        {orderBy === "createdDate" ? (
                          <Box component="span" sx={visuallyHidden}>
                            {order === "desc"
                              ? "sorted descending"
                              : "sorted ascending"}
                          </Box>
                        ) : null}
                      </TableSortLabel>
                    </TableCell>

                    <TableCell
                      sortDirection={
                        orderBy === "lastModifiedBy" ? order : false
                      }
                      className="whitespace-nowrap"
                    >
                      <TableSortLabel
                        active={false} //arrow for sorting
                        direction={orderBy === "lastModifiedBy" ? order : "asc"}
                        onClick={createSortHandler("lastModifiedBy")}
                      >
                        <span className="text-gray-600 font-bold">
                          Last Modified By
                        </span>
                        {orderBy === "lastModifiedBy" ? (
                          <Box component="span" sx={visuallyHidden}>
                            {order === "desc"
                              ? "sorted descending"
                              : "sorted ascending"}
                          </Box>
                        ) : null}
                      </TableSortLabel>
                    </TableCell>

                    <TableCell
                      sortDirection={
                        orderBy === "lastModifiedDate" ? order : false
                      }
                      className="whitespace-nowrap"
                    >
                      <TableSortLabel
                        active={false} //arrow for sorting
                        direction={
                          orderBy === "lastModifiedDate" ? order : "asc"
                        }
                        onClick={createSortHandler("lastModifiedDate")}
                      >
                        <span className="text-gray-600 font-bold">
                          Last Modified Date
                        </span>
                        {orderBy === "lastModifiedDate" ? (
                          <Box component="span" sx={visuallyHidden}>
                            {order === "desc"
                              ? "sorted descending"
                              : "sorted ascending"}
                          </Box>
                        ) : null}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-600 font-bold whitespace-nowrap">
                        Actions
                      </span>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {spinner ? (
                    <div className="flex justify-center">
                      <LoadingSpinner />
                    </div>
                  ) : (
                    <>
                      {stableSort(dataResult, getComparator(order, orderBy))
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((psrroute, index) => {
                          console.log("psrroute is" + JSON.stringify(psrroute));
                          return (
                            <TableRow
                              sx={{
                                "& td": {
                                  paddingY: 1,
                                },
                              }}
                            >
                              <TableCell className="whitespace-nowrap">
                                {psrroute.srNo}
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                {psrroute.routeCode}
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                {psrroute.route}
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                {psrroute.routeLocal}
                              </TableCell>
                              <TableCell className="flex space-y-1 text-center justify-center w-full">
                                {psrroute.units.map((unit) => (
                                  <>
                                  <span className="flex gap-2 flex-wrap lg:break-word lg:whitespace-pre text-left border border-gray-600 rounded px-2  text-gray-600   ">
                                    {unit.name}
                                  </span>
                                </>
                                ))}
                              </TableCell>

                              <TableCell className="whitespace-nowrap">
                                {psrroute.activeStatus === true ? (
                                  <button className="border border-green-800 text-center rounded px-5 text-green-800">
                                    Active
                                  </button>
                                ) : (
                                  <button className="border border-red-500 text-center rounded px-3 text-red-500">
                                    Inactive
                                  </button>
                                )}
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                {psrroute.createdBy}
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                {psrroute.createdDate}
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                {psrroute.lastModifiedBy}
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                {psrroute.lastModifiedDate}
                              </TableCell>

                              {props.data.actions.length > 0 ? (
                                <TableCell className="px-4 py-1 flex whitespace-nowrap ">
                                  <div className="flex">
                                    {editAction ? (
                                      <a
                                        href="#"
                                        value="click"
                                        className="text-blue-500 mr-1"
                                      >
                                        {/* eidttext - toggle to button edit to save */}
                                        <DriveFileRenameOutlineIcon
                                          onClick={(e) => {
                                            props.setOpen(true);
                                            props.editRow(psrroute);
                                          }}
                                        />
                                      </a>
                                    ) : (
                                      ""
                                    )}

                                    {deleteAction ? (
                                      <a
                                        href="#"
                                        value="click"
                                        className="text-red-500 mr-3"
                                      >
                                        <DeleteOutlineOutlinedIcon
                                          onClick={() =>
                                            props.deleteRow(psrroute)
                                          }
                                        />
                                      </a>
                                    ) : (
                                      ""
                                    )}
                                    {confirmAction ? (
                                      <Tooltip title="Confirm Appointment">
                                        <a
                                          href="#"
                                          className="text-green-800 mr-3"
                                          onClick={() => props.deleteRow()}
                                        >
                                          {<CheckCircleIcon />}
                                        </a>
                                      </Tooltip>
                                    ) : (
                                      ""
                                    )}
                                    {confirmAction ? (
                                      <Tooltip title="Reschedule Appointment">
                                        <a
                                          href=""
                                          className="text-blue-500 mr-3"
                                          onClick={() => props.deleteRow()}
                                        >
                                          {<CalendarMonthIcon />}
                                        </a>
                                      </Tooltip>
                                    ) : (
                                      ""
                                    )}

                                    {cancelAction ? (
                                      <div className="flex items-center space-x-1">
                                        <Tooltip title="Cancel Appointment">
                                          <a
                                            href=""
                                            className="text-red-500 mr-3"
                                            onClick={() => props.deleteRow()}
                                          >
                                            <CancelIcon />
                                          </a>
                                        </Tooltip>
                                      </div>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                </TableCell>
                              ) : (
                                ""
                              )}
                            </TableRow>
                          );
                        })}
                    </>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      </div>
    </>
  );
}
