import React from "react";

import { Box, Modal, Button } from "@mui/material";
import AddButton from "./Buttons/AddButton";
import CancelButton from "./Buttons/CancelButton";
import ConfirmButton from "./Buttons/ConfirmButton";

export default function ConfirmationModal({
  confirmationOpen,
  confirmationHandleClose,
  confirmationSubmitFunc,
  confirmationMsg,
  confirmationButtonMsg,
  confirmationLabel,
}) {
  return (
    <div>
      <Modal
        open={confirmationOpen}
        onClose={confirmationHandleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            border: "2px solid #848211",
            borderRadius: "0.5rem",
            boxShadow: 24,
            px: 4,
            pb: 4,
          }}
        >
          <p className="my-3 tracking-wide font-bold  text-lg ">
            {confirmationLabel}
          </p>
          <div className=" justify-center align-middle">
            <p className="my-3 tracking-wide text-lg">{confirmationMsg}</p>
            <div className="mt-4 flex space-x-4">
              {/* <Button
                onClick={confirmationHandleClose}
                color="error"
              >
            Cancel
          </Button> */}
              <button
                type="button"
                className="h-10 px-3 border border-customRed text-customRed rounded text-sm font-semibold"
                onClick={confirmationHandleClose}
              >
                Cancel
              </button>
              {/* <Button
            onClick={confirmationHandleClose}
            variant="outlined"
            color="error"
            sx={{ border: "1px solid" }}
          >
            Cancel
          </Button> */}
              {/* <Button
            onClick={confirmationSubmitFunc} 
            variant="contained"
            color="success"
            sx={{ marginRight: "1rem"}}
          >
            {confirmationButtonMsg}
          </Button> */}
              {/* <CancelButton onClick={confirmationHandleClose} /> */}
              <ConfirmButton
                onClick={confirmationSubmitFunc}
                confirmationButtonMsg={confirmationButtonMsg}
              />
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
