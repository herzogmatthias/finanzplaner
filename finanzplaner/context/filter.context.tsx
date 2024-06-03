// contexts/FilterContext.js
import { Option } from "chakra-multiselect";
import { createContext, useContext, useState } from "react";

export interface IFilters {
  freeText: string;
  iban: string;
  account: Option[];
  dateFrom: string;
  dateTo: string;
}

export interface IFilterContext {
  filters: IFilters;
  handleFilterChange: (field: string, value: string | Option[]) => void;
  resetFilters: () => void;
  notifySubscribers: () => void;
  subscribe: (callback: (filters: IFilters) => void) => () => void;
}

const FilterContext = createContext<IFilterContext | null>(null);

export const useFilters = () => useContext(FilterContext);

export const FilterProvider = ({ children }: { children: React.ReactNode }) => {
  const [filters, setFilters] = useState<IFilters>({
    freeText: "",
    iban: "",
    account: [],
    dateFrom: "",
    dateTo: "",
  });
  const [subscribers, setSubscribers] = useState<any[]>([]);

  const handleFilterChange = (field: string, value: string | Option[]) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };
  const subscribe = (callback: (filters: IFilters) => void) => {
    setSubscribers((subs) => [...subs, callback]);
    return () => {
      setSubscribers((subs) => subs.filter((sub) => sub !== callback));
    };
  };

  const notifySubscribers = () => {
    subscribers.forEach((callback) => callback(filters));
  };

  const resetFilters = () => {
    setFilters({
      freeText: "",
      iban: "",
      account: [],
      dateFrom: "",
      dateTo: "",
    });
  };

  return (
    <FilterContext.Provider
      value={{
        filters,
        handleFilterChange,
        resetFilters,
        notifySubscribers,
        subscribe,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};
