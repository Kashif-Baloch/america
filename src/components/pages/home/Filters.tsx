import useClickOutsideDetector from "@/hooks/useClickOutsideDetector";
import USAStates from "@/utils/constant/USAStates";
import { ArrowDownIcon } from "@/utils/Icons";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { IoCheckmark } from "react-icons/io5";
import { Plan } from "@/lib/types";

interface FilterOptions {
  label: string;
  plan?: string;
}

export interface Filters {
  location: string;
  jobType: string[];
  salary: string;
  contactOutside: string;
  season: string[];
  transportationHousing: string;
}

function FilterSection({
  t,
  plan,
  filters,
  setFilters,
}: {
  t: ReturnType<typeof useTranslations>;
  plan: Plan;
  filters: Filters;
  setFilters: Dispatch<SetStateAction<Filters>>;
}) {
  const handleClearFilters = () => {
    setFilters({
      location: t("filter.location"),
      jobType: [],
      salary: t("filter.salary"),
      contactOutside: t("filter.contactOutside"),
      season: [],
      transportationHousing: t("filter.transportationHousing"),
    });
  };

  const handleSingleFilterChange = (
    filterName: keyof Filters,
    value: string
  ) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
  };

  const handleMultiFilterChange = (
    filterName: keyof Filters,
    value: string
  ) => {
    setFilters((prev) => {
      const currentValues = Array.isArray(prev[filterName])
        ? (prev[filterName] as string[])
        : [];

      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];

      return { ...prev, [filterName]: newValues };
    });
  };

  const getDisplayValue = (
    values: string | string[],
    label: string,
    options: string[]
  ): string => {
    if (Array.isArray(values)) {
      return values.length === 0
        ? label
        : values.length > 0
        ? `${label} (${values.length})`
        : values.join(", ");
    }
    return values === options[0] ? label : values;
  };

  const jobTypeOptions = [
    t("filters.jobTypes.full_time"),
    t("filters.jobTypes.part_time"),
    t("filters.jobTypes.contract"),
    t("filters.jobTypes.temporary"),
    t("filters.jobTypes.internship"),
  ];

  const allSalaryOptions = [
    { label: t("filters.salary.upto13"), plan: "Basic" },
    { label: t("filters.salary.upto26"), plan: "Pro" },
    { label: t("filters.salary.above26"), plan: "Pro+" },
  ];

  const salaryOptions =
    plan === "BASIC"
      ? allSalaryOptions.slice(0, 1)
      : plan === "PRO"
      ? allSalaryOptions.slice(0, 2)
      : plan === "PRO_PLUS"
      ? allSalaryOptions
      : allSalaryOptions;

  const seasonOptions = [
    { label: t("filters.seasons.summer") },
    { label: t("filters.seasons.winter"), plan: "Pro" },
    { label: t("filters.seasons.yearRound") },
  ];

  const contactOutsideOptions = [
    { label: t("filters.contactOutside.all") },
    { label: t("filters.contactOutside.yes"), plan: "Pro" },
    { label: t("filters.contactOutside.no") },
  ];

  const disabled = {
    location: false,
    jobType: plan === "NONE" ? true : false,
    salary:
      plan === "PRO" || plan === "PRO_PLUS" || plan === "BASIC" ? false : true,
    contactOutside: plan === "PRO" || plan === "PRO_PLUS" ? false : true,
    season: plan === "PRO" || plan === "PRO_PLUS" ? false : true,
    transportationHousing: plan === "PRO" || plan === "PRO_PLUS" ? false : true,
  };

  return (
    <div className="p-4 mb-9">
      <div className="flex flex-wrap gap-3 items-center justify-center">
        <DropdownFilter
          label={t("filter.location")}
          options={USAStates}
          value={filters.location}
          onChange={(value) => handleSingleFilterChange("location", value)}
          className="md:min-w-36 max-md:w-max"
        />

        <MultiDropdownFilter
          options={jobTypeOptions}
          selectedValues={filters.jobType}
          onChange={(value) => handleMultiFilterChange("jobType", value)}
          displayValue={getDisplayValue(
            filters.jobType,
            t("filter.jobType"),
            jobTypeOptions
          )}
          disabled={disabled.jobType}
        />

        <DropdownFilterWithBadges
          label={t("filter.salary")}
          options={salaryOptions}
          value={filters.salary}
          onChange={(value) => handleSingleFilterChange("salary", value)}
          className="md:min-w-48 max-md:w-max"
          disabled={disabled.salary}
        />

        <DropdownFilterWithBadges
          label={t("filter.contactOutside")}
          options={contactOutsideOptions}
          value={filters.contactOutside}
          onChange={(value) =>
            handleSingleFilterChange("contactOutside", value)
          }
          className="max-md:w-max"
          disabled={disabled.contactOutside}
        />

        <MultiDropdownFilterWithBadges
          options={seasonOptions}
          selectedValues={filters.season}
          onChange={(value) => handleMultiFilterChange("season", value)}
          displayValue={getDisplayValue(
            filters.season,
            t("filter.season"),
            seasonOptions.map((opt) => opt.label)
          )}
          disabled={disabled.season}
        />

        <DropdownFilter
          label={t("filter.transportationHousing")}
          options={[
            t("filters.transport.all"),
            t("filters.transport.transport"),
            t("filters.transport.housing"),
          ]}
          value={filters.transportationHousing}
          onChange={(value) =>
            handleSingleFilterChange("transportationHousing", value)
          }
          className="md:min-w-44 max-md:w-max max-md:col-span-2"
          disabled={disabled.transportationHousing}
        />
      </div>
      <div className="mt-4 flex justify-center">
        <button
          type="button"
          onClick={handleClearFilters}
          className="text-primary-blue underline text-base"
        >
          Clear filters
        </button>
      </div>
    </div>
  );
}

function DropdownFilter({
  options,
  value,
  onChange,
  className,
  disabled = false,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  className: string;
  disabled?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutsideDetector(dropdownRef, () => {
    setIsOpen(false);
  });

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        className={`flex items-center ${
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        } px-3 py-2 rounded gap-2.5 bg-primary-blue/5 text-[#555555] text-base ${className}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className="flex gap-4 items-center w-full justify-between">
          <span className="text-lg">{value}</span>
          <ArrowDownIcon />
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-56 mt-1 max-h-[500px] overflow-y-auto bg-white rounded-md border shadow-lg">
          {options.map((option) => (
            <div
              key={option}
              className="cursor-pointer py-2 px-4 hover:bg-gray-50 text-lg"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MultiDropdownFilter({
  options,
  selectedValues,
  onChange,
  displayValue,
  disabled = false,
}: {
  options: string[];
  selectedValues: string[];
  onChange: (value: string) => void;
  displayValue: string;
  disabled?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutsideDetector(dropdownRef, () => {
    setIsOpen(false);
  });

  return (
    <div className="relative md:min-w-[135px] max-md:w-max" ref={dropdownRef}>
      <button
        className={`flex items-center ${
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        } px-3 py-2 rounded gap-2.5 bg-primary-blue/5 text-[#555555] text-base md:min-w-[135px] max-md:w-max`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className="flex gap-4 items-center justify-between w-full text-lg">
          <span>{displayValue}</span>
          <ArrowDownIcon />
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-56 mt-1 max-h-[500px] overflow-y-auto bg-white rounded-md border shadow-lg">
          {options.map((option) => (
            <div
              key={option}
              className="relative flex items-center px-8 py-2 cursor-pointer hover:bg-gray-50"
              onClick={() => onChange(option)}
            >
              <div
                className={`absolute left-3 flex items-center justify-center w-5 h-5 border border-gray-300 rounded 
                ${
                  selectedValues.includes(option)
                    ? "bg-primary-blue border-primary-blue"
                    : "bg-white"
                }`}
              >
                {selectedValues.includes(option) && (
                  <IoCheckmark className="stroke-white" />
                )}
              </div>
              <span className="ml-2 text-lg">{option}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DropdownFilterWithBadges({
  options,
  value,
  onChange,
  className,
  disabled = false,
}: {
  label: string;
  options: FilterOptions[];
  value: string;
  onChange: (value: string) => void;
  className: string;
  disabled?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutsideDetector(dropdownRef, () => {
    setIsOpen(false);
  });

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        className={`flex items-center ${
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        } px-3 py-2 rounded gap-2.5 bg-primary-blue/5 text-[#555555] text-base ${className}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className="flex gap-4 items-center w-full justify-between">
          <span className="text-lg">{value}</span>
          <ArrowDownIcon />
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-56 mt-1 max-h-[500px] overflow-y-auto bg-white rounded-md border shadow-lg">
          {options.map((option) => (
            <div
              key={option.label}
              className="cursor-pointer py-2 text-lg px-4 flex justify-between items-center hover:bg-gray-50"
              onClick={() => {
                onChange(option.label);
                setIsOpen(false);
              }}
            >
              <span>{option.label}</span>
              {option?.plan && (
                <span
                  className={`text-sm px-2 py-1 rounded ${
                    option.plan === "Basic"
                      ? "bg-ghost-green text-secondary-green"
                      : "bg-ghost-golden text-golden"
                  }`}
                >
                  {option.plan}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MultiDropdownFilterWithBadges({
  options,
  selectedValues,
  onChange,
  displayValue,
  disabled = false,
}: {
  options: FilterOptions[];
  selectedValues: string[];
  onChange: (value: string) => void;
  displayValue: string;
  disabled?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutsideDetector(dropdownRef, () => {
    setIsOpen(false);
  });

  return (
    <div className="relative md:min-w-[135px] max-md:w-max" ref={dropdownRef}>
      <button
        className={`flex items-center ${
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        } px-3 py-2 rounded gap-2.5 bg-primary-blue/5 text-[#555555] text-base md:min-w-[135px] max-md:w-max`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className="flex gap-4 items-center text-lg justify-between w-full">
          <span>{displayValue}</span>
          <ArrowDownIcon />
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-56 mt-1 max-h-[500px] overflow-y-auto bg-white rounded-md border shadow-lg">
          {options.map((option) => (
            <div
              key={option.label}
              className="relative flex text-lg items-center justify-between px-8 py-2 cursor-pointer hover:bg-gray-50"
              onClick={() => onChange(option.label)}
            >
              <div className="flex items-center">
                <div
                  className={`absolute left-3 flex items-center justify-center w-5 h-5 border border-gray-300 rounded 
                    ${
                      selectedValues.includes(option.label)
                        ? "bg-primary-blue border-primary-blue"
                        : "bg-white"
                    }`}
                >
                  {selectedValues.includes(option.label) && (
                    <IoCheckmark className="stroke-white" />
                  )}
                </div>
                <span className="ml-6">{option.label}</span>
              </div>
              {option?.plan && (
                <span
                  className={`text-sm px-2 py-1 rounded ${
                    option.plan === "Basic"
                      ? "bg-ghost-green text-secondary-green"
                      : "bg-ghost-golden text-golden"
                  }`}
                >
                  {option.plan}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FilterSection;
