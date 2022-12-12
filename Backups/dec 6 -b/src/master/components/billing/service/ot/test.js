import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import ResetButton from "../../../../../Common Components/Buttons/ResetButton";
import SaveButton from "../../../../../Common Components/Buttons/SaveButton";
import SearchDropdown from "../../../../../Common Components/FormFields/searchDropdown";
import DropdownField from "../../../../../Common Components/FormFields/DropdownField";
import ServiceRateMatrixTable from "./ServiceRateMatrixTable";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import DisplayButton from "../../../../../Common Components/Buttons/DisplayButton";
import ApplyButton from "../../../../../Common Components/Buttons/ApplyButton";
import {
  getTariffDropdown,
  getGroupDropdown,
  getSubGroupDropdown,
} from "../../../../services/billing/ot/serviceratematrix/ServiceRateMatrix";
import CheckBoxField from "../../../../../Common Components/FormFields/CheckBoxField";
import RadioField from "../../../../../Common Components/FormFields/RadioField";

const orderListData = {
  message: "Apache Score list found ",
  result: [
    {
      "Service Description": "Capsule endoscopy",
      OPD: "1200",
      "General Ward ": "1300",
      "Semi -pvt. (non A/C)": "1400",
      "Semi -pvt. (A/C)": "1500",
      Suite: "1600",
      "Pvt. (A/C)": "1700",
      ICU: "1500",
      PICU: "1600",
      NICU: "1700",
    },
    {
      "Service Description": "Co2 used in OT",
      OPD: "1200",
      "General Ward ": "1300",
      "Semi -pvt. (non A/C)": "1400",
      "Semi -pvt. (A/C)": "1500",
      Suite: "1600",
      "Pvt. (A/C)": "1700",
      ICU: "1500",
      PICU: "1600",
      NICU: "1700",
    },
    {
      "Service Description": "O2 used in OT",
      OPD: "1200",
      "General Ward ": "1300",
      "Semi -pvt. (non A/C)": "1400",
      "Semi -pvt. (A/C)": "1500",
      Suite: "1600",
      "Pvt. (A/C)": "1700",
      ICU: "1500",
      PICU: "1600",
      NICU: "1700",
    },
    {
      "Service Description": "Stent Charges",
      OPD: "1200",
      "General Ward ": "1300",
      "Semi -pvt. (non A/C)": "1400",
      "Semi -pvt. (A/C)": "1500",
      Suite: "1600",
      "Pvt. (A/C)": "1700",
      ICU: "1500",
      PICU: "1600",
      NICU: "1700",
    },
    {
      "Service Description": "Oxygen Charges (per Hr.)",
      OPD: "1200",
      "General Ward ": "1300",
      "Semi -pvt. (non A/C)": "1400",
      "Semi -pvt. (A/C)": "1500",
      Suite: "1600",
      "Pvt. (A/C)": "1700",
      ICU: "1500",
      PICU: "1600",
      NICU: "1700",
    },
    {
      "Service Description": "No2 used in OT",
      OPD: "1200",
      "General Ward ": "1300",
      "Semi -pvt. (non A/C)": "1400",
      "Semi -pvt. (A/C)": "1500",
      Suite: "1600",
      "Pvt. (A/C)": "1700",
      ICU: "1500",
      PICU: "1600",
      NICU: "1700",
    },
    {
      "Service Description": "Capsule endoscopy",
      OPD: "1200",
      "General Ward ": "1300",
      "Semi -pvt. (non A/C)": "1400",
      "Semi -pvt. (A/C)": "1500",
      Suite: "1600",
      "Pvt. (A/C)": "1700",
      ICU: "1500",
      PICU: "1600",
      NICU: "1700",
    },
    {
      "Service Description": "Co2 used in OT",
      OPD: "1200",
      "General Ward ": "1300",
      "Semi -pvt. (non A/C)": "1400",
      "Semi -pvt. (A/C)": "1500",
      Suite: "1600",
      "Pvt. (A/C)": "1700",
      ICU: "1500",
      PICU: "1600",
      NICU: "1700",
    },
    {
      "Service Description": "O2 used in OT",
      OPD: "1200",
      "General Ward ": "1300",
      "Semi -pvt. (non A/C)": "1400",
      "Semi -pvt. (A/C)": "1500",
      Suite: "1600",
      "Pvt. (A/C)": "1700",
      ICU: "1500",
      PICU: "1600",
      NICU: "1700",
    },
    {
      "Service Description": "Stent Charges",
      OPD: "1200",
      "General Ward ": "1300",
      "Semi -pvt. (non A/C)": "1400",
      "Semi -pvt. (A/C)": "1500",
      Suite: "1600",
      "Pvt. (A/C)": "1700",
      ICU: "1500",
      PICU: "1600",
      NICU: "1700",
    },
    {
      "Service Description": "Oxygen Charges (per Hr.)",
      OPD: "1200",
      "General Ward ": "1300",
      "Semi -pvt. (non A/C)": "1400",
      "Semi -pvt. (A/C)": "1500",
      Suite: "1600",
      "Pvt. (A/C)": "1700",
      ICU: "1500",
      PICU: "1600",
      NICU: "1700",
    },
    {
      "Service Description": "No2 used in OT",
      OPD: "1200",
      "General Ward ": "1300",
      "Semi -pvt. (non A/C)": "1400",
      "Semi -pvt. (A/C)": "1500",
      Suite: "1600",
      "Pvt. (A/C)": "1700",
      ICU: "1500",
      PICU: "1600",
      NICU: "1700",
    },
  ],
  statusCode: 200,

  count: 5,
};

function ServiceRateMatrix() {
  const checkboxVisible = false; //checkboxvisible fro shown common table or not

  const defaultValues = {
    tariff: null,
    allsearch: "",
    opdipdboth: "BOTH",
    subgroup: null,
    applyrateasper: true,
    group: null,
    subgroup: null,
    servicetariff: null,
    allservice: true,
    plusminus: "plus",
    };

    const {
      control,
      handleSubmit,
      reset,
      watch,
      formState: { errors },
    } = useForm({
      mode: "onChange",
      resolver: yupResolver(schema),
      defaultValues,
    });

  // normal checkbox using hide show
  const [checked, setChecked] = React.useState(true);
  const handleChange = () => {
    setChecked(!checked);
  };

  //using devid checkbox hide show
  let allservice = watch("allservice");
  console.log("allservice", allservice);

  // use For Click on checkbox dropdown in diable or enable
  const [enableDropdown, setEnableDropdown] = React.useState(false);

  //using devid checkbox enable disable field
  let applyrateasper = watch("applyrateasper");
  console.log("applyrateasper", applyrateasper);

  //using normal radiobtn , byDefault Both option Selected
  const [selectedRbtn, setSelectedRbtn] = React.useState(false);
  const changeHandlerRbtn = (e) => {
    setSelectedRbtn(e.target.value);
  };
  useEffect(() => {
    setSelectedRbtn("BOTH");
  }, []);
  // byDefault + sulected
  const [selected, setSelected] = React.useState(false);
  const changeHandler = (e) => {
    setSelected(e.target.value);
  };
  useEffect(() => {
    setSelected("plus");
  }, []);

  //uing custom radiobtn bydefault select BOTH n Select only one radiobtn
  const opdipdboth = [
    {
      id: "OPD",
      value: "OPD",
      label: "OPD",
    },
    {
      id: "IPD",
      value: "IPD",
      label: "IPD",
    },
    {
      id: "BOTH",
      value: "BOTH",
      label: "BOTH",
    },
  ];

  //using custom checjbox byDefault BOTH option Selected
  const opdipdbothVal = watch("opdipdboth");
  useEffect(() => {
    console.log("opdipdboth radio field is " + opdipdbothVal);
  }, [opdipdbothVal]);

  const plusminus = [
    {
      id: "plus",
      value: "plus",
      label: "+",
    },
    {
      id: "minus",
      value: "minus",
      label: "-",
    },
  ];
  //using custom checjbox byDefault BOTH option Selected
  const plusminusVal = watch("plusminus");
  useEffect(() => {
    console.log("plusminusVal radio field is " + plusminus);
  }, [plusminus]);

  const schema = yup.object().shape({
    tariff: yup
      .object()
      .required("Required")
      .nullable()
      .shape({
        value: yup.string().required("Please Select tariff"),
        label: yup.string().required("Please Select tariff"),
      }),
  });

 

  const onSubmitDataHandler = (data) => {
    console.log(data);
  };
  const [tariffOptions, setTariffOptions] = React.useState([]);
  const [groupOptions, setGroupOptions] = React.useState([]);
  const [subGroupOptions, setSubGroupOptions] = React.useState([]);

  //Store options of the Tariff Dropdown before the component gets mounted
  useEffect(() => {
    console.log("getTariffList() is going to be executed");
    getTariffList();
  }, []);
  function getTariffList() {
    getTariffDropdown()
      .then((response) => {
        console.log("The list of all the Tariff are as follows" + response);
        console.log(JSON.stringify(response));
        console.log(response.data.result);
        setTariffOptions(response.data.result);
      })
      .catch((error) => {
        console.log("Gives Error", error);
      });
  }

  //Store options of the Group Dropdown before the component gets mounted
  useEffect(() => {
    console.log("getGroupList() is going to be executed");
    getGroupList();
  }, []);
  function getGroupList() {
    getGroupDropdown()
      .then((response) => {
        console.log("The list of all the group are as follows" + response);
        console.log(JSON.stringify(response));
        console.log(response.data.result);
        setGroupOptions(response.data.result);
      })
      .catch((error) => {
        console.log("Gives Error", error);
      });
  }

  //Store options of the SubGroup Dropdown before the component gets mounted
  useEffect(() => {
    console.log("getSubgroupList() is going to be executed");
    getSubGroupList();
  }, []);
  function getSubGroupList() {
    getSubGroupDropdown()
      .then((response) => {
        console.log("The list of all the subgroup are as follows" + response);
        console.log(JSON.stringify(response));
        console.log(response.data.result);
        setSubGroupOptions(response.data.result);
      })
      .catch((error) => {
        console.log("Gives Error", error);
      });
  }

  function displayView() {
    console.log("dispalyVeiw Function Call");
  }

  return (
    <>
      <div className="w-full grid pt-10 px-6 mt-8 md:rounded-md">
        <div className="flex justify-center text-xl">
          <h1 className=" text-gray-700 font-Poppins lg:hidden ">
            Service Rate Matrix
          </h1>
        </div>

        {/*searchable dropdown */}

        <h1 className="text-xl text-gray-700 font-Poppins hidden lg:block">
          Service Rate Matrix
        </h1>
        <form
          className="grid grid-cols-1 w-full gap-2 "
          onSubmit={handleSubmit(onSubmitDataHandler)}
        >
          <div className="border-2 border-gray-300 rounded-md p-2">
            <div className="flex gap-2">
              <div className="whitespace-nowrap mt-2">
               
                <CheckBoxField
                  control={control}
                  name="allservice"
                  label="All Service"
                  value="All Service"
                />
              </div>

              {/* {checked ? ( */}
              {allservice ? (
                   ""
              ) : (
            
                <>
                <div className="grid grid-cols-3 w-full pb-2 gap-x-2">
                  <SearchDropdown
                    control={control}
                    name="searchservice"
                    label="Search Service"
                    searchIcon={true}
                    //   dataArray={mobile}
                    placeholder="Search Service"
                    isSearchable={true}
                    isClearable={false}
                    //   handleInputChange={handleChange}
                    //   inputRef={{
                    //     ...register("mobilesearch", {
                    //       onChange: (e) => {
                    //         console.log(e.target);
                    //         if (e.target.value !== null) {
                    //           setMobileValue(e.target.value.value);
                    //         } else {
                    //           setMobileValue(null);
                    //         }
                    //       },
                    //     }),
                    //   }}
                  />

                  <div className="">
                    <DropdownField
                      control={control}
                      error={errors.tariff}
                      name="tariff"
                      placeholder="Tariff*"
                      dataArray={tariffOptions}
                      isSearchable={false}
                    />
                  </div>

                  <div className=" ">
                    <h5 className="whitespace-nowrap mr-3 text-sm">Applicable to</h5>
                    {/* <div className="flex justify-center"> */}

                      <RadioField
                        label=""
                        name="opdipdboth"
                        control={control}
                        dataArray={opdipdboth}
                      />
                    {/* </div> */}
                  </div>

                  <div>
                    <DropdownField
                      control={control}
                      error={errors.group}
                      name="group"
                      placeholder="Group"
                      dataArray={groupOptions}
                      isSearchable={false}
                    />
                  </div>
                  <div className="">
                    <DropdownField
                      control={control}
                      error={errors.subgroup}
                      name="subgroup"
                      placeholder="Sub Group"
                      dataArray={subGroupOptions}
                      isSearchable={false}
                    />
                  </div>

                  {/* <div className="hidden lg:block"> */}
                  <div className="flex items-center ">
                    <DisplayButton />
                  </div>
                  {/* </div> */}
                </div>
              </>
              )}
            </div>

            <div className="border border-r border-slate-300"> </div>

            <div className="grid grid-cols-1 gap-2 pt-2">
              <div className="flex gap-3 whitespace-nowrap items-center justify-start ">
                <div className="flex items-center whitespace-nowrap ">
      
                  <CheckBoxField
                    control={control}
                    name="applyrateasper"
                    value="Apply Rate as Per"
                    label="Apply Rate as Per"
                  />
                </div>
                <div className="w-2/6">
                  <DropdownField
                    control={control}
                    name="servicetariff"
                    placeholder="Service Tariff"
                    // dataArray={ }
                    isSearchable={false}
                    // isDisabled={enableDropdown}
                    isDisabled={applyrateasper}
                  />
                </div>

                <div className="flex  gap-2">
                  <div className="flex gap-2 items-center">
                    <div className="text-right w-1/6">
                      <label className="text-right border border-gray-600 py-1 rounded-md md:px-4 lg:px-8 ">
                        %
                      </label>
                    </div>

                    <div className="flex items-center justify-center font-bold md:ml-3 lg:ml-7">
                    
                      <RadioField
                        label=""
                        name="plusminus"
                        control={control}
                        dataArray={plusminus}
                      />
                    </div>

                    <ApplyButton />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ServiceRateMatrixTable
            data={orderListData}
            checkboxVisible={checkboxVisible}
            displayView={displayView}
          />
          <div className="flex gap-2 pb-2 justify-end">
            <ResetButton onClick={() => reset(defaultValues)} />
            <SaveButton />
          </div>
        </form>
      </div>
    </>
  );
}

export default ServiceRateMatrix;
