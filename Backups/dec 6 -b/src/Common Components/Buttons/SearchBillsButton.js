import React from "react";

function SearchBillsButton({ onClick }) {
  return (
    <div>
      <button
        type="button"
        onClick={onClick}
        className="h-10 px-3 w-full bg-customBlue text-white rounded text-base font-medium"
      >
        Search Bills
      </button>
    </div>
  );
}

export default SearchBillsButton;
