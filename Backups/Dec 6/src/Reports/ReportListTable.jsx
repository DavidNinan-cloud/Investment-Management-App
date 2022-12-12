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
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import LoadingSpinner from "../Common Components/loadingspinner/loadingSpinner";
import useDidMountEffect from "../Common Components/Custom Hooks/useDidMountEffect";
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
  // console.log("button clicked");
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
export default function ReportListTable(props) {
  //state varibale for the table
  const { postApiUrl, tableApiFunc , searchParams , dataResult , setDataResult, page, setPage, rowsPerPage, setRowsPerPage, count} = props

  
  const [spinner, showSpinner] = React.useState(false);
  const [oldCount, setOldCount] = React.useState();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState();

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

  
  useDidMountEffect(() => {
    checkCallApi(page, rowsPerPage , oldCount);
  }, [page,rowsPerPage, oldCount]);

  const checkCallApi = (pageNo,rowsPerPageNo, oldTotal) => {
    
    pageNo = pageNo + 1
    let newTotal = pageNo * rowsPerPageNo
    console.log("oldTotal",oldTotal)
    console.log("newTotal",newTotal)
    
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
    console.log("defaultParams", searchParams);
    // searchParams
    let obj = searchParams
    obj.page = page
    obj.size = rowsPerPage
    showSpinner(true);
    console.log("obj param",obj)
    tableApiFunc(postApiUrl, searchParams)
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
  const allHeaders = Object.keys(props.tableData.result[0]);

  const headers = removeHeaders(allHeaders, ["id"]);

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

  //table start
  return (
    <div className=" mx-auto ">
      <Box sx={{ width: "100%" }}>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <TablePagination
            rowsPerPageOptions={[10, 15, 20]}
            component="div"
            count={count}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage={
              <>
                <span style={{ marginRight: "10px", color: "blue" }}>
                  <span>
                    <a href="#" onClick={props.DownloadTableData}>
                      Download Report
                    </a>
                  </span>
                  <span> | </span>
                  <span>
                    <a href="#" onClick={props.DownloadTableData}>
                      Print Report
                    </a>
                  </span>
                  {/* <span>
                    <label>
                      Import Data
                      <input
                        type="file"
                        style={{ display: "none" }}
                        name="file"
                        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        onChange={(e) => props.uploadExcelData(e)}
                      ></input>
                    </label>
                  </span> */}
                </span>
                <span>Rows Per Page:</span>
              </>
            }
          />
          <TableContainer sx={{ marginTop: "0.8rem" }} className="rounded ">
            <Table>
              <TableHead>
                <TableRow
                sx={{
                  "& th": {
                    paddingY: 1,
                  },
                }}
                >
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
          
        </Paper>
      </Box>
    </div>
  );
}