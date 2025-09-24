import { useMutation } from "@tanstack/react-query";

interface RunCodeProp {
  id: number;
  sourceCode: string;
  input: string;
}

const runCode = async ({ id, sourceCode, input }: RunCodeProp) => {
  const res = await fetch(
    `https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true&fields=*`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-rapidapi-key": "86b1ed7eb9msh43555f05cd00280p1a12c6jsneae964e1f803",
        "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
      },
      body: JSON.stringify({
        language_id: id,
        source_code: sourceCode,
        stdin: input,
      }),
    }
  );
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to register user");
  }
  return data;
};

export const useExecuteCode = () => {
  return useMutation({
    mutationFn: (props: RunCodeProp) => runCode(props),
  });
};
