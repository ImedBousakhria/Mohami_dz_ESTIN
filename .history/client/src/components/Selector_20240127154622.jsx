import React from "react";
import { MenuItem, Select, InputLabel, FormControl } from "@mui/material";

const Selector = ({ list, selectCategory, icon, selectedOption, setSelectedOption }) => {
  const handleChange = (event) => {
    console.log(event.target.value)
    setSelectedOption(event.target.value);
  };

  return (
    <FormControl fullWidth className="bg-white rounded-md min-w-max">
      <InputLabel id="select-label">
        <div className="flex items-center gap-4 tracking-wider">
          <img src={icon} className="cursor-pointer" alt="icon" />
          <span className="text-gray-400 font-normal">{selectCategory}</span>
        </div>
      </InputLabel>
      <Select
        labelId="select-label"
        id="select"
        value={selectedOption}
        onChange={handleChange}
        label="Select Option"
      >
        <MenuItem  value={null}>None</MenuItem> {/* Option to unselect */}
        {list.map((option) => (
          <MenuItem className=" text-black" key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>


      <textarea
        value={selectedOption}
        onChange={handleChange}
        rows={4} // Adjust the number of rows as needed
        className="border border-gray-300 rounded-md p-2 w-full"
      />
    </FormControl>
  );
};

export default Selector;
