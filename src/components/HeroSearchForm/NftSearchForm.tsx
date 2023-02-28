import React, { useEffect, useState } from "react";
import LocationInput from "./LocationInput";
import { FC } from "react";
import PropertyTypeSelect from "./PropertyTypeSelect";
import PriceRangeInput from "./PriceRangeInput";
import ItemTypeSelect from "./ItemTypeSelect";
import { useNavigate } from "react-router-dom";

export interface NftSearchFormProps {
  haveDefaultValue?: boolean;
}

const NftSearchForm: FC<NftSearchFormProps> = ({
  haveDefaultValue = false,
}) => {
  const [inputDomain, setInputDomain] = useState("");
  const navigate = useNavigate();

  const renderForm = () => {
    return (
      <form onSubmit={e => { e.preventDefault(); (inputDomain.length > 0 && inputDomain.length < 1000) && navigate("/search", { state: { inputDomain } })  }} className="w-full relative xl:mt-8 flex flex-col lg:flex-row rounded-[30px] md:rounded-[36px] lg:rounded-full shadow-xl dark:shadow-2xl bg-white dark:bg-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-700 lg:divide-y-0">
        <LocationInput
          defaultValue={inputDomain}
          onChange={(e) => setInputDomain(e)}
          className="flex-1 lg:flex-[1.5]"
        />

        {/* <ItemTypeSelect /> */}
        <PropertyTypeSelect />
        <PriceRangeInput inputDomain={inputDomain}/>
        {/* BUTTON SUBMIT OF FORM */}
      </form>
    );
  };

  return renderForm();
};

export default NftSearchForm;
