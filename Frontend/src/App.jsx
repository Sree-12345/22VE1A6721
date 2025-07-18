import React, { useState, useEffect } from 'react';
import { Link, Copy, Check, X, Plus, Trash2 } from 'lucide-react';

const App = () => {
  const [urls, setUrls] = useState(
    Array.from({ length: 5 }, (_, index) => ({
      id: index, 
      originalUrl: '', 
      shortenedUrl: '', 
      isLoading: false,
      isCopied: false,
      isValid: true,
    }))
  );


  const [message, setMessage] = useState({ text: '', type: '' });

  
  const shortenUrlApi = async (longUrl) => {
    
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000 + 500));


    if (!longUrl || !longUrl.startsWith('http')) {
      throw new Error('Please enter a valid URL starting with http:// or https://');
    }


    const shortCode = Math.random().toString(36).substring(2, 8);
    return `https://short.url/${shortCode}`;
  };


  const handleUrlChange = (id, value) => {
    setUrls((prevUrls) =>
      prevUrls.map((url) =>
        url.id === id ? { ...url, originalUrl: value, isValid: true, shortenedUrl: '', isCopied: false } : url
      )
    );
    setMessage({ text: '', type: '' });
  };

  
  const handleShortenUrl = async (id) => {
    setMessage({ text: '', type: '' });
    setUrls((prevUrls) =>
      prevUrls.map((url) => (url.id === id ? { ...url, isLoading: true, isCopied: false } : url))
    );

    const urlToShorten = urls.find((url) => url.id === id);

    if (!urlToShorten || !urlToShorten.originalUrl.trim()) {
      setUrls((prevUrls) =>
        prevUrls.map((url) =>
          url.id === id ? { ...url, isLoading: false, isValid: false } : url
        )
      );
      setMessage({ text: 'URL field cannot be empty.', type: 'error' });
      return;
    }

    try {
      const shortUrl = await shortenUrlApi(urlToShorten.originalUrl.trim());
      setUrls((prevUrls) =>
        prevUrls.map((url) =>
          url.id === id ? { ...url, shortenedUrl: shortUrl, isLoading: false, isValid: true } : url
        )
      );
      setMessage({ text: 'URL shortened successfully!', type: 'success' });
    } catch (error) {
      setUrls((prevUrls) =>
        prevUrls.map((url) =>
          url.id === id ? { ...url, isLoading: false, isValid: false } : url
        )
      );
      setMessage({ text: error.message, type: 'error' });
    }
  };


  const handleShortenAll = async () => {
    setMessage({ text: '', type: '' });
    let hasValidUrls = false;
    const newUrls = await Promise.all(
      urls.map(async (url) => {
        if (url.originalUrl.trim()) {
          hasValidUrls = true;
          try {
            const shortUrl = await shortenUrlApi(url.originalUrl.trim());
            return { ...url, shortenedUrl: shortUrl, isLoading: false, isValid: true };
          } catch (error) {
            setMessage({ text: error.message, type: 'error' });
            return { ...url, isLoading: false, isValid: false };
          }
        }
        return url;
      })
    );
    setUrls(newUrls);
    if (hasValidUrls) {
      setMessage({ text: 'All valid URLs processed!', type: 'success' });
    } else {
      setMessage({ text: 'No URLs to shorten. Please enter at least one URL.', type: 'error' });
    }
  };

  
  const handleCopyClick = (id, text) => {
    if (text) {
      
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        setUrls((prevUrls) =>
          prevUrls.map((url) => (url.id === id ? { ...url, isCopied: true } : url))
        );
        setMessage({ text: 'Copied to clipboard!', type: 'success' });
        
        setTimeout(() => {
          setUrls((prevUrls) =>
            prevUrls.map((url) => (url.id === id ? { ...url, isCopied: false } : url))
          );
        }, 2000);
      } catch (err) {
        console.error('Failed to copy: ', err);
        setMessage({ text: 'Failed to copy URL.', type: 'error' });
      } finally {
        document.body.removeChild(textarea);
      }
    }
  };

  
  const handleClearAll = () => {
    setUrls(
      Array.from({ length: 5 }, (_, index) => ({
        id: index,
        originalUrl: '',
        shortenedUrl: '',
        isLoading: false,
        isCopied: false,
        isValid: true,
      }))
    );
    setMessage({ text: 'All fields cleared.', type: 'info' });
  };

  
  const handleRemoveUrlField = (idToRemove) => {
    setUrls((prevUrls) => {
      const newUrls = prevUrls.filter((url) => url.id !== idToRemove);

      while (newUrls.length < 5) {
        newUrls.push({
          id: Math.max(...prevUrls.map(u => u.id)) + 1,
          originalUrl: '',
          shortenedUrl: '',
          isLoading: false,
          isCopied: false,
          isValid: true,
        });
      }
      return newUrls.slice(0, 5);
    });
    setMessage({ text: 'URL field removed.', type: 'info' });
  };

  
  const handleAddUrlField = () => {
    if (urls.length < 5) {
      setUrls((prevUrls) => [
        ...prevUrls,
        {
          id: Math.max(...prevUrls.map(u => u.id)) + 1,
          originalUrl: '',
          shortenedUrl: '',
          isLoading: false,
          isCopied: false,
          isValid: true,
        },
      ]);
      setMessage({ text: 'New URL field added.', type: 'info' });
    } else {
      setMessage({ text: 'Maximum 5 URL fields allowed.', type: 'warning' });
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-800 flex items-center justify-center p-4 font-inter">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-3xl border border-purple-300">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8 tracking-tight">
          <Link className="inline-block mr-3 text-purple-600" size={40} />
          URL Shortener
        </h1>

        {/* Message Box */}
        {message.text && (
          <div
            className={`p-3 mb-6 rounded-lg text-center font-medium ${
              message.type === 'success' ? 'bg-green-100 text-green-800' :
              message.type === 'error' ? 'bg-red-100 text-red-800' :
              'bg-blue-100 text-blue-800'
            }`}
            role="alert"
          >
            {message.text}
          </div>
        )}

        {/* URL Input Fields */}
        <div className="space-y-6 mb-8">
          {urls.map((url) => (
            <div key={url.id} className="flex flex-col md:flex-row items-center gap-4 bg-gray-50 p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="flex-grow w-full">
                <input
                  type="url"
                  placeholder="Enter your long URL here (e.g., https://example.com/very/long/path)"
                  value={url.originalUrl}
                  onChange={(e) => handleUrlChange(url.id, e.target.value)}
                  className={`w-full p-3 border ${
                    !url.isValid ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-purple-500'
                  } rounded-lg focus:ring-2 focus:ring-purple-200 outline-none transition-all duration-200`}
                  disabled={url.isLoading}
                />
                {!url.isValid && (
                  <p className="text-red-500 text-sm mt-1">Please enter a valid URL.</p>
                )}
              </div>

              <div className="flex flex-shrink-0 gap-2 w-full md:w-auto">
                <button
                  onClick={() => handleShortenUrl(url.id)}
                  className="flex items-center justify-center px-5 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
                  disabled={url.isLoading || !url.originalUrl.trim()}
                >
                  {url.isLoading ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <>Shorten</>
                  )}
                </button>

                {url.shortenedUrl && (
                  <div className="flex items-center bg-purple-100 text-purple-800 rounded-lg pr-2 shadow-inner min-w-[120px]">
                    <span className="p-3 truncate text-sm">{url.shortenedUrl}</span>
                    <button
                      onClick={() => handleCopyClick(url.id, url.shortenedUrl)}
                      className="p-2 ml-2 rounded-lg hover:bg-purple-200 transition-colors duration-200"
                      title="Copy to clipboard"
                    >
                      {url.isCopied ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <Copy className="w-5 h-5 text-purple-600" />
                      )}
                    </button>
                  </div>
                )}
                {urls.length > 1 && (
                  <button
                    onClick={() => handleRemoveUrlField(url.id)}
                    className="p-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-200"
                    title="Remove URL field"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={handleShortenAll}
            className="flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={urls.every(url => !url.originalUrl.trim()) || urls.some(url => url.isLoading)}
          >
            Shorten All Valid URLs
          </button>
          <button
            onClick={handleClearAll}
            className="flex items-center justify-center px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200"
          >
            Clear All
          </button>
          {urls.length < 5 && (
            <button
              onClick={handleAddUrlField}
              className="flex items-center justify-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200"
            >
              <Plus className="w-5 h-5 mr-2" /> Add URL Field
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;