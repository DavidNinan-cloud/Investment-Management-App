import React from "react";
import {
  Box,
  Modal,
  Button,
  Typography,
  ListItem,
  ListItemText,
  Card,
  CardHeader,
  List,
} from "@mui/material";

import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ModalStyle } from "../../common/ModalStyle";
import InputField from "../../../../../Common Components/FormFields/InputField";
import CheckBoxField from "../../../../../Common Components/FormFields/CheckBoxField";
import DropdownField from "../../../../../Common Components/FormFields/DropdownField";
import SearchableDropdown from "../../../../../Common Components/FormFields/searchDropdown";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";

// import {
//   addNewCountry,
//   getCountryById,
// } from "../../services/area/CountryService";

const PathologyProfileModal = (props) => {
  const schema = yup.object().shape({
    countryCode: yup
      .string()
      .required("Add Country Code")
      .matches(/^[a-zA-Z\s]+$/, "Only alphabets are allowed"),
    countryName: yup
      .string()
      .required("Country Name Required")
      .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed"),
    isdCode: yup
      .string()
      .required("Country ISD Code required")
      .matches(/^[+1-9]+[0-9]*$/, "Only numbers are allowed"), //should start with '+' sign
    mobileLength: yup
      .string()
      .required("Enter Contact No. Length")
      .matches(/^[1-9]+[0-9]*$/, "Only numbers are allowed"),
  });

  //the object to reset the form to blank values
  const defaultValues = {
    // countryCode: "",
    // countryName: "",
    // id: "",
    // isdCode: "",
    // mobileLength: "",
    // status: true,
  };

  //destructuring the methods and giving them the same name , as they have in the useForm() hook
  const {
    control,
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm({
    // use mode to specify the event that triggers each input field
    mode: "onChange",
    resolver: yupResolver(schema),
    // defaultValues,
  });

  //     const onSubmitDataHandler = (data) => {
  //     console.log("onSubmitDataHandler function has been invoked");

  //     if (props.edit === true) {
  //       console.log(
  //         "Put request is going to be sent to the api and the data is "
  //       );
  //       console.log(data);

  //       updateData(data);
  //     } else if (props.edit === false) {
  //       console.log(
  //         "Post request is going to be sent to the api and the data is "
  //       );
  //       console.log(data);

  //       let obj = {
  //         active: true,
  //         countryCode: data.countryCode,
  //         countryName: data.countryName,
  //         isdCode: data.isdCode,
  //         mobileLength: data.mobileLength,
  //       };

  //       console.log(obj);

  //       postCountry(obj);

  //       props.setOpen(false);
  //     }

  //     //After the PUT / POST request's execution; change the flag to false for the next execution of onSubmitDataHandlers
  //     props.setEdit(false);

  //     //to set the form fields as blank
  //     reset(defaultValues);

  //     //for closing the modal form
  //     props.setOpen(false);
  //   };

  //useQuery hook for the functionality of edit icon click
  //   const { status } = useQuery(
  //     ["CountryInfo", props.idValue],

  //     //to avoid the automatic firing of the query. Because CountryModal is a child component of Country.js
  //     () => {
  //       if (props.idValue) {
  //         return getCountryById(props.idValue);
  //       }
  //     },

  //     {
  //       enabled: props.edit,

  //       staleTime: 0,

  //       cacheTime: 0,

  //       onSuccess: (data) => {
  //         console.log(
  //           "data fetched with no problem by using the react query library"
  //         );

  //         console.log(status);

  //         console.log(
  //           "Data fetched from API after clicking on the edit icon is " +
  //             JSON.stringify(data)
  //         );

  //         let resetObj = {
  //           countryCode: data.data.result.countryCode,
  //           countryName: data.data.result.countryName,
  //           id: data.data.result.id,
  //           isdCode: data.data.result.isdCode,
  //           mobileLength: data.data.result.mobileLength,
  //           status: data.data.result.status,
  //         };

  //         //if data is received ; then only execute the reset function to patch the value
  //         if (data) {
  //           reset(resetObj);
  //         }
  //       },

  //       onError: (error) => {
  //         console.log(error);
  //         //Code for React Toast
  //       },
  //     }
  //   );

  //useMutation hook for the implementation of post request data saving
  //   const { mutate: postCountry } = useMutation(addNewCountry, {
  //     onSuccess: (res) => {
  //       const result = {
  //         status: res.status + "-" + res.statusText,
  //         headers: res.headers,
  //         data: res.data,
  //       };
  //       console.log(result);
  //       if (result.status === "200-OK") {
  //         // Swal.fire(
  //         //   "Operation Successfull!",
  //         //   "Record has been Created!",
  //         //   "success"
  //         // );
  //         console.log("Record has been created");
  //       }
  //     },
  //     onError: (error) => {
  //       console.log(error);
  //       //Code for React toast
  //     },
  //   });

  //axios request for data updation. That is PUT request
  //   function updateData(requiredData) {
  //     const url = `http://192.168.0.112:8095/masters/countries`;

  //     axios
  //       .put(url, requiredData)
  //       .then((response) => {
  //         console.log(response);
  //         if (response.status === 200) {
  //           // Swal.fire(
  //           //   "Data Updation Done",
  //           //   "Data has been updated successfully",
  //           //   "success"
  //           // ).then(() => {
  //           //   //to update the ui after successfull data updation. Reload the Country.js component after clicking on the ok button
  //           // });
  //           console("Record has been updated successfully");
  //         }
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //         //Code for React Toast
  //       });
  //   }

  function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
  }

  function intersection(a, b) {
    return a.filter((value) => b.indexOf(value) !== -1);
  }

  function union(a, b) {
    return [...a, ...not(b, a)];
  }
  const [checked, setChecked] = React.useState([]);
  const [left, setLeft] = React.useState([0, 1, 2, 3]);
  const [right, setRight] = React.useState([]);
  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value) => () => {
    console.log("value", value);
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };
  const numberOfChecked = (items) => intersection(checked, items).length;
  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const customList = (title, items) => (
    <Card>
      <CardHeader sx={{ px: 2, py: 1 }} />

      <List
        sx={{
          width: 230,
          height: 180,
          bgcolor: "background.paper",
          overflow: "auto",
        }}
        dense
        component="div"
        role="list"
      >
        {items.map((value) => {
          const labelId = `transfer-list-all-item-${value}-label`;

          return (
            <ListItem
              key={value}
              role="listitem"
              button
              onClick={handleToggle(value)}
            >
              {/* <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    'aria-labelledby': labelId,
                  }}
                />
              </ListItemIcon> */}
              <ListItemText
                id={labelId}
                primary={`List item ${value + 1}`}
                className={`${
                  checked.indexOf(value) !== -1 && "text-blue-500"
                }`}
              />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Card>
  );

  return (
    <div className="w-[100%] grid justify-center items-center rounded lg:px-0 mt-4">
      <Modal
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={ModalStyle}>
          <div className="grid grid-cols-1 md:grid-cols-1  w-full">
            <CancelPresentationIcon
              className="absolute top-3 right-9 text-red-600  rounded cursor-pointer"
              onClick={() => {
                props.handleClose();
              }}
            />
          </div>

          <div className="row">
            <fieldset className="border border-gray-300 text-left w-full  lg:mx-auto lg:px-4 md:mr-0 py-8 rounded mt-8 lg:m-2 ">
              <legend className="px-2 font-bold text-gray-700">
                Add New Lab Pathology Profile
              </legend>

              <form
                // onSubmit={handleSubmit(onSubmitDataHandler)}
                className="grid grid-cols-1 md:grid-cols-1 w-full  gap-2"
              >
                <div className="py-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 px-2 gap-2">
                  <div className="lg:col-span-2 md:col-span-1">
                    <InputField
                      name="profileCode"
                      variant="outlined"
                      label="Profile Code"
                      error={errors.profileCode}
                      control={control}
                    />
                  </div>

                  <div className="lg:col-span-2 md:col-span-1">
                    <InputField
                      name="profileName"
                      variant="outlined"
                      label="Profile Name"
                      error={errors.profileName}
                      control={control}
                    />
                  </div>

                  <div className="lg:col-span-2 md:col-span-1">
                    <InputField
                      name="service"
                      variant="outlined"
                      label="Service"
                      error={errors.service}
                      control={control}
                    />
                  </div>

                  {/* <div className="col-span-2">
                 
                    <CheckBoxField
                      control={control}
                      name="hasAuthentication"
                      label="Has Authentication"
                      placeholder="Has Authentication"
                    />
                  </div> */}

                  {/* Active Checkbox */}
                  <div className="lg:col-span-2 md:col-span-1">
                    {/* Checkbox component */}

                    <CheckBoxField
                      control={control}
                      name="status"
                      label="Active"
                      placeholder="Status"
                    />
                  </div>

                  <div className="lg:col-span-4 md:col-span-2 border mb-4" />
                  <div className="lg:col-span-4 md:col-span-2">
                    <SearchableDropdown
                      control={control}
                      //   error={errors.pinCode}
                      searchIcon={true}
                      name="searchTest"
                      label="Search Test"
                      //   dataArray={pincodeOptions}
                      isSearchable={true}
                      placeholder="Search Test"
                      isClearable={false}
                      // handleInputChange={handleChange}
                      inputRef={{
                        ...register("searchTest", {}),
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-5 gap-2 lg:col-span-4 md:col-span-2">
                    <div className="col-span-2 border">
                      {customList("Choices", left)}
                    </div>
                    <div className="col-span-1 flex flex-col justify-center">
                      <div className="my-1 mx-auto ">
                        <Button
                          //sx={{ my: 0.5, mx: 4 }}
                          variant="outlined"
                          size="small"
                          onClick={handleCheckedRight}
                          disabled={leftChecked.length === 0}
                          aria-label="move selected right"
                        >
                          &gt;
                        </Button>
                      </div>
                      <div className="my-1 mx-auto ">
                        <Button
                          //sx={{ my: 0.5, mx: 4 }}
                          variant="outlined"
                          size="small"
                          onClick={handleCheckedLeft}
                          disabled={rightChecked.length === 0}
                          aria-label="move selected left"
                        >
                          &lt;
                        </Button>
                      </div>
                    </div>
                    <div className="col-span-2 border">
                      {customList("Chosen", right)}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 justify-end">
                  {/* conditional rendering of the Reset , Add , Cancel , Update buttons */}
                  {props.edit ? (
                    <Button
                      href="#"
                      type="button"
                      size="small"
                      style={{
                        maxWidth: "100px",
                        maxHeight: "35px",
                        minWidth: "90px",
                        minHeight: "35px",
                        fontWeight: "bold",
                        textTransform: "none",
                      }}
                      onClick={() => {
                        reset(defaultValues);
                        props.handleClose();
                      }}
                    >
                      Cancel
                    </Button>
                  ) : (
                    <Button
                      href="#"
                      type="button"
                      size="small"
                      style={{
                        maxWidth: "100px",
                        maxHeight: "35px",
                        minWidth: "90px",
                        minHeight: "35px",
                        fontWeight: "bold",
                        textTransform: "none",
                      }}
                      onClick={() => reset(defaultValues)} //ReSet
                    >
                      Reset
                    </Button>
                  )}

                  {props.edit ? (
                    <Button
                      type="button"
                      variant="outlined"
                      size="small"
                      //onClick={handleSubmit(onSubmitDataHandler)}
                      style={{
                        maxWidth: "100px",
                        maxHeight: "35px",
                        minWidth: "120px",
                        minHeight: "35px",
                        fontWeight: "bold",
                        textTransform: "none",
                      }}
                    >
                      Update
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      variant="outlined"
                      size="small"
                      style={{
                        maxWidth: "100px",
                        maxHeight: "35px",
                        minWidth: "120px",
                        minHeight: "35px",
                        fontWeight: "bold",
                        textTransform: "none",
                      }}
                    >
                      Add
                    </Button>
                  )}
                </div>
              </form>
            </fieldset>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default PathologyProfileModal;
