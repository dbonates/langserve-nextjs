import { RemoteRunnable } from "langchain/runnables/remote";


async function* makeIterator(query: string) {

  const langserveUrl = process.env.EINSTEIN_URL as string;

  const chain = new RemoteRunnable({
    url: langserveUrl,
  })

  const stream = await chain.stream({
    query: query
  });

  for await (const chunk of stream) {
    const answerChunk = chunk as any;
    if (answerChunk.content) {
      yield answerChunk.content
    }
  };
}

function iteratorToStream(iterator: any) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next()

      if (done) {
        controller.close()
      } else {
        controller.enqueue(value)
      }
    },
  })
}

export async function POST(request: Request) {

  const json = await request.json()
  const { query } = json
  const iterator = makeIterator(query)
  const stream = iteratorToStream(iterator)

  return new Response(stream)
}
