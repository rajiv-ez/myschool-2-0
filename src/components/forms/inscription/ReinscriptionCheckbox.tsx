
import React from 'react';
import { UseFormRegister } from "react-hook-form";

interface ReinscriptionCheckboxProps {
  register: UseFormRegister<any>;
}

const ReinscriptionCheckbox: React.FC<ReinscriptionCheckboxProps> = ({ register }) => {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        id="est_reinscription"
        {...register('est_reinscription')}
        className="rounded"
      />
      <label htmlFor="est_reinscription" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        Réinscription
      </label>
    </div>
  );
};

export default ReinscriptionCheckbox;
