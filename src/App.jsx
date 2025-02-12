import { useState } from 'react'
import './App.css'
import { ShootingStars } from "./components/ui/shooting-stars";
import { StarsBackground } from "./components/ui/stars-background";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Showdown from 'showdown';
import { motion, AnimatePresence } from 'framer-motion';

function App() {

  const converter = new Showdown.Converter();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState(null);
  const [isSubmited, setIsSubmited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [optimizing, setOptimizing] = useState(false);

  const handleChange = (event) => {
    setTitle(event.target.value);
  }

  const handleSubmit = async (e) => {

    e.preventDefault();

    setIsLoading(true);

    try{
      const response = await fetch(`${import.meta.env.VITE_API_URL}/generate/`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: title
        })
      });

      if(!response.ok){
        throw new Error(`Response Status: ${response.status}`);
      }

      const result = await response.json()
      setContent(converter.makeHtml(result.content));

    } catch(error) {
      console.log(error.message);
    }

    setIsSubmited(true);
    setIsLoading(false);

  }

  const handleOptimize = async () => {

    setOptimizing(true);
    try{
      const response = await fetch(`${import.meta.env.VITE_API_URL}/optimize/`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: content
        })
      });

      if(!response.ok){
        throw new Error(`Response Status: ${response.status}`);
      }

      const result = await response.json()
      
      setTimeout(() => {
        setContent("");
        setTimeout(() => {
          setContent(converter.makeHtml(result.content));
          setOptimizing(false);
        },500)
      }, 500);

    } catch(error) {
      console.log(error.message);
      setOptimizing(false);
    }
  }

  return (
    <div className='flex justify-center items-center h-screen bg-neutral-900 ' >
      <ShootingStars />
      <StarsBackground />
      {
        !isSubmited ? (
          <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className=' relative Title flex flex-col justify-center h-[400px] w-[1000px] rounded-2xl ' >
        <form className='  flex flex-col justify-center items-center ' onSubmit={handleSubmit} >
          <motion.label 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className='flex justify-center text-3xl tracking-tight bg-clip-text font-medium text-transparent pb-5 bg-gradient-to-b from-neutral-800 via-white to-white '>
            Enter the Article Title below
          </motion.label>
          <div className=' flex justify-center pb-6'>
          <motion.input
                className='w-[500px] h-[40px] px-2 border text-white border-gray-700 rounded-md text-xl placeholder:text-2xl'
                placeholder='Title'
                type="text"
                onChange={handleChange}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
          />

          </div>
          <motion.input
              className='w-[500px] h-[40px] text-xl font-medium text-white hover:cursor-grab hover:brightness-90 transition bg-blue-500'
              type="submit"
              value={isLoading ? "Loading..." : "Generate"}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
          />        
          </form>
      </motion.div>
        ) : (
          <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative flex flex-col justify-center Editor w-[90%] bg-white"
        >
          {/* Editor with Erasing & Writing Animation */}
          <motion.div
            key={content}
            initial={{ opacity: 1 }}
            animate={{
              opacity: optimizing ? [1, 0, 1] : 1, // Fades out then back in
              x: optimizing ? [-10, 0] : 0, // Slight left shift (erase effect)
            }}
            transition={{ duration: 1 }}
          >
            <ReactQuill value={content} onChange={setContent} />
          </motion.div>

          {/* Optimize Button */}
          <div className="flex justify-center">
            <motion.button
              className="mt-2 mb-2 px-6 py-2 w-[300px] bg-green-500 text-white text-lg rounded-lg hover:cursor-grab hover:brightness-90 transition"
              onClick={handleOptimize}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              {optimizing ? "✍️ Writing..." : "Optimize"}
            </motion.button>
          </div>
        </motion.div>
        )
      }
    </div>
  )
}

export default App
