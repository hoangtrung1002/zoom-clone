import React from "react";

const Meeting = ({ params }: { params: { id: string } }) => {
  return <div>Meeting with {params.id}</div>;
};

export default Meeting;
