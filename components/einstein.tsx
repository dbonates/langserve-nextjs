'use client'
import useBot from '@/ai/hooks/bothook';

export default function Einstein() {
    
    const { answer, input, handleInputChange, handleSubmit } = useBot();

    return (
        <form onSubmit={handleSubmit} className='flex flex-col space-y-2'>
            <h1 className='font-bold text-4xl'>Einstein</h1>
            <div className='p-4 border rounded'>
                <input className='w-full rounded' value={input} onChange={handleInputChange} id="inputRef" type="text" name="msg" placeholder="Enter your message" />
            </div>
            <div className='flex'>
                <div className='flex-grow'></div>
                <button type='submit' className="border rounded p-2 text-xs text-white bg-sky-500">
                    Send Query
                </button>
            </div>
            <div className='flex-grow transition-[flex-grow] ease-in-out'>{answer}</div>
        </form>
    )
}
