import React from "react";
import Tabs from "react-bootstrap/Tabs";

const NavComponent = props => {
  console.log(props.ekey);
  return (
    <div className="bg-card bg-cover bg-center flex flex-col mt-5 max-w-full rounded-lg border-8 border-yellow-900">
      <Tabs defaultActiveKey={props.ekey} className="w-100 align-self-center">
        {props.children}
      </Tabs>
    </div>
  );
};

export default NavComponent;
