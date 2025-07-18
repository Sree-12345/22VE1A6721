import React from 'react'

export default function lucideReact() {
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
}
