import { FormEvent, useState } from 'react';

type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;

type HandleSubmitFunction = (e: FormEvent<HTMLFormElement>) => void;

interface UseBotReturn {
  answer: string;
  input: string;
  inputSize: number;
  handleInputChange: (event: InputChangeEvent) => void;
  handleSubmit: HandleSubmitFunction;
  setInput: (input: string) => void;
  resetQuery: () => void;
  done: boolean;
}

const useBot = (): UseBotReturn => {
  const [input, setInput] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [inputSize, setInputSize] = useState<number>(0);
  const [done, setDone] = useState<boolean>(false);

  const handleInputChange = (event: InputChangeEvent): void => {
    setInput(event.target.value);
    setInputSize(event.target.value.length);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input)
      return;
    setAnswer("");

    try {
      const response = await fetch('/api/einstein', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: input }),
      })

      if (!response.body) { return }

      const reader = response.body.getReader();

      setDone(false);

      return new ReadableStream({
        start(controller) {
          function push() {
            reader.read().then(({ done, value }) => {
              if (done) {
                setDone(true);
                controller.close();
                return;
              }
              let decoder = new TextDecoder();
              let text = decoder.decode(value);
              setAnswer(answer => answer + text);

              controller.enqueue(value);
              // console.log(done, value);
              push();
            });
          }
          push();
        },
      });


    } catch (error) {
      console.log("deal with that!");
    }
  }

  function resetQuery() {
    setInput('');
  }

  return { answer, input, inputSize, setInput, handleInputChange, handleSubmit, resetQuery, done };
};

export default useBot;
