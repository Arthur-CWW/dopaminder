import React, { useState, useRef } from "react";

type Option = {
  key: string;
  label: string;
  content?: string;
  page?: string;
};

const MultiSelect = ({ options }: { options: Option[] }) => {
  const [isOpen, setOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<Option[]>(
    [] as Option[],
  );
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [filterText, setFilterText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const toggleOpen = () => setOpen(!isOpen);

  const removeOption = (key: string) => {
    const newSelectedOptions = selectedOptions.filter((opt) => opt.key !== key);
    setSelectedOptions(newSelectedOptions);
  };

  const toggleOption = (
    option: Option | undefined,
    e: React.MouseEvent | React.KeyboardEvent,
  ) => {
    if (option === undefined) {
      return;
    }
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((value) => value !== option));
    } else {
      setSelectedOptions(selectedOptions.concat(option));
    }
    e.stopPropagation();
    if (!e.shiftKey) {
      setOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const optionsList = filteredOptions();
    if (e.key === "Backspace" && filterText === "") {
      setSelectedOptions((prev) => prev.slice(0, prev.length - 1));
    }

    if (isOpen) {
      if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
        inputRef?.current?.focus();
        setHighlightedIndex(0);
      } else if (
        (e.ctrlKey && e.key === "k") ||
        e.key === "ArrowUp" ||
        (e.key === "Tab" && e.shiftKey)
      ) {
        e.preventDefault();
        setHighlightedIndex(
          (prev) => (prev - 1 + optionsList.length) % optionsList.length,
        );
      } else if (
        (e.ctrlKey && e.key === "j") ||
        e.key === "ArrowDown" ||
        e.key === "Tab"
      ) {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev + 1) % optionsList.length);
      } else if (e.ctrlKey && e.key === "Enter") {
        toggleOption(optionsList[highlightedIndex], e);

        setFilterText("");
      } else if (e.key === "Enter") {
        toggleOption(optionsList[highlightedIndex], e);
        setFilterText("");
        setOpen(false);
      } else if (e.key === "Home" && e.ctrlKey) {
        e.preventDefault();
        setHighlightedIndex(0);
      } else if (e.key === "End" && e.ctrlKey) {
        e.preventDefault();
        setHighlightedIndex(optionsList.length - 1);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    } else {
      if (e.key === "Enter" && e.ctrlKey) {
        e.preventDefault();
        setOpen(true);
        inputRef?.current?.focus();
      }

      if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
        setOpen(true);
        inputRef?.current?.focus();
      }
    }
  };

  const filteredOptions = () =>
    options.filter((option) =>
      option.label.toLowerCase().includes(filterText.toLowerCase()),
    );

  return (
    <div
      className={`relative p-2 ${
        isOpen ? "rounded-t" : "rounded"
      } w-72 max-w-xl bg-white`}
      onBlur={() => setOpen(false)}
      onKeyDown={(e) => {
        e.stopPropagation();
        handleKeyDown(e);
      }}
      onClick={() => {
        setOpen(true);
        inputRef?.current?.focus();
      }}
    >
      <div className="flex w-full gap-2 overflow-x-auto">
        <input
          onClick={toggleOpen}
          ref={inputRef}
          type="text"
          className="flex-grow px-1 outline-none"
          value={filterText}
          style={{ width: filterText.length + "ch" }}
          placeholder={selectedOptions.length === 0 ? "Filter..." : ""}
          onInput={(e) => setFilterText(e.currentTarget.value)}
        ></input>
      </div>
      {isOpen && (
        <div className="absolute left-0 z-10 mt-2 w-72 rounded-b border bg-white shadow">
          {filteredOptions().map((option, index) => (
            <div
              className={`cursor-pointer p-2 hover:bg-gray-200 ${
                selectedOptions.find((opt) => opt.key === option.key) !==
                undefined
                  ? "bg-gray-100"
                  : ""
              } ${highlightedIndex === index ? "bg-gray-300" : ""}`}
              onClick={(e) => toggleOption(option, e)}
              key={option.key}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
