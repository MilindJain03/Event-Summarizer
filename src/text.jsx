import { useState, useEffect } from "react";
import myself from "./assets/learning.png";

function Text() {
   const [text, setText] = useState("");
   const [output, setOutput] = useState("");
   const [loading, setLoading] = useState(false);
   const [wordCount, setWordCount] = useState(0); // State to keep track of input word count
   const [summaryWordCount, setSummaryWordCount] = useState(0); // State to keep track of summary word count
   const [minLength, setMinLength] = useState(30); // Minimum length of summary
   const [maxLength, setMaxLength] = useState(130); // Maximum length of summary

   const changing = (e) => {
      setText(e.target.value);
   };

   useEffect(() => {
      // Calculate word count for input text
      const wordArray = text.trim().split(/\s+/);
      setWordCount(wordArray[0] === "" ? 0 : wordArray.length);

      console.log(`API Key: ${import.meta.env.VITE_API_KEY}`);
   }, [text]);

   const clear = () => {
      setOutput("");
      setText("");
      setWordCount(0);
      setSummaryWordCount(0);
   };

   const summarizing = async () => {
      setLoading(true);
      try {
         const response = await fetch(
            "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
            {
               headers: {
                  Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
                  "Content-Type": "application/json",
               },
               method: "POST",
               body: JSON.stringify({ 
                  inputs: text, 
                  parameters: { max_length: maxLength, min_length: minLength, do_sample: false }
               })
            }
         );

         const result = await response.json();
         console.log(result); // Check what the API returns

         if (response.status === 200 && result && result.length > 0) {
            const summaryText = result[0].summary_text || "No summary available.";
            setOutput(summaryText);

            // Calculate word count for summary
            const summaryWords = summaryText.trim().split(/\s+/);
            setSummaryWordCount(summaryWords.length);
         } else {
            setOutput("Error: Unable to generate a summary.");
            console.error("API Error:", result);
         }
      } catch (e) {
         console.log(e);
         alert("An error occurred while summarizing the text.");
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="bg-white h-screen w-screen overflow-x-hidden">
         <nav className="h-24 bg-purple-600 ">
            <h1 className="text-4xl text-white text-center py-6">AI Text Summarizer App</h1>
         </nav>
         <p className="p-4 f text-xl text-center mt-8">Welcome to the AI Text Summarizer App! This app leverages the power of Artificial Intelligence APIs to provide concise summaries of long texts. Whether you have a lengthy article, research paper, or any other text document that you want to summarize quickly, our app can assist you.</p>
         <p className="p-4 f text-xl text-center mt-12">Simply paste your text into the text area below and click the "Submit" button.</p>
         <div className="h-1/2 w-full flex justify-center">
            <div className="w-4/5 flex m-5 mt-10 ">
               <div className="bg-gray-50 h-full w-1/2 mr-5 rounded border-2 border-black relative">
                  <textarea
                     type="text"
                     className="h-4/5 w-full p-10 bg-transparent placeholder:text-bold text-xl focus:outline-none resize-none overflow-y-auto"
                     placeholder="Enter the text here"
                     onChange={(e) => changing(e)} value={text}
                  />
                  <span className="text-xl text-blue-900 absolute bottom-2 right-4">
                     <h1>{wordCount} words</h1>
                  </span>
               </div>
               <div className="bg-white h-full w-1/2 rounded border-2 border-black relative">
                  <h1 className="p-10 text-orange-900 text-xl">{output}</h1>
                  <span className="text-xl text-blue-900 absolute bottom-2 right-4">
                     <h1>{summaryWordCount} words</h1>
                  </span>
               </div>
            </div>
         </div>
         <div className="flex justify-center mb-5">
            <div className="mr-4">
               <label className="text-xl">Min Length: </label>
               <input
                  type="number"
                  value={minLength}
                  onChange={(e) => setMinLength(Number(e.target.value))}
                  className="w-20 p-1 text-xl border rounded"
                  min={1} // Prevent setting minLength to 0
               />
            </div>
            <div>
               <label className="text-xl">Max Length: </label>
               <input
                  type="number"
                  value={maxLength}
                  onChange={(e) => setMaxLength(Number(e.target.value))}
                  className="w-20 p-1 text-xl border rounded"
                  min={minLength} // Ensure maxLength is greater than minLength
               />
            </div>
         </div>
         <div className="flex justify-center">
            {!loading ? (
               <>
                  <button className="bg-orange-400 hover:bg-orange-600 hover:text-white h-12 w-40 font-bold text-xl mb-5 rounded-lg" onClick={summarizing}>Summarize</button>
                  <button className="bg-purple-400 hover:bg-purple-700 hover:text-white h-12 w-40 font-bold text-xl mb-5 ml-4 rounded-lg" onClick={clear}>Clear</button>
               </>
            ) : (
               <h1 className="text-3xl text-orange-600 font-bold mb-12">
                  Loading... Summary!
               </h1>
            )}
         </div>
      </div>
   );
}

export default Text;
