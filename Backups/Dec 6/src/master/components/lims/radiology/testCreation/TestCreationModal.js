import React, { useEffect, useState } from "react";
import { Box, Modal, Button, FormControl, FormHelperText } from "@mui/material";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ModalStyle } from "../../../../../LIMS/Common/ModalStyle";
import InputField from "../../../../../Common Components/FormFields/InputField";
import CheckBoxField from "../../../../../Common Components/FormFields/CheckBoxField";
import DropdownField from "../../../../../Common Components/FormFields/DropdownField";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import RadioField from "../../../../../Common Components/FormFields/RadioField";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";
import {
  getMachineNameDropdown,
  getCategoryDropdown,
  getAuthorizationDropdown,
  autoSearchServices,
  autoSearchParameters,
  autoSearchTemplates,
  addNewTest,
  updateTest,
  getTestById,
  getModalityDropdown,
} from "../../../../services/lims/radiology/TestCreationServices";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import AddButton from "../../../../../Common Components/Buttons/AddButton";
import SearchDropdown from "../../../../../Common Components/FormFields/searchDropdown";
import { SaveButton } from "../../../../../Common Components/Buttons/CommonButtons";
import ConfirmationModal from "../../../../../Common Components/ConfirmationModal";
import {
  errorAlert,
  successAlert,
  updateAlert,
} from "../../../../../Common Components/Toasts/Toasts";
import { UpdateButton } from "../../../../../Common Components/Buttons/CommonButtons";
import CommonBackDrop from "../../../../../Common Components/CommonBackDrop/CommonBackDrop";
import LoadingSpinner from "../../../../../Common Components/loadingspinner/loadingSpinner";
import TemplateTable from "./TemplateTable";
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const TestDetailsModal = (props) => {
  const [data, setData] = useState({ result: [], actions: [] });
  const [dataResult, setDataResult] = useState([]);
  const [count, setCount] = useState();
  const [selected, setSelected] = React.useState([]);
  const [selectedObj, setSelectedObj] = React.useState();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [spinner, showSpinner] = useState(false);
  const [recordWarning, showRecordWarning] = useState(false);
  const [finalData, setFinalData] = React.useState({});
  const [toggleValidation, setToggleValidation] = React.useState(false);
  const [openPut, setOpenPut] = React.useState(false);
  const [openPost, setOpenPost] = React.useState(false);
  const [parameterData, setParameterData] = useState([]);
  const [detailsData, setDetailsData] = useState({});
  const [templateData, setTemplateData] = useState([]);
  const [machineOptions, setMachineOptions] = React.useState([]);
  const [parameterOptions, setParameterOptions] = React.useState([]);
  const [templateOptions, setTemplateOptions] = React.useState([]);
  const [parametersOptions, setParametersOptions] = React.useState([]);
  const [authorizationOptions, setAuthorizationOptions] = React.useState([]);
  const [categoryOptions, setCategoryOptions] = React.useState([]);
  const [modalityOptions, setModalityOptions] = React.useState([]);
  const [serviceOptions, setServiceOptions] = React.useState([]);
  const [tabValue, setTabValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const schema = yup.object().shape({
    testCode: yup.string().required("Test Code Required"),
    testDescription: yup.string().required("Country Name Required"),
    category: yup
      .object()
      .nullable()
      .shape({
        value: yup.string().required("Required"),
        label: yup.string().required("Required"),
      })
      .required("Category Required"),
  });

  //destructuring the methods and giving them the same name , as they have in the useForm() hook
  const {
    control,
    handleSubmit,
    reset,
    watch,
    register,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      id: "",
      testCode: "",
      testDescription: "",
      category: "",
      modality: "",
      active: true,
      reportTemplate: false,
    },
  });

  const schemaDetails = yup.object().shape({
    suggestion: yup.string().required("Suggestion Required"),
    footNote: yup.string().required("FootNote Name Required"),
    timeCompletion: yup.string().required("Time Completion Required"),
    machine: yup
      .object()
      .nullable()
      .shape({
        value: yup.string().required("Required"),
        label: yup.string().required("Required"),
        id: yup.number().required("Required"),
      })
      .required("Machine Required"),
    authorizationLevel: yup
      .object()
      .nullable()
      .shape({
        value: yup.string().required("Required"),
        label: yup.string().required("Required"),
        id: yup.number().required("Required"),
      })
      .required("Authorization Required"),
    techniqueUsed: yup.string().required(" echnique Used Required"),
  });

  const {
    control: controlDetails,
    handleSubmit: handleSubmitDetails,
    reset: resetDetails,
    register: registerDetails,
    watch: watchDetails,
    formState: { errors: errorsDetails },
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schemaDetails),
    defaultValues: {
      suggestion: "",
      footNote: "",
      machine: "",
      timeCompletion: "",
      cultureSensitivityTest: false,
      hasAuthentication: false,
      authorizationLevel: "",
      isConsent: false,
      isuniqueSampleNoRequired: false,
      isHistopathTest: false,
      techniqueUsed: "",
    },
  });

  let watchAuthorization = watchDetails("hasAuthentication");

  const schemaParameters = toggleValidation
    ? yup.object().shape({
        subTestName: yup.string().required("Sub Test Name Required"),
        parameters: yup
          .array()
          .of(
            yup.object().shape({
              parameterName: yup
                .object()
                .nullable()
                .shape({
                  value: yup.number().required("Required"),
                  parameter: yup.string().required("Required"),
                  label: yup.string().required("Required"),
                })
                .required("Parameters Required"),
            })
          )
          .required("Parameters Required"),
      })
    : yup.object().shape({
        parameterName: yup
          .object()
          .nullable()
          .shape({
            value: yup.number().required("Required"),
            parameter: yup.string().required("Required"),
            label: yup.string().required("Required"),
          })
          .required("Parameters Required"),
      });

  const {
    control: controlParameters,
    handleSubmit: handleSubmitParameters,
    reset: resetParameters,
    register: registerParameters,
    watch: watchParameters,
    setValue: setValueParameters,

    formState: { errors: errorsParameters },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schemaParameters),
    defaultValues: {
      hasSubTest: false,
      parameterName: "",
      subTestName: "",
      parameters: [
        {
          parameterName: "",
        },
      ],
    },
  });

  const { fields, append, prepend, remove } = useFieldArray({
    control: controlParameters,
    name: "parameters",
  });

  let parameterNameArr = [];

  fields.map((item, index) => {
    parameterNameArr[index] = watchParameters(
      `parameters[${index}].parameterName`
    );
  });

  useEffect(() => {
    if (parameterNameArr) {
      console.log("parameterNameArr", parameterNameArr);
    }
  }, [parameterNameArr]);

  const schemaTemplate = yup.object().shape({
    selectTemplate: yup
      .object()
      .nullable()
      .shape({
        template: yup.string().required("Required"),
        label: yup.string().required("Required"),
        id: yup.number().required("Required"),
      })
      .required("Template Required"),
  });

  const {
    control: controlTemplate,
    handleSubmit: handleSubmitTemplate,
    reset: resetTemplate,
    register: registerTemplate,
    watch: watchTemplate,
    setValue: setValueTemplate,

    formState: { errors: errorsTemplate },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schemaTemplate),
    defaultValues: {
      selectTemplate: "",
    },
  });

  let watchSubTest;
  watchSubTest = watchParameters("hasSubTest");

  useEffect(() => {
    if (watchSubTest) {
      console.log("watchSubTest", watchSubTest);
      setToggleValidation(true);
      // setParameterData([]);
    } else {
      setToggleValidation(false);
      //setParameterData([]);
    }
  }, [watchSubTest]);

  const handleClosePost = () => {
    if (openPost) {
      setOpenPost(false);
    }
  };

  const handleClosePut = () => {
    if (openPut) {
      setOpenPut(false);
    }
  };

  useEffect(() => {
    //getMachineName();
    getCategory();
    getModality();
    // getAuthorization();
  }, []);

  //   const getMachineName = () => {
  //     getMachineNameDropdown()
  //       .then((response) => {
  //         console.log("The list of all the unit are as follows" + response);
  //         console.log(JSON.stringify(response));
  //         console.log(response.data.result);
  //         setMachineOptions(response.data.result);
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   };

  const getCategory = () => {
    getCategoryDropdown()
      .then((response) => {
        console.log("The list of all the unit are as follows" + response);
        console.log(JSON.stringify(response));
        console.log(response.data.result);
        setCategoryOptions(response.data.result);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getModality = () => {
    getModalityDropdown()
      .then((response) => {
        console.log("The list of all the unit are as follows" + response);
        console.log(JSON.stringify(response));
        console.log(response.data.result);
        setModalityOptions(response.data.result);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //   const getAuthorization = () => {
  //     getAuthorizationDropdown()
  //       .then((response) => {
  //         console.log("The list of all the unit are as follows" + response);
  //         console.log(JSON.stringify(response));
  //         console.log(response.data.result);
  //         setAuthorizationOptions(response.data.result);
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   };

  const onSubmitFormData = (data) => {
    console.log("data", data);
    console.log("detailsData", detailsData);
    console.log("parameterData", parameterData);
    console.log("templateData", templateData);

    if (props.edit === true) {
      let updateObj = {
        id: data.id,
        active: data.active,
        category: {
          id: data.category.id,
        },
        isReportTemplate: data.reportTemplate,
        printReportName: data.printReportName,
        service: data.service
          ? {
              id: data.service.id,
            }
          : null,
        testCode: data.testCode,
        testDescription: data.testDescription,
        testDetails: {
          cultureSensitivityTest: detailsData.cultureSensitivityTest,
          footNote: detailsData.footNote,
          hasAuthentication: detailsData.hasAuthentication,
          authorizationLevel: detailsData?.authorizationLevel?.id,
          isConsent: detailsData.isConsent,
          isHistopathTest: detailsData.isHistopathTest,
          isUniqueSampleNoRequired: detailsData.isUniqueSampleNoRequired,
          machine: {
            id: detailsData?.machine?.id,
          },
          suggestion: detailsData.suggestion,
          techniqueUsed: detailsData.techniqueUsed,
          timeCompletion: Number(detailsData.timeCompletion),
        },
        testItemDetails: null,
        testParametersList: parameterData ? parameterData : null,
        testTemplateMappingList: templateData ? templateData : null,
      };
      console.log("updateObj", updateObj);
      setOpenPut(true);
      setFinalData(updateObj);
    } else if (props.edit === false) {
      let submitObj = {
        active: data.active,
        category: {
          id: data.category.id,
        },
        isReportTemplate: data.reportTemplate,
        printReportName: data.printReportName,
        service: data.service
          ? {
              id: data.service.id,
            }
          : null,
        testCode: data.testCode,
        testDescription: data.testDescription,
        testDetails: {
          cultureSensitivityTest: detailsData.cultureSensitivityTest,
          footNote: detailsData.footNote,
          hasAuthentication: detailsData.hasAuthentication,
          isConsent: detailsData.isConsent,
          authorizationLevel: detailsData?.authorizationLevel?.id,
          isHistopathTest: detailsData.isHistopathTest,
          isUniqueSampleNoRequired: detailsData.isUniqueSampleNoRequired,
          machine: {
            id: detailsData?.machine?.id,
          },
          suggestion: detailsData.suggestion,
          techniqueUsed: detailsData.techniqueUsed,
          timeCompletion: Number(detailsData.timeCompletion),
        },
        testItemDetails: null,
        testParametersList: parameterData.length > 0 ? parameterData : null,
        testTemplateMappingList: templateData.length > 0 ? templateData : null,
      };
      console.log("submitObj", submitObj);
      setOpenPost(true);
      setFinalData(submitObj);
    }
  };

  const onSubmitTemplate = (data) => {
    console.log("data", data);
    let myobj = {
      templateCode: data.selectTemplate.label.split("|")[0].trim(),
      templateName: data.selectTemplate.label,
      template: {
        id: data.selectTemplate.id,
      },
    };

    templateData.push(myobj);
    // setTemplateData([
    //   ...templateData,
    //   {
    //     ...data.selectTemplate,
    //   },
    // ]);
    resetTemplate();
  };

  const onSubmitParameters = (data) => {
    console.log("data", data);
    if (data.parameters[0].parameterName !== "") {
      console.log("parameters");
      console.log(data.parameters[0].parameterName.label);
      console.log("data.parameters", data.parameters);

      let obj;

      data.parameters.map((item) => {
        obj = {
          subtestName: data.subTestName,
          parameterName: item.parameterName.label,
          parameterCode: item.parameterName.label.split("|")[0].trim(),
          hasSubtest: true,
          parameter: {
            id: item.parameterName.id,
          },
        };
        // setParameterData([...parameterData, { ...obj }]);
        //  arr.push(obj);
        parameterData.push(obj);
      });

      resetParameters();

      setValueParameters("hasSubTest", true);
      console.log("parameterData", parameterData);
    } else if (data.parameters[0].parameterName === "") {
      console.log("not parameters");
      console.log("data", data);

      let myobj = {
        subtestName: null,
        parameterName: data.parameterName.label,
        parameterCode: data.parameterName.label.split("|")[0].trim(),
        hasSubtest: false,
        parameter: {
          id: data.parameterName.id,
        },
      };
      setParameterData([
        ...parameterData,
        {
          ...myobj,
        },
      ]);
      console.log("parameterData", parameterData);
      resetParameters();
      setValueParameters("hasSubTest", false);
    }
  };

  const handleInputChange = (e) => {
    let search = e;
    if (search.length > 0) {
      console.log("search", search);
      autoSearchServices(search)
        .then((response) => {
          console.log("Service details", response.data.result);
          setServiceOptions(response.data.result);
        })
        .catch((response) => {
          console.log(response);
        });
    }
  };

  //   const handleInputChangeParameters = (e) => {
  //     let search = e;
  //     if (search.length > 0) {
  //       console.log("search", search);
  //       autoSearchParameters(search)
  //         .then((response) => {
  //           console.log("Parameter details", response.data.result);
  //           setParametersOptions(response.data.result);
  //         })
  //         .catch((response) => {
  //           console.log(response);
  //         });
  //     }
  //   };

  //   const handleInputChangeParameter = (e) => {
  //     let search = e;
  //     if (search.length > 0) {
  //       console.log("search", search);
  //       autoSearchParameters(search)
  //         .then((response) => {
  //           console.log("Parameter details", response.data.result);
  //           setParameterOptions(response.data.result);
  //         })
  //         .catch((response) => {
  //           console.log(response);
  //         });
  //     }
  //   };

  //   const handleInputChangeTemplate = (e) => {
  //     let search = e;
  //     if (search.length > 0) {
  //       console.log("search", search);
  //       autoSearchTemplates(search)
  //         .then((response) => {
  //           console.log("Template details", response.data.result);
  //           setTemplateOptions(response.data.result);
  //         })
  //         .catch((response) => {
  //           console.log(response);
  //         });
  //     }
  //   };

  const onSubmitDetailsData = (data) => {
    console.log("data", data);
    setDetailsData({ ...data });
  };

  const handleParametersEdit = () => {};

  const handleParameterDelete = (obj, itemIndex) => {
    setParameterData((parameter) =>
      parameter.filter((item, index) => index !== itemIndex)
    );
  };

  const handleTemplateDelete = (obj, itemIndex) => {
    setTemplateData((template) =>
      template.filter((item, index) => index !== itemIndex)
    );
  };

  const handleTemplateEdit = (obj, itemIndex) => {
    // Template: yup.string().required("Required"),
    //   label: yup.string().required("Required"),
    let myobj = {
      template: obj.templateName,
      label: obj.templateName,
    };
    console.log("obj", obj);
    setValueTemplate("selectTemplate", {
      // Template: "Template Eighteen",
      // label: "18 | Template Eighteen",
      ...myobj,
    });
  };

  function addRecord() {
    console.log("A new record has been added");

    setOpenPost(false);
    props.setOpenBackdrop(true);
    // postTest(finalData);
  }

  //   const { mutate: postTest } = useMutation(addNewTest, {
  //     onSuccess: (res) => {
  //       const result = {
  //         status: res.status + "-" + res.statusText,
  //         headers: res.headers,
  //         data: res.data,
  //       };
  //       console.log(result);

  //       props.setOpenBackdrop(false);
  //       successAlert();
  //       props.populateTable({ page: 0, size: 10, searchString: "" });
  //       console.log("Record has been created");

  //       props.setEdit(false);

  //       props.setOpen(false);
  //     },
  //     onError: (error) => {
  //       console.log(error);
  //       props.setOpenBackdrop(false);
  //       errorAlert();
  //       handleClosePost();
  //     },
  //   });

  //   function updateRecord() {
  //     console.log("Your data has been updated");
  //     handleClosePut();
  //     props.setOpenBackdrop(true);
  //     updateTest(finalData)
  //       .then((response) => {
  //         console.log(response);
  //         if (response.data.statusCode === 200) {
  //           updateAlert();
  //           console.log("Record has been updated successfully");
  //           props.populateTable();
  //           props.setOpenBackdrop(false);
  //           props.setEdit(false);
  //           reset();

  //           props.setOpen(false);
  //           props.setOpenBackdrop(false);
  //         }
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //         props.setOpenBackdrop(false);
  //         errorAlert();
  //       });
  //   }

  //useQuery hook for the functionality of edit icon click
  //   const { status } = useQuery(
  //     ["TestInfo", props.idValue],

  //     //to avoid the automatic firing of the query. Because CountryModal is a child component of Country.js
  //     () => {
  //       if (props.idValue && openPut !== true) {
  //         return getTestById(props.idValue);
  //       }
  //     },

  //     {
  //       enabled: props.edit,
  //       staleTime: 0,
  //       cacheTime: 0,
  //       refetchOnWindowFocus: false,
  //       onSuccess: (data) => {
  //         console.log(
  //           "data fetched with no problem by using the react query library"
  //         );

  //         console.log(status);

  //         console.log(
  //           "Data fetched from API after clicking on the edit icon is " +
  //             JSON.stringify(data)
  //         );

  //         console.log("data.data.result", data.data.result);
  //         let obj = JSON.parse(data.data.result);
  //         console.log("obj", obj);
  //         const {
  //           id,
  //           is_report_template,
  //           printreportname,
  //           active,
  //           testcode,
  //           testdescription,
  //           category,
  //           service,
  //           parameterdetails,
  //           templatedetails,
  //         } = obj;
  //         let resetObj = {
  //           id: id,
  //           testCode: testcode,
  //           testDescription: testdescription,
  //           printReportName: printreportname,
  //           reportTemplate: is_report_template,
  //           category: category,
  //           active: active,
  //           service: service,
  //         };

  //         let arr = [];
  //         parameterdetails.map((item) => {
  //           let obj = {
  //             subtestName: item?.subtestname,
  //             parameterName: item?.parametername,
  //             parameterCode: item?.parametername.split("|")[0].trim(),
  //             hasSubtest: item?.hassubtest,
  //           };
  //           arr.push(obj);
  //         });

  //         let tempArr = [];
  //         templatedetails.map((item) => {
  //           let myobj = {
  //             templateCode: item.template_code,
  //             templateName: item.template_name,
  //           };
  //           tempArr.push(myobj);
  //         });

  //         //if data is received ; then only execute the reset function to patch the value
  //         if (data) {
  //           reset(resetObj);
  //           resetDetails(obj.testdetails);
  //           setParameterData([...arr]);
  //           setTemplateData([...tempArr]);
  //         }
  //       },

  //       onError: (error) => {
  //         console.log(error);
  //         //Code for React Toast
  //       },
  //     }
  //   );

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
                props.setEdit(false);
                reset();
                resetDetails();
                resetParameters();
                resetTemplate();
              }}
            />
          </div>

          <div className="row">
            <form onSubmit={handleSubmit(onSubmitFormData)}>
              <fieldset className="border border-gray-300 text-left w-full  lg:mx-auto lg:px-4 ml-8 md:mr-0 py-8 rounded mt-8 lg:m-2 ">
                <legend className="px-2 font-bold text-gray-700">
                  Add New Tests
                </legend>

                <div className="grid grid-cols-1 md:grid-cols-1 w-full  gap-2">
                  <div className="py-2 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-4 gap-2">
                    <div className=" w-full">
                      <InputField
                        name="testCode"
                        variant="outlined"
                        label="Test Code"
                        error={errors.testCode}
                        control={control}
                      />
                    </div>

                    <div className="w-full">
                      <InputField
                        name="testDescription"
                        variant="outlined"
                        label="Test Description"
                        error={errors.testDescription}
                        control={control}
                      />
                    </div>

                    <div className="w-full">
                      <DropdownField
                        control={control}
                        error={errors.category}
                        name="category"
                        label="Category"
                        dataArray={categoryOptions}
                        isSearchable={false}
                        placeholder="Category"
                        isClearable={false}
                      />
                    </div>

                    <div className="w-full">
                      <DropdownField
                        control={control}
                        error={errors.modality}
                        name="modality"
                        label="Modality"
                        dataArray={modalityOptions}
                        isSearchable={false}
                        placeholder="Modality"
                        isClearable={false}
                      />
                    </div>

                    <div className="col-span-2">
                      <SearchDropdown
                        control={control}
                        name="service"
                        label="Service"
                        searchIcon={true}
                        dataArray={serviceOptions}
                        placeholder="Service"
                        isSearchable={true}
                        isClearable={true}
                        handleInputChange={handleInputChange}
                      />
                    </div>

                    <div className="">
                      <CheckBoxField
                        control={control}
                        name="active"
                        label="Active"
                        placeholder="Status"
                      />
                    </div>
                  </div>

                  <div className="">
                    <Box
                      sx={{
                        width: "100%",
                        border: "1px solid lightgrey",
                        borderRadius: "3px",
                      }}
                    >
                      <Box
                        sx={{
                          margin: 1,
                          backgroundColor: "lightgrey",
                          borderRadius: "3px",
                        }}
                      >
                        <Tabs
                          value={tabValue}
                          onChange={handleChange}
                          aria-label="basic tabs example"
                        >
                          <Tab
                            label="Report Template Selection"
                            {...a11yProps(0)}
                          />
                          <Tab label="Test Item Details" {...a11yProps(1)} />
                        </Tabs>
                      </Box>
                      <TabPanel value={tabValue} index={0}>
                        <form all={handleSubmitDetails(onSubmitDetailsData)}>
                          <div className="grid grid-cols-2 gap-2">
                            {data.hasOwnProperty("result") &&
                            data.result.length > 0 &&
                            data.statusCode === 200 &&
                            spinner === false ? (
                              <TemplateTable
                                //data to be displayed
                                dataResult={dataResult}
                                //tableApiFunc={fetchAllMachineParameters}
                                setDataResult={setDataResult}
                                data={data}
                                page={page}
                                setPage={setPage}
                                rowsPerPage={rowsPerPage}
                                setRowsPerPage={setRowsPerPage}
                                count={count}
                                selected={selected}
                                setSelected={setSelected}
                                selectedObj={selectedObj}
                                setSelectedObj={setSelectedObj}
                              />
                            ) : (
                              ""
                            )}
                            {spinner ? (
                              <div className="grid justify-center">
                                <LoadingSpinner />
                              </div>
                            ) : null}
                          </div>
                        </form>
                      </TabPanel>

                      <TabPanel value={tabValue} index={1}>
                        <form>
                          <div className="flex flex-col p-2 gap-2">
                            <div className="flex items-center space-x-2">
                              <div className="w-1/2">
                                {/* <DropdownField
                                control={controlTemplate}
                                error={errorsTemplate.selectTemplate}
                                name="selectTemplate"
                                label="Select Template"
                                dataArray={templateOptions}
                                isSearchable={false}
                                placeholder="Select Template"
                                isClearable={false}
                              /> */}
                                <FormControl
                                  fullWidth
                                  error={Boolean(
                                    errorsTemplate?.selectTemplate
                                  )}
                                >
                                  <SearchDropdown
                                    control={controlTemplate}
                                    name="selectTemplate"
                                    label="Select Template"
                                    searchIcon={true}
                                    dataArray={templateOptions}
                                    placeholder="Select Template"
                                    isSearchable={true}
                                    isClearable={true}
                                    //   handleInputChange={handleInputChangeTemplate}
                                  />
                                  <FormHelperText>
                                    {errorsTemplate?.selectTemplate?.message}
                                  </FormHelperText>
                                </FormControl>
                              </div>
                              <div className="w-1/6">
                                <InputField
                                  name="quantity"
                                  variant="outlined"
                                  label="Quantity"
                                  error={errors.quantity}
                                  control={control}
                                />
                              </div>

                              <button
                                type="button"
                                onClick={handleSubmitTemplate(onSubmitTemplate)}
                                className="h-10 px-3 text-base font-medium  bg-customGreen text-white rounded mb-1"
                              >
                                Add
                              </button>
                            </div>

                            {/* {templateData && templateData.length > 0 && (
                              <TemplateTable
                                rows={templateData}
                                handleTemplateEdit={handleTemplateEdit}
                                handleTemplateDelete={handleTemplateDelete}
                              />
                            )} */}
                          </div>
                        </form>
                      </TabPanel>
                    </Box>
                  </div>
                </div>
                <CommonBackDrop openBackdrop={props.openBackdrop} />
              </fieldset>
              <div className="flex justify-end">
                {props.edit ? <UpdateButton /> : <SaveButton />}
              </div>
            </form>
          </div>
        </Box>
      </Modal>
      <ConfirmationModal
        confirmationOpen={openPost}
        confirmationHandleClose={handleClosePost}
        confirmationSubmitFunc={addRecord}
        confirmationLabel="Confirmation"
        confirmationMsg="Are you sure want to add this record ?"
        confirmationButtonMsg="Add"
      />
      <ConfirmationModal //setEdit(false);
        confirmationOpen={openPut}
        confirmationHandleClose={handleClosePut}
        // confirmationSubmitFunc={updateRecord}
        confirmationLabel="Confirmation"
        confirmationMsg="Are you sure want to update this record ?"
        confirmationButtonMsg="Update"
      />
    </div>
  );
};

export default TestDetailsModal;
