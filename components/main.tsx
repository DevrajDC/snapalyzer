"use client";

import { GoogleGenerativeAI } from "@google/generative-ai";
import Image from "next/image";
import { useState } from "react";

function Main() {
  const [image, setImage] = useState<File | null>(null);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [relatedQuestions, setRelatedQuestions] = useState<string[]>([]);

  // Analyze the image with the provided prompt
  const analyzeImage = async (additionalPrompt: string = "") => {
    if (!image) return;
    setLoading(true);

    const genAI = new GoogleGenerativeAI(
      process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY!,
    );

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    // Generate the response
    try {
      const imageParts = await fileToGenerativePart(image);
      const result = await model.generateContent([
        `Identify this image and provide its name and important information including a brief explanation about that image. ${additionalPrompt}`,
        imageParts,
      ]);

      const response = await result.response;

      const text = response
        .text()
        .trim()
        .replace(/```/g, "")
        .replace(/\*\*/g, "")
        .replace(/\*/g, "")
        .replace(/-\s*/g, "")
        .replace(/\n\s*\n/g, "\n");

      setResult(text); // Set the response text as the result

      generateKeywords(text);

      await generateRelatedQuestions(text);
    } catch (error) {
      console.log((error as Error)?.message);
    } finally {
      setLoading(false);
    }
  };

  // Generate keywords from the response text
  const generateKeywords = (text: string) => {
    const words = text.split(/\s+/);
    const keywordSet = new Set<string>();

    // Filter out common words and add them to the keyword set
    words.forEach((word) => {
      if (
        word.length > 4 &&
        !["this", "that", "with", "from", "have"].includes(word.toLowerCase())
      ) {
        keywordSet.add(word);
      }
    });

    // Convert the Set of keywords to an array, and get the first 5 elements
    setKeywords(Array.from(keywordSet).slice(0, 5));
  };

  // Regenerate the content with a new keyword
  const regenerateContent = (keyword: string) => {
    analyzeImage(`Focus more on aspects related to "${keyword}"`);
  };

  // Generate related questions from the response text
  const generateRelatedQuestions = async (text: string) => {
    // Create a new generative AI instance
    const genAI = new GoogleGenerativeAI(
      process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY!,
    );
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
      const result = await model.generateContent([
        `Based on the following information about an image, generate 5 related questions that someone might ask to learn more about the subject:

        ${text}

        Format the output as a simple list of questions, one per line.`,
      ]);
      const response = await result.response;
      const questions = response.text().trim().split("\n"); // Split the response into an array of questions
      setRelatedQuestions(questions);
    } catch (error) {
      console.error("Error generating related questions:", error);
      setRelatedQuestions([]);
    }
  };

  // Analyze the image with the Related Questions as prompt
  const askRelatedQuestion = (question: string) => {
    analyzeImage(
      `Answer the following question about the image: "${question}"`,
    );
  };

  // Break image into generative parts
  const fileToGenerativePart = async (
    file: File,
  ): Promise<{
    inlineData: { data: string; mimeType: string };
  }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader(); // Read the content of the file
      // This function is called when the file has been successfully read
      reader.onload = function () {
        const base64Data = reader.result as string;
        const base64Content = base64Data.split(",")[1];
        // Resolve the promise with the base64 content and the file's MIME type
        resolve({
          inlineData: {
            data: base64Content,
            mimeType: file.type,
          },
        });
      };
      reader.onerror = reject; // Reject the promise if there is an error
      reader.readAsDataURL(file); // Read the file as a data URL
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="p-8">
          <h2 className="mb-8 text-center text-3xl font-extrabold text-gray-900 underline decoration-blue-500 decoration-wavy underline-offset-8">
            Analyze Your Image
          </h2>
          <div className="mb-4">
            {/* Upload Image */}
            <label
              htmlFor="image-upload"
              className="mb-2 block text-sm font-bold text-gray-700"
            >
              Upload an image:
            </label>
            <div className="relative">
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full cursor-pointer rounded-3xl border border-dotted border-blue-200 p-1 text-sm text-gray-500 transition duration-150 ease-in-out file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </div>

          {/* Display the Image */}
          {image && (
            <div className="mb-8 flex justify-center">
              <Image
                src={URL.createObjectURL(image)} // Convert the File object to a temporary unique URL
                alt="Uploaded Image"
                width={300}
                height={300}
                className="rounded-xl shadow-md"
              />
            </div>
          )}

          {/* Button to analyze the image */}
          <button
            onClick={() => analyzeImage()}
            disabled={!image || loading}
            className="text-md w-full rounded-3xl bg-blue-600 px-4 py-2 font-medium text-white transition duration-150 ease-in-out hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Analyze Image"}
          </button>
        </div>

        {/* Display the Result */}
        {result && (
          <div className="border-t border-blue-200 bg-blue-50/80 p-8">
            {/* Ask Questions Input */}
            <div className="mb-8 w-full">
              <h4 className="mb-2 text-xl font-bold">
                Ask a custom question about the image:
              </h4>
              <div className="flex w-full items-center justify-center gap-2">
                <input
                  id="prompt-input"
                  type="text"
                  value={question}
                  placeholder="Enter a question..."
                  onChange={(e) => setQuestion(e.target.value)}
                  className="block w-full rounded-lg border border-gray-500 bg-white px-4 py-2 pr-8 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
                <button
                  onClick={() => regenerateContent(question)}
                  disabled={!question.trim() || loading}
                  className="w-fit cursor-pointer whitespace-nowrap rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white transition duration-150 ease-in-out hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Analyzing..." : "Ask Question"}
                </button>
              </div>
            </div>

            {/* Result Display */}
            <h3 className="mb-2 text-xl font-bold">Image Information:</h3>
            <div className="prose prose-blue max-w-none">
              {result.split("\n").map((line, index) => {
                if (
                  line.startsWith("Important Information:") ||
                  line.startsWith("Other Information:")
                ) {
                  return (
                    <h4 key={index} className="mb-2 mt-4 text-xl font-bold">
                      {line}
                    </h4>
                  );
                } else if (line.match(/^\d+\./) || line.startsWith("-")) {
                  return (
                    <li
                      key={index}
                      className="mb-2 ml-4 list-disc text-gray-700"
                    >
                      {line}
                    </li>
                  );
                } else if (line.trim() !== "") {
                  return (
                    <p key={index} className="mb-2 text-gray-800">
                      {line}
                    </p>
                  );
                }
                return null;
              })}
            </div>

            {/* Related Keywords */}
            <div className="mt-6">
              <h4 className="mb-2 text-xl font-bold">Related Keywords:</h4>
              <div className="flex flex-wrap gap-2">
                {keywords.map((keyword, index) => (
                  <button
                    key={index}
                    onClick={() => regenerateContent(keyword)}
                    className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 transition duration-150 ease-in-out hover:bg-blue-200"
                  >
                    #{keyword}
                  </button>
                ))}
              </div>
            </div>

            {/* Related Questions */}
            {relatedQuestions.length > 0 && (
              <div className="mt-6">
                <h4 className="mb-2 text-xl font-bold">Related Questions:</h4>
                <ul className="space-y-2">
                  {relatedQuestions.map((question, index) => (
                    <li key={index}>
                      <button
                        onClick={() => askRelatedQuestion(question)}
                        className="w-full rounded-lg bg-blue-100 px-4 py-2 text-left text-sm font-medium text-blue-800 transition duration-150 ease-in-out hover:bg-blue-200"
                      >
                        {question}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* How It Works Section */}
      <section id="how-it-works" className="mt-16">
        <h2 className="mb-8 text-center text-3xl font-extrabold text-gray-900">
          How It Works
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {["Upload Image", "AI Analysis", "Get Results"].map((step, index) => (
            <div
              key={index}
              className="transform rounded-xl bg-white p-6 shadow-md transition duration-300 ease-in-out hover:scale-[1.015]"
            >
              <div className="mb-4 text-4xl font-bold text-blue-600">
                0{index + 1}
              </div>
              <h3 className="mb-1 text-xl font-bold text-gray-800">{step}</h3>
              <p className="text-gray-600">
                Our advanced AI analyzes your uploaded image and provides
                detailed information about its contents.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="mt-16">
        <h2 className="mb-8 text-center text-3xl font-extrabold text-gray-900">
          Features
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {[
            "Accurate Identification",
            "Detailed Information",
            "Fast Results",
            "User-Friendly Interface",
          ].map((feature, index) => (
            <div
              key={index}
              className="transform rounded-xl bg-white p-6 shadow-md transition duration-300 ease-in-out hover:scale-[1.012]"
            >
              <h3 className="mb-1 text-xl font-bold text-blue-600">
                {feature}
              </h3>
              <p className="text-gray-600">
                Our image identifier provides quick and accurate results with a
                simple, easy-to-use interface.
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
export default Main;
