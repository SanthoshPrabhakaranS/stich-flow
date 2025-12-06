"use client";

import React from "react";

const CustomLogo = ({
  className,
  hideDescription = false,
}: {
  className?: string;
  hideDescription?: boolean;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <h2
        className={`${
          className ? className : "text-2xl"
        } font-bold text-purple-600 m-0`}
      >
        👗 StichFlow
      </h2>
      {hideDescription && (
        <p className="text-sm text-gray-500 mt-1">Management System</p>
      )}
    </div>
  );
};

export default CustomLogo;
