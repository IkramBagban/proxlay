import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const TagsInput = ({ name }: { name: string }) => {
  const { setValue, getValues, formState: { errors } } = useFormContext();
  const [input, setInput] = useState("");
  const tags = getValues(name) || [];

  const addTag = () => {
    const trimmed = input.trim();
    if (trimmed && !tags.includes(trimmed) && tags.length < 10) {
      const newTags = [...tags, trimmed];
      setValue(name, newTags, { shouldValidate: true });
      setInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter((tag: string) => tag !== tagToRemove);
    setValue(name, newTags, { shouldValidate: true });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag: string) => (
          <div
            key={tag}
            className="flex items-center bg-muted px-2 py-1 rounded text-sm"
          >
            {tag}
            <button
              type="button"
              className="ml-2 text-red-500 hover:text-red-700"
              onClick={() => removeTag(tag)}
            >
              &times;
            </button>
          </div>
        ))}
      </div>

      <div className="flex space-x-2">
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Add tag and press Enter"
          className={errors[name] ? "border-red-500" : ""}
        />
        <Button type="button" onClick={addTag}>
          Add
        </Button>
      </div>

      {/* {errors[name] && (
        <p className="text-red-600 mt-1 text-sm">{errors[name]?.message}</p>
      )} */}
    </div>
  );
};

export default TagsInput;
