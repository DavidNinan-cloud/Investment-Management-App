import { Button, Card, CardContent, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";

const LocalExamination = (props) => {
  const { localExamination, setLocalExamination } = props;
  // const [historyValue, setHistoryValue] = useState(patientSurgicalHistory);

  return (
    <div className="ml-1 h-[16rem]">
      <Card
        square={true}
        elevation={1}
        sx={{
          marginY: "3px",
          overflow: "visible",
          paddingY: "0.3rem",
        }}
        className=" mx-auto h-full overflow-y-visible "
      >
        <div className="">
          <CardContent>
            <div className="text-sm font-semibold py-2 bg-[#DBEAFE] -mt-2">
              <h1 className="pl-2">Local Examination</h1>
            </div>
            <hr className="border mb-2 border-slate-300" />
            <div>
              <div>
                {/* <form onSubmit={handleHistory}> */}
                <TextField
                  variant="outlined"
                  label="Add Local Examination"
                  fullWidth
                  size="small"
                  multiline
                  rows={4}
                  name="localExamination"
                  onChange={(e) => props.setLocalExamination(e.target.value)}
                  value={localExamination}
                />
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
};

export default LocalExamination;
