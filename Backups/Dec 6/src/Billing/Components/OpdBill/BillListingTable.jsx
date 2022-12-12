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
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Tooltip from "@mui/material/Tooltip";
import PrintIcon from '@mui/icons-material/Print';
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import LoadingSpinner from "../../../Common Components/loadingspinner/loadingSpinner";
import VisibilityIcon from '@mui/icons-material/Visibility';
import PaymentIcon from '@mui/icons-material/Payment';
import ArticleIcon from '@mui/icons-material/Article';
// import billImg from './billsm.png'

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

//disable button on click
const handleClick = (event) => {
  event.currentTarget.disabled = true;
};

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

//main function
export default function BillListingTable(props) {
  //state varibale for the table
  const {drawerOpen, showPaymentHistory, paymentBill, printView, visitId, tableApiFunc , dataResult , setDataResult, page, setPage, rowsPerPage, setRowsPerPage, count} = props

  const [spinner, showSpinner] = React.useState(false);
  const [oldCount, setOldCount] = React.useState();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState();
  //show and hide button
  const [visible, setVisible] = React.useState(false);
  const [disable, setDisable] = React.useState(false);
  // const [open, setOpen] = React.useState();

  //actions
  const [printAction, setPrintAction] = React.useState(false);
  const [viewAction, setViewAction] = React.useState(false);
  const [paymentAction, setPaymentAction] = React.useState(false);
  const [paymentHistoryAction, setPaymentHistoryAction] = React.useState(false);

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

  const defaultParams = visitId
  React.useEffect(() => {
    checkCallApi(page, rowsPerPage , oldCount);
  }, [page,rowsPerPage, oldCount]);

  const checkCallApi = (pageNo,rowsPerPageNo, oldTotal) => {
    
    pageNo = pageNo + 1
    let newTotal = pageNo * rowsPerPageNo
    
    let arr = [...dataResult]
    let totalDataLength = count
    let availableDataLength = arr.length
    if(totalDataLength>availableDataLength) // page has moved forward
    {
        console.log("page",pageNo)
        console.log("rowsPerPage",rowsPerPageNo)
        console.log("totalDataLength",totalDataLength)
        console.log("availableDataLength",availableDataLength)

        // if i dont have total record to show
        if(newTotal > availableDataLength){
          //
            let require = newTotal - availableDataLength
            let toShow = availableDataLength + require 

            // check available vs needed
            // needed is less than count
            let needed;
            if(toShow < totalDataLength){
                needed = newTotal - oldTotal
                callAgainTableApi(needed)
            }else if(toShow > totalDataLength){
                needed = toShow - totalDataLength
                callAgainTableApi(needed)
            }else{
                needed = rowsPerPageNo
                callAgainTableApi(needed)
            }
        }
    }
  }
  const callAgainTableApi = (recordsNeeded) => {
    console.log("defaultParams", defaultParams);
    
    showSpinner(true);
    tableApiFunc(defaultParams)
      .then((response) => response.data)
      .then((res) => {
        

        // 
        showSpinner(false);
        let incomingData = res.result
        let onlyNeededData = incomingData.slice(-Math.abs(recordsNeeded))

        // append needed data
        let existData = [...dataResult]
        for (let value of onlyNeededData){
            existData.push(value)
        }
        setDataResult(existData)
      })
      .catch(() => {
        showSpinner(false);
      })
  }

  //set rows object to table
  const allHeaders = Object.keys(props.data.result[0]);

  const headers = removeHeaders(allHeaders, ["id","billId","cashBalance"]);

  const handlePageChange = (event, newPage) => {
    setOldCount((page + 1) * rowsPerPage)
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    
    setOldCount((page + 1) * rowsPerPage)
    let newRows = parseInt(event.target.value, 10)
    let newTotal = (page+1) * newRows
    let additionalRecord = newTotal - count
    if(additionalRecord >= newRows){
      setPage(page - 1)
    }
    setRowsPerPage(parseInt(event.target.value, 10));
    // setPage(0);
  };

  React.useEffect(() => {
    console.log("actions",props.data.actions)
    props.data.actions && props.data.actions.forEach((action) => {
      if (action.toLowerCase() === "print") {
        setPrintAction(true);
      }
      if (action.toLowerCase() === "view") {
        setViewAction(true);
      }
      if (action === "PaymentHistory") {
        setPaymentHistoryAction(true);
      }
      if (action.toLowerCase() === "payment") {
        setPaymentAction(true);
      }
      

    });
  }, []);
  // console.log("actions array", props.result.actions);
  //table start
  return (
    <div className=" mx-auto w-full">
      <Box 
      sx={{width:'100%'}}
      // sx={drawerOpen ? 
        
      // { width: {sm:'28rem', md:'28rem',tab:'54rem',lg:'66rem', xl:'100%'}}
      // : { width: {sm:'40rem', md:'30rem',tab:'66rem',lg:'100%', xl:'100%'} }
      // }
      >
        <Paper sx={{ width: "100%", mb: 2 }}>
          
          <TableContainer sx={{ marginTop: "0.8rem" }} className=" ">
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
                    sx={{ fontWeight: "bold", color: "#515563" }}
                    className="text-gray-600 font-bold whitespace-nowrap"
                  >
                    Actions
                  </TableCell>
                  {/* heading of table */}
                  {headers.map((header, index) => (
                    <TableCell
                      sortDirection={orderBy === header ? order : false}
                      className="whitespace-nowrap"
                      key={index}
                    >
                      <TableSortLabel
                        active={false}
                        direction={orderBy === header ? order : "asc"}
                        onClick={createSortHandler(header)}
                      >
                        <span className="text-gray-600 font-bold">
                          {header}
                        </span>
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

              <TableBody>
                {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
                {spinner ? (
                  <div className=" flex mx-auto justify-center">
                    <LoadingSpinner />
                  </div>
                ) : <>
                {stableSort(
                  dataResult,
                  getComparator(order, orderBy)
                )
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) //splice use for show rows upto 5 when splice is not use that time show all rows
                  .map((row, index) => {
                    return (
                      <TableRow key={index}
                      sx={{
                        "& td": {
                          paddingY: 1,
                        },
                      }}
                      >
                        { props.data.actions && props.data.actions.length > 0 ? (
                          <TableCell className="px-4 py-1 flex whitespace-nowrap ">
                            <div className="flex">
                            {printAction ? (<>
                                <div className="flex items-center space-x-1">
                                  <Tooltip title="Print Bill">
                                    <a
                                      href="##"
                                      className="text-orange-500 mr-3 mb-2"
                                      onClick={() => printView(index,row)}
                                    >
                                      <PrintIcon color="orange" sx={{color:'orange'}}
                                  />
                                    </a>
                                  </Tooltip>
                                </div></>
                              ) : (
                                ""
                              )}

                              {viewAction ? (
                                <div className="flex items-center space-x-1">
                                  <Tooltip title="View Bill">
                                    <a
                                      href="##"
                                      className="text-blue-400 mr-3 mb-2"
                                      onClick={() => printView(index,row)}
                                    >
                                      <VisibilityIcon color="blue" sx={{color:'blue'}}/>
                                    </a>
                                  </Tooltip>
                                </div>) : (
                                ""
                              )}
                              {paymentAction ? (
                                <>
                                {
                                  row['Outstanding Amount'] > 0 ?
                                (<div className="flex items-center space-x-1">
                                  <Tooltip title="Pay Bill Amount">
                                    <a
                                      href="##"
                                      className="text-grey-400 mr-3 mb-2"
                                      onClick={() => paymentBill(index,row)}
                                    >
                                      <PaymentIcon color="grey" sx={{color:'grey'}}/>
                                    </a>
                                  </Tooltip>
                                </div>):''}
                                </>) : (
                                ""
                              )}
                              {paymentHistoryAction ? (
                                <>
                                {
                                  row['Paid Amount'] > 0 ?
                                (<div className="flex items-center space-x-1">
                                  <Tooltip title="Show Payment History">
                                    <a
                                      href="##"
                                      className="text-blue-400 mr-3 mb-2"
                                      onClick={() => showPaymentHistory(index,row)}
                                    >
                                      <ArticleIcon color="grey" sx={{color:'grey'}}/>
                                    </a>
                                  </Tooltip>
                                </div>):''}
                                </>) : (
                                ""
                              )}
                              {/* Paid Amount */}
                            </div>
                          </TableCell>
                        ) : (
                          ""
                        )}
                        {headers &&
                          headers.map((header, index) => (
                            <TableCell
                              className="whitespace-nowrap"
                              key={index}
                            >
                              {row[header]}
                            </TableCell>
                          ))}
                      </TableRow>
                    );
                  })}
                </>}
              </TableBody>
            </Table>
          </TableContainer>

          {/* //table end */}
          {/* pagination */}
          <TablePagination
            rowsPerPageOptions={[10, 15, 20]}
            component="div"
            count={count}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
    </div>
  );
}