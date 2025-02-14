import { useState } from 'react'
import './App.css'
import { ShootingStars } from "./components/ui/shooting-stars";
import { StarsBackground } from "./components/ui/stars-background";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Showdown from 'showdown';
import { motion, AnimatePresence } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';


function App() {

  const converter = new Showdown.Converter();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState(null);
  const [isSubmited, setIsSubmited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [animatedContent, setAnimatedContent] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);

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
      const newContent = converter.makeHtml(result.content);
      startTypingAnimation(newContent);

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

      const result = await response.json();

      const newContent = converter.makeHtml(result.content);
      startTypingAnimation(newContent);

    } catch(error) {
      console.log(error.message);
    }
    setOptimizing(false);
  };

  const startTypingAnimation = (htmlContent) => {
    setIsAnimating(true);
    setAnimatedContent("");

    const plainText = htmlContent.replace(/<[^>]+>/g, "");
    let index = 0;

    const interval = setInterval(() => {
      setAnimatedContent((prev) => prev + plainText[index]);
      index++;
      if(index === plainText.length){
         clearInterval(interval);
         setIsAnimating(false);
         setContent(htmlContent);
      }
    }, 10);
  };

  return (
    <div className='flex justify-center items-center h-screen bg-neutral-900 ' >
      <ShootingStars />
      <StarsBackground />
      {
        !isSubmited ? (

          // Landing Page
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
              transition={{ duration: 0.2 }}
          />        
          </form>
      </motion.div>
        ) : (

          // Text Editor Page
          <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative flex flex-col justify-center Editor w-[90%] bg-white"
        >

            <ReactQuill value={isAnimating ? animatedContent : content} onChange={setContent} />


          <div className="flex justify-center">
            <motion.button
              className="mt-2 mb-2 px-6 py-2 w-[300px] bg-green-500 text-white text-lg rounded-lg hover:cursor-grab hover:brightness-90 transition"
              onClick={handleOptimize}
              transition={{ duration: 0.2 }}
            >
              {optimizing ? "Optimizing..." : "Optimize"}
            </motion.button>
          </div>
        </motion.div>
        )
      }
    </div>
  )
}

export default App
