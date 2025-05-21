"use client";
import { FormEvent, ChangeEvent, useState, useEffect } from "react";
import { Form } from "@/components/common/form";
import { useFetch } from "@/utils/client/hooks/useFetch.ts";

export default () => {
  const [content, setContent] = useState<string | null>(null);
  const [userInput, setUserInput] = useState<string>("");
  const { data, loading, error } = useFetch(
    "placeholder",
    `https://jsonplaceholder.typicode.com/users/${userInput}`
  );
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userInput === content) return;
    setContent(userInput);
    setUserInput(userInput);
  };
  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formInput = e.currentTarget.value;
    if (formInput === userInput) return;
    setUserInput(formInput);
    console.log("handleChange", JSON.parse(content ?? `{}`));
  };
  useEffect(() => {
    if (loading === true) {
      setContent(`loading...`);
    }
    if (data) {
      setContent(JSON.stringify(data));
    }
    if (error) {
      setContent(JSON.stringify(error));
    }
    console.log({ content, data, loading, error });
  }, [data, error, loading, userInput]);
  return (
    <Form
      onSubmit={handleSubmit}
      className="border border-violet-500 w-fit p-5 flex flex-col justify-center items-center"
    >
      <div id="input container" className="mb-5">
        <input
          type="number"
          name="content"
          value={userInput}
          onChange={handleOnChange}
        />
        <button
          className="border border-black rounded-full ml-2 p-2"
          type="submit"
        >
          Submit
        </button>
      </div>
      <p>{content ?? "here"}</p>
    </Form>
  );
};
