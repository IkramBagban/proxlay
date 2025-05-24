import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Hash, Plus, X } from "lucide-react";

const MAX_TOTAL_LENGTH = 500;

const TagsInput = ({ name }: { name: string }) => {
  const {
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();
  const [input, setInput] = useState("");
  const tags: string[] = getValues(name) || [];

  const getTotalLength = (list: string[]) => list.join(",").length;

  const addTags = (raw: string) => {
    const incomingTags = raw
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag && !tags.includes(tag));

    const availableLength = MAX_TOTAL_LENGTH - getTotalLength(tags);
    const validTags: string[] = [];

    for (const tag of incomingTags) {
      if (getTotalLength([...tags, ...validTags, tag]) <= MAX_TOTAL_LENGTH) {
        validTags.push(tag);
      } else {
        break; // Stop adding if it exceeds max total length
      }
    }

    if (validTags.length) {
      const newTags = [...tags, ...validTags];
      setValue(name, newTags, { shouldValidate: true });
    }

    setInput("");
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setValue(name, newTags, { shouldValidate: true });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.includes(",")) {
      addTags(val);
    } else {
      setInput(val);
    }
  };

  return (
    <div className="space-y-3">
      {/* Display Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <div
              key={tag}
              className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm font-medium border border-blue-200 hover:bg-blue-200 transition-colors"
            >
              <Hash className="w-3 h-3" />
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1 hover:bg-blue-300 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            value={input}
            onChange={handleChange}
            placeholder="Type or paste tags, separate with commas"
            className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            disabled={getTotalLength(tags) >= MAX_TOTAL_LENGTH}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTags(input);
              }
            }}
            
            
          />
        </div>
        <Button
          type="button"
          onClick={() => addTags(input)}
          disabled={!input.trim() || getTotalLength(tags) >= MAX_TOTAL_LENGTH}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Character Count */}
      <div className="text-sm text-gray-500 flex justify-between">
        <span>Separate tags with commas</span>
        <span
          className={
            getTotalLength(tags) >= MAX_TOTAL_LENGTH
              ? "text-red-500 font-medium"
              : ""
          }
        >
          {getTotalLength(tags)}/{MAX_TOTAL_LENGTH} characters
        </span>
      </div>
    </div>
  );
};

export default TagsInput;
