import React from "react";

export const GeneratedUiWrapper = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex h-full w-full flex-auto flex-col">
      <h3 className="text-center text-lg font-semibold">{title}</h3>
      <div className="m-4 flex flex-auto flex-col rounded-lg border">
        {children}
      </div>
    </div>
  );
};
